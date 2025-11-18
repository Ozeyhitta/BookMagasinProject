-- ============================================
-- XÓA BẢNG account_roles (Không cần nữa)
-- ============================================

-- Bước 1: Kiểm tra xem bảng account_roles có tồn tại không
SHOW TABLES LIKE 'account_roles';

-- Bước 2: Xem dữ liệu trong bảng (nếu có)
SELECT * FROM account_roles LIMIT 10;

-- Bước 3: Xóa bảng account_roles
DROP TABLE IF EXISTS account_roles;

-- Bước 4: Kiểm tra lại
SHOW TABLES LIKE 'account_roles';
-- Kết quả mong đợi: Empty set (bảng đã được xóa)

-- ============================================
-- LƯU Ý:
-- ============================================
-- Sau khi xóa bảng account_roles, đảm bảo:
-- 1. Cột 'role' trong bảng 'account' có dữ liệu đúng
-- 2. Cập nhật role cho các account cần thiết:
--    UPDATE account SET role = 'STAFF' WHERE id = ?;
--    UPDATE account SET role = 'CUSTOMER' WHERE id = ?;
--    UPDATE account SET role = 'ADMIN' WHERE id = ?;

