package com.bookmagasin.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Ensures the order_status_history table accepts the COMPLETED enum value so
 * staff can mark orders as completed without manual DB intervention.
 */
@Component
public class OrderStatusHistorySchemaUpdater implements CommandLineRunner {

    private static final String COLUMN_TYPE_QUERY = "SHOW COLUMNS FROM order_status_history LIKE 'eorder_history'";

    private static final String ALTER_ENUM_SQL = """
            ALTER TABLE order_status_history
            MODIFY COLUMN eorder_history ENUM(
                'PENDING',
                'PROCESSING',
                'SHIPPED',
                'DELIVERED',
                'COMPLETED',
                'CANCELLED',
                'RETURNED'
            )
            """;

    private final JdbcTemplate jdbcTemplate;

    public OrderStatusHistorySchemaUpdater(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            String columnType = jdbcTemplate.query(COLUMN_TYPE_QUERY, rs -> rs.next() ? rs.getString("Type") : null);

            if (columnType == null || columnType.isBlank()) {
                System.out.println("[OrderStatusHistorySchemaUpdater] order_status_history table not found, skipping enum update.");
                return;
            }

            if (columnType.contains("COMPLETED")) {
                return; // already contains the value, nothing to do
            }

            jdbcTemplate.execute(ALTER_ENUM_SQL);
            System.out.println("[OrderStatusHistorySchemaUpdater] Added COMPLETED to order_status_history.eorder_history enum.");
        } catch (DataAccessException ex) {
            System.err.println("[OrderStatusHistorySchemaUpdater] Failed to update enum definition: " + ex.getMessage());
        }
    }
}
