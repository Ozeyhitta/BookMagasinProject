-- Create support_request table
CREATE TABLE IF NOT EXISTS support_request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    issue VARCHAR(255),
    description LONGTEXT,
    status VARCHAR(50) DEFAULT 'OPEN',
    staff_response LONGTEXT,
    staff_id INT,
    staff_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);
