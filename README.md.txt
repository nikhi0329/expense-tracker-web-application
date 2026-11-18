# Expense Tracker Web Application

## Project Overview
The Expense Tracker is a Java Full Stack web application that helps users manage and track their daily expenses. Users can add, view, update, delete, and filter expenses by category.

## Technologies Used
- **Frontend:** React.js, HTML, CSS, JavaScript
- **Backend:** Java, Spring Boot, Spring Data JPA
- **Database:** MySQL
- **API Testing:** Postman
- **IDE:** Eclipse

## Features
- Add new expenses
- View all expenses
- Update existing expenses
- Delete expenses
- Filter expenses by category
- View total expense amount
- Validate expense details
- Display error messages for invalid or missing records

## Expense Categories
- Food
- Travel
- Shopping
- Bills
- Other

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/expenses` | Add an expense |
| GET | `/api/expenses` | Get all expenses |
| GET | `/api/expenses?category=Food` | Filter expenses |
| PUT | `/api/expenses/{id}` | Update an expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |

## How to Run the Project

### 1. Database Setup
- Open MySQL Workbench.
- Run the SQL script from the `database` folder.
- Configure your MySQL username and password in the backend `application.properties` file.

### 2. Run the Backend
- Open the backend project in Eclipse.
- Run the main Spring Boot application class.
- The backend runs on `http://localhost:8081` if configured with port 8081.

### 3. Run the Frontend
- Open a terminal inside the `frontend` folder.
- Run:

```bash
npm install
npm run dev
```

- Open `http://localhost:5173` in your browser.

## Project Structure

```text
ExpenseTracker/
├── backend/
├── frontend/
├── database/
│   └── expense_tracker.sql
├── postman/
├── screenshots/
└── README.md
```

## Project Purpose
This project was developed as part of a Java Full Stack internship task to demonstrate frontend development, REST API development, database integration, and CRUD operations.