
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8081/api/expenses";

const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    title: "",
    amount: "",
    category: "Food",
    date: ""
  };

  const [formData, setFormData] = useState(emptyForm);

  // GET expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const url =
        filter === "All"
          ? API_URL
          : `${API_URL}?category=${filter}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to load expenses.");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filter]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // POST and PUT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

  if (!formData.title.trim()) {
  setError("Expense title is required.");
  return;
}
if (!formData.amount || Number(formData.amount) <= 0) {
  setError("Amount must be greater than zero.");
  return;
}

if (!categories.includes(formData.category)) {
  setError("Please select a valid category.");
  return;
}

if (!formData.date) {
  setError("Please select an expense date.");
  return;
}

    try {
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...formData,
            title: formData.title.trim(),
            amount: Number(formData.amount)
          })
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Unable to save expense.");
      }

      setFormData(emptyForm);
      setEditingId(null);
      setMessage(isEditing ? "Expense updated successfully." : "Expense added successfully.");

      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  // Load existing expense into form
  const handleEdit = (expense) => {
    setEditingId(expense.id);

    setFormData({
      title: expense.title,
      amount: String(expense.amount),
      category: expense.category,
      date: expense.date
    });

    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  // DELETE expense
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Unable to delete expense.");
      }

      if (editingId === id) {
        handleCancel();
      }

      setMessage("Expense deleted successfully.");
      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredExpenses = expenses;

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const categoryTotals = categories.map((category) => {
    const amount = expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + Number(expense.amount), 0);

    return { category, amount };
  });

  const highestCategoryAmount = Math.max(
    ...categoryTotals.map((item) => item.amount),
    1
  );

  return (
    <main className="dashboard">

      <header className="page-header">
        <span className="eyebrow">PERSONAL FINANCE MANAGEMENT</span>
        <h1>Expense Tracker</h1>
        <p>Understand your spending. Make every rupee count.</p>
      </header>

      <div className="dashboard-panel">

        <div className="panel-heading">
          <span>YOUR FINANCIAL OVERVIEW</span>
          <span className="live-status">● LIVE DATA</span>
        </div>

        {/* SUMMARY */}
        <section className="summary-grid">

          <div className="summary-card primary-summary">
            <span>Total Expenses</span>
            <h2>₹{totalAmount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</h2>
            <p>{filter === "All" ? "Across all categories" : `Category: ${filter}`}</p>
          </div>

          <div className="summary-card">
            <span>Transactions</span>
            <h2>{expenses.length}</h2>
            <p>Recorded expenses</p>
          </div>

          <div className="summary-card">
            <span>Categories</span>
            <h2>{categoryTotals.filter(item => item.amount > 0).length}</h2>
            <p>Categories with spending</p>
          </div>

        </section>

        {/* CATEGORY OVERVIEW */}
        <section className="category-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SPENDING ANALYSIS</span>
              <h2>Category Overview</h2>
            </div>
            <span className="small-note">All recorded expenses</span>
          </div>

          <div className="category-grid">
            {categoryTotals.map((item) => (
              <div className="category-row" key={item.category}>
                <div className="category-label">
                  <span>{item.category}</span>
                  <strong>₹{item.amount.toFixed(2)}</strong>
                </div>

                <div className="bar-track">
                  <div
                    className={`bar-fill bar-${item.category.toLowerCase()}`}
                    style={{
                      width: `${(item.amount / highestCategoryAmount) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FORM AND EXPENSE TABLE */}
        <section className="workspace">

          <div className="expense-form-card">
            <span className="eyebrow">EXPENSE ENTRY</span>
            <h2>{editingId !== null ? "Edit Expense" : "Add an Expense"}</h2>
            <p className="form-description">
              Record your spending details below.
            </p>

            <form onSubmit={handleSubmit}>

              <label>Expense Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Grocery shopping"
                value={formData.title}
                onChange={handleChange}
                maxLength="100"
                required
              />

              <label>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
              />

              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <button className="submit-button" type="submit">
                {editingId !== null ? "Update Expense" : "Add Expense"}
              </button>

              {editingId !== null && (
                <button
                  className="cancel-button"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel Editing
                </button>
              )}

            </form>
          </div>

          <div className="table-card">
            <div className="section-heading">
              <div>
                <span className="eyebrow">TRANSACTION RECORDS</span>
                <h2>Expense Details</h2>
              </div>
            </div>

            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {error && <div className="alert error-alert">{error}</div>}
            {message && <div className="alert success-alert">{message}</div>}

            {loading ? (
              <p className="empty-state">Loading expenses...</p>
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="empty-state">
                          No expenses found. Add your first expense!
                        </td>
                      </tr>
                    ) : (
                      filteredExpenses.map(expense => (
                        <tr key={expense.id}>
                          <td className="expense-title">{expense.title}</td>
                          <td>
                            <span className={`category-tag tag-${expense.category.toLowerCase()}`}>
                              {expense.category}
                            </span>
                          </td>
                          <td>{expense.date}</td>
                          <td className="amount-cell">
                            ₹{Number(expense.amount).toFixed(2)}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="edit-button"
                                onClick={() => handleEdit(expense)}
                              >
                                Edit
                              </button>
                              <button
                                className="delete-button"
                                onClick={() => handleDelete(expense.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </section>

        <footer className="dashboard-footer">
          EXPENSE TRACKER · JAVA FULL STACK PROJECT
        </footer>

      </div>
    </main>
  );
}

export default App;
