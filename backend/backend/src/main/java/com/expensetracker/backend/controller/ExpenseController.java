
package com.expensetracker.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.ExpenseCategory;
import com.expensetracker.backend.service.ExpenseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // 1. Add Expense
    @PostMapping
    public ResponseEntity<Expense> addExpense(
            @Valid @RequestBody Expense expense) {

        expense.setId(null);

        Expense savedExpense =
                expenseService.addExpense(expense);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedExpense);
    }

    // 2. Get All Expenses or Filter by Category
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses(
            @RequestParam(required = false)
            ExpenseCategory category) {

        List<Expense> expenses;

        if (category == null) {
            expenses = expenseService.getAllExpenses();
        } else {
            expenses =
                    expenseService.getExpensesByCategory(category);
        }

        return ResponseEntity.ok(expenses);
    }

    // 3. Update Expense
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody Expense expense) {

        Expense updatedExpense =
                expenseService.updateExpense(id, expense);

        return ResponseEntity.ok(updatedExpense);
    }

    // 4. Delete Expense
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long id) {

        expenseService.deleteExpense(id);

        return ResponseEntity.noContent().build();
    }
}

