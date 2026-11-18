
CREATE DATABASE IF NOT EXISTS expense_tracker;

USE expense_tracker;

CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT chk_amount CHECK (amount > 0),
    CONSTRAINT chk_category CHECK (
        category IN ('Food', 'Travel', 'Shopping', 'Bills', 'Other')
    )
);

SELECT * FROM expenses;
