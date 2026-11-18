
package com.expensetracker.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.ExpenseCategory;

@Repository
public interface ExpenseRepository
        extends JpaRepository<Expense, Long> {

    List<Expense> findByCategory(ExpenseCategory category);

}
