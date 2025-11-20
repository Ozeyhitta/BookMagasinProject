-- Remove legacy UNIQUE indexes on orders so many orders can share a payment/service
-- Run this against the bookmagasin database (or adjust USE as needed)

USE bookmagasin;

-- Capture constraint names
SET @fk_payment := (
    SELECT constraint_name
    FROM information_schema.referential_constraints
    WHERE constraint_schema = DATABASE()
      AND table_name = 'orders'
      AND referenced_table_name = 'payment'
    LIMIT 1
);

SET @fk_service := (
    SELECT constraint_name
    FROM information_schema.referential_constraints
    WHERE constraint_schema = DATABASE()
      AND table_name = 'orders'
      AND referenced_table_name = 'service'
    LIMIT 1
);

SET @idx_payment := (
    SELECT index_name
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'orders'
      AND column_name = 'payment_id'
      AND non_unique = 0
    LIMIT 1
);

SET @idx_service := (
    SELECT index_name
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'orders'
      AND column_name = 'service_id'
      AND non_unique = 0
    LIMIT 1
);

-- Drop FK constraints first (they depend on the unique indexes)
SET @sql_drop_fk_payment := IF(
    @fk_payment IS NOT NULL,
    CONCAT('ALTER TABLE orders DROP FOREIGN KEY ', @fk_payment),
    'SELECT 1'
);
PREPARE stmt FROM @sql_drop_fk_payment;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql_drop_fk_service := IF(
    @fk_service IS NOT NULL,
    CONCAT('ALTER TABLE orders DROP FOREIGN KEY ', @fk_service),
    'SELECT 1'
);
PREPARE stmt FROM @sql_drop_fk_service;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop UNIQUE indexes
SET @sql_drop_idx_payment := IF(
    @idx_payment IS NOT NULL,
    CONCAT('ALTER TABLE orders DROP INDEX ', @idx_payment),
    'SELECT 1'
);
PREPARE stmt FROM @sql_drop_idx_payment;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql_drop_idx_service := IF(
    @idx_service IS NOT NULL,
    CONCAT('ALTER TABLE orders DROP INDEX ', @idx_service),
    'SELECT 1'
);
PREPARE stmt FROM @sql_drop_idx_service;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Recreate non-unique indexes (for FK performance)
ALTER TABLE orders
    ADD INDEX IDX_orders_payment_id (payment_id),
    ADD INDEX IDX_orders_service_id (service_id);

-- Re-add FK constraints without unique requirement
SET @sql_add_fk_payment := 'ALTER TABLE orders ADD CONSTRAINT FK_orders_payment FOREIGN KEY (payment_id) REFERENCES payment(id)';
PREPARE stmt FROM @sql_add_fk_payment;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql_add_fk_service := 'ALTER TABLE orders ADD CONSTRAINT FK_orders_service FOREIGN KEY (service_id) REFERENCES service(id)';
PREPARE stmt FROM @sql_add_fk_service;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Show current indexes for verification
SHOW INDEX FROM orders;
