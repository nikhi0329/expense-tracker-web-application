
package com.expensetracker.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.ExpenseCategory;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.exception.ResourceNotFoundException;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    // Add Expense
    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    // Get All Expenses
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // Filter Expenses
    public List<Expense> getExpensesByCategory(
            ExpenseCategory category) {
        return expenseRepository.findByCategory(category);
    }

    // Find Expense By ID

public Expense getExpenseById(Long id) {

    return expenseRepository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Expense not found with id: " + id
                )
            );
}


    // Update Expense
    public Expense updateExpense(Long id, Expense expense) {

        Expense existing = getExpenseById(id);

        existing.setTitle(expense.getTitle());
        existing.setAmount(expense.getAmount());
        existing.setCategory(expense.getCategory());
        existing.setDate(expense.getDate());

        return expenseRepository.save(existing);
    }

    // Delete Expense
    public void deleteExpense(Long id) {

        Expense existing = getExpenseById(id);

        expenseRepository.delete(existing);
    }
}

