-- ============================================================
-- 社会痛点信息收集与统计分析平台 - 数据库建表脚本
-- 数据库: MySQL 8.0+
-- 字符集: utf8mb4
-- ============================================================

-- 创建数据库（如不存在）
CREATE DATABASE IF NOT EXISTS social_pain_point
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE social_pain_point;

-- ============================================================
-- 1. 痛点提交表 pain_point_report
-- ============================================================
DROP TABLE IF EXISTS `pain_point_report`;
CREATE TABLE `pain_point_report` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `scene_type` VARCHAR(50) NOT NULL COMMENT '场景类型',
    `industry_type` VARCHAR(50) NOT NULL COMMENT '行业类型',
    `content` TEXT NOT NULL COMMENT '痛点描述内容',
    `contact_way` VARCHAR(20) DEFAULT NULL COMMENT '联系方式类型（手机/邮箱/微信等）',
    `contact_info_encrypted` VARCHAR(512) DEFAULT NULL COMMENT '加密后的联系方式',
    `submit_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
    `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态: 0-待审核, 1-已通过, 2-已拒绝',
    `reviewer_id` BIGINT DEFAULT NULL COMMENT '审核人ID',
    `review_time` DATETIME DEFAULT NULL COMMENT '审核时间',
    `review_remark` VARCHAR(500) DEFAULT NULL COMMENT '审核备注',
    PRIMARY KEY (`id`),
    INDEX `idx_scene_type` (`scene_type`),
    INDEX `idx_industry_type` (`industry_type`),
    INDEX `idx_status` (`status`),
    INDEX `idx_submit_time` (`submit_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='痛点提交表';

-- ============================================================
-- 2. 管理员表 admin_user
-- ============================================================
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希值',
    `role` VARCHAR(20) NOT NULL DEFAULT 'admin' COMMENT '角色: admin-普通管理员, super_admin-超级管理员',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
    `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- ============================================================
-- 3. 分类字典表 pain_point_category
-- ============================================================
DROP TABLE IF EXISTS `pain_point_category`;
CREATE TABLE `pain_point_category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `category_name` VARCHAR(100) NOT NULL COMMENT '分类名称',
    `category_type` VARCHAR(20) NOT NULL COMMENT '分类类型: scene-场景类型, industry-行业类型',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序序号',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
    PRIMARY KEY (`id`),
    INDEX `idx_category_type` (`category_type`),
    UNIQUE INDEX `uk_type_name` (`category_type`, `category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类字典表';

-- ============================================================
-- 4. 操作日志表 operation_log
-- ============================================================
DROP TABLE IF EXISTS `operation_log`;
CREATE TABLE `operation_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `operator_id` BIGINT NOT NULL COMMENT '操作人ID',
    `action` VARCHAR(50) NOT NULL COMMENT '操作动作（login/review/export等）',
    `target` VARCHAR(100) DEFAULT NULL COMMENT '操作目标',
    `detail` TEXT DEFAULT NULL COMMENT '操作详情',
    `ip_address` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    INDEX `idx_operator_id` (`operator_id`),
    INDEX `idx_action` (`action`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- ============================================================
-- 初始数据插入
-- ============================================================

-- 插入默认管理员（密码: admin123，BCrypt加密）
INSERT INTO `admin_user` (`username`, `password_hash`, `role`, `status`) VALUES
('yan123', '$2a$10$8.UnVuG9HHgffUDAlk8q7Ou5f2AFmyayIPVCxSUXtkF9X/O5TSWCG', 'super_admin', 1),
('zhou123', '$2a$10$8.UnVuG9HHgffUDAlk8q7Ou5f2AFmyayIPVCxSUXtkF9X/O5TSWCG', 'super_admin', 1);

-- 插入场景类型字典
INSERT INTO `pain_point_category` (`category_name`, `category_type`, `sort_order`) VALUES
('教育', 'scene', 1),
('医疗', 'scene', 2),
('住房', 'scene', 3),
('就业', 'scene', 4),
('养老', 'scene', 5),
('交通', 'scene', 6),
('环保', 'scene', 7),
('食品安全', 'scene', 8),
('公共安全', 'scene', 9),
('其他', 'scene', 99);

-- 插入行业类型字典
INSERT INTO `pain_point_category` (`category_name`, `category_type`, `sort_order`) VALUES
('互联网/IT', 'industry', 1),
('制造业', 'industry', 2),
('金融业', 'industry', 3),
('教育业', 'industry', 4),
('医疗健康', 'industry', 5),
('房地产', 'industry', 6),
('零售/电商', 'industry', 7),
('交通运输', 'industry', 8),
('农林牧渔', 'industry', 9),
('政府/公共事业', 'industry', 10),
('其他', 'industry', 99);
