/* CHECK LOGIN */
if (window.location.pathname.endsWith("app.html")) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn !== "true") {
    window.location.href = "index.html#login";
  }
}

function showView(viewName) {
  const views = document.querySelectorAll(".view");

  views.forEach(function (view) {
    view.classList.remove("active");
  });

  const selectedView = document.getElementById(viewName + "-view");

  if (selectedView) {
    selectedView.classList.add("active"); // Adds class "active" to this element to make it visible
  }
}

function handleRoute() {
  let route = window.location.hash.substring(1); // Get the route from the URL hash (removing the '#' character) like signup in #signup

  if (route === "") {
    // when route is empty, it will show the home view
    route = "home";
  }

  if (route === "features" || route === "how-it-works") {
    showView("home");
    document.getElementById(route).scrollIntoView({ behavior: "smooth" });
    return;
  }
  showView(route);
}

window.addEventListener("hashchange", handleRoute); // Call handleRoute when the hash in the URL changes

handleRoute(); // First time called by JS itself when page loads

/* AUTHENTICATION */

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

/* SIGNUP */

if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById(
      "signup-confirm-password",
    ).value;

    /* VALIDATION */
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    /* CHECK EXISTING USER */
    const existingUser = JSON.parse(localStorage.getItem("spendwiseUser"));

    if (existingUser) {
      if (existingUser.email === email) {
        alert("An account with this email already exists.");
        return;
      }
    }

    /* CREATE USER */
    const user = {
      name: name,
      email: email,
      password: password,
    };

    /* SAVE USER */
    localStorage.setItem("spendwiseUser", JSON.stringify(user));

    alert("Account created successfully!");
    window.location.hash = "login";
  });
}

/* LOGIN */
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    /* GET STORED USER */
    const storedUser = JSON.parse(localStorage.getItem("spendwiseUser"));
    if (!storedUser) {
      alert("No account found. Please create an account first.");
      return;
    }

    /* CHECK CREDENTIALS */
    if (email === storedUser.email && password === storedUser.password) {
      localStorage.setItem("isLoggedIn", "true");
      alert("Login successful!");
      window.location.href = "app.html";
    } else {
      alert("Invalid email or password.");
    }
  });
}

/* APP NAVIGATION */
const sidebarLinks = document.querySelectorAll(".sidebar-link");
const appSections = document.querySelectorAll(".app-section");

if (
  sidebarLinks.length > 0
) // To ensure that the code runs only on app.html where sidebar links exist, not on index.html
{
  // Functions are just defined here, not executed yet
  function showAppSection(sectionName) {
    appSections.forEach(function (section) {
      section.style.display = "none"; // Hides all sections by default
    });

    sidebarLinks.forEach(function (link) {
      link.classList.remove("active"); // Removes the "active" class from all sidebar links
    });

    const selectedSection = document.getElementById(sectionName + "-section");

    if (selectedSection) {
      selectedSection.style.display = "block"; // Shows the selected section
    }

    // Selects the sidebar link corresponding to the selected section
    const selectedLink = document.querySelector(
      '.sidebar-link[href="#' + sectionName + '"]',
    );

    if (selectedLink) {
      selectedLink.classList.add("active"); // Adds the "active" class to the selected sidebar link
    }
  }

  function handleAppRoute() {
    let route = window.location.hash.substring(1);
    if (
      route !== "dashboard" &&
      route !== "expenses" &&
      route !== "analytics" &&
      route !== "settings"
    ) {
      route = "dashboard";
    }
    showAppSection(route);
  }
  window.addEventListener("hashchange", handleAppRoute); // Register a fn to run later (when hash in URL changes)
  handleAppRoute(); // Actual fn call
}

/* LOGOUT */

const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    const confirmed = confirm("Are you sure you want to logout?");

    if (!confirmed) {
      return;
    }

    localStorage.setItem("isLoggedIn", "false");
    window.location.href = "index.html#login"; // Redirects to the login page after logout
  });
}

/* USER INFORMATION */

const storedUser = JSON.parse(localStorage.getItem("spendwiseUser"));

if (storedUser) {
  const userName = document.getElementById("user-name");
  const dashboardGreeting = document.getElementById("dashboard-greeting");

  if (userName) {
    userName.textContent = storedUser.name;
  }

  if (dashboardGreeting) {
    dashboardGreeting.textContent = "Hi, " + storedUser.name + "!";
  }
}

class Expense {
  constructor(id, amount, category, description, date) {
    this.id = id;
    this.amount = amount;
    this.category = category;
    this.description = description;
    this.date = date;
  }
}

/* EXPENSE MANAGEMENT */

const addExpenseBtn = document.getElementById("add-expense-btn");
const cancelExpenseBtn = document.getElementById("cancel-expense-btn");
const expenseFormContainer = document.getElementById("expense-form-container");
const expenseForm = document.getElementById("expense-form");
const categoryFilter = document.getElementById("category-filter");
const expenseSort = document.getElementById("expense-sort");

let editingExpenseId = null; // Variable to track the ID of the expense being edited (diff bw create and edit)

if (addExpenseBtn) {
  addExpenseBtn.addEventListener("click", function () {
    editingExpenseId = null;
    expenseForm.reset();
    expenseFormContainer.classList.add("show"); // Show the expense form container when the "Add Expense" button is clicked
  });
}

if (cancelExpenseBtn) {
  cancelExpenseBtn.addEventListener("click", function () {
    editingExpenseId = null;
    expenseForm.reset();
    expenseFormContainer.classList.remove("show"); // Hide the form container
  });
}

if (expenseForm) {
  expenseForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior done by browser

    const amount = document.getElementById("expense-amount").value;
    const category = document.getElementById("expense-category").value;
    const description = document
      .getElementById("expense-description")
      .value.trim();
    const date = document.getElementById("expense-date").value;

    if (amount === "" || category === "" || description === "" || date === "") {
      alert("Please fill in all fields.");
      return;
    }
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    /* UPDATE EXISTING EXPENSE */
    if (editingExpenseId !== null) {
      const expenseIndex = expenses.findIndex(function (item) {
        return item.id === editingExpenseId;
      });

      if (expenseIndex !== -1) {
        expenses[expenseIndex] = new Expense(
          editingExpenseId, // Keep the same ID for the updated expense
          Number(amount), // Number() is used to convert the string input to a number
          category,
          description,
          date,
        );
      }
      alert("Expense updated successfully!");
      editingExpenseId = null;
    } else {
      /* CREATE NEW EXPENSE */
      const expense = new Expense(
        Date.now(), // Unique ID based on current timestamp
        Number(amount),
        category,
        description,
        date,
      );

      expenses.push(expense); // Add the new expense object to the expenses array
      alert("Expense added successfully!");
    }
    localStorage.setItem("expenses", JSON.stringify(expenses));
    expenseForm.reset();
    expenseFormContainer.classList.remove("show");
    displayExpenses();
  });
}
function formatExpenseDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
/* READ EXPENSES */
// Function to display the list of expenses on the page as HTML
const expenseList = document.getElementById("expense-list");
function displayExpenses() {
  // Check if we are on any other page than app.html, then expenseList will be null, so we need to return from this function
  if (!expenseList) {
    return;
  }
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const selectedCategory = categoryFilter
    ? categoryFilter.value.trim().toLowerCase()
    : "all";
  const selectedSort = expenseSort ? expenseSort.value : "newest";

  let filteredExpenses = expenses.filter(function (expense) {
    return (
      selectedCategory === "all" ||
      expense.category.trim().toLowerCase() === selectedCategory
    );
  });
  filteredExpenses.sort(function (a, b) {
    if (selectedSort === "oldest") {
      return new Date(a.date) - new Date(b.date);
    }
    if (selectedSort === "highest") {
      return b.amount - a.amount;
    }
    if (selectedSort === "lowest") {
      return a.amount - b.amount;
    }
    return new Date(b.date) - new Date(a.date);
  });
  const expenseCountLabel = document.getElementById("expense-count-label");
  if (expenseCountLabel) {
    const count = filteredExpenses.length;
    expenseCountLabel.textContent =
      count + (count === 1 ? " transaction" : " transactions");
  }
  if (expenses.length === 0) {
    expenseList.innerHTML = `
            <div class="empty-expense-state">
                <h3>No expenses yet</h3>
                <p>Start tracking your spending by adding your first expense.</p>
                <button type="button" id="empty-add-expense">+ Add Expense</button>
            </div>
        `;
    const emptyAddExpenseBtn = document.getElementById("empty-add-expense");
    if (emptyAddExpenseBtn) {
      emptyAddExpenseBtn.addEventListener("click", function () {
        editingExpenseId = null;
        expenseForm.reset();
        expenseFormContainer.classList.add("show");
      });
    }
    updateDashboard();
    updateAnalytics();
    return;
  }
  if (filteredExpenses.length === 0) {
    expenseList.innerHTML = `
            <div class="empty-expense-state">
                <h3>No matching expenses</h3>
                <p>Try changing the category or sorting options.</p>
            </div>
        `;
    updateDashboard();
    updateAnalytics();
    return;
  }
  expenseList.innerHTML = "";
  filteredExpenses.forEach(function (expense) {
    const expenseItem = document.createElement("div");
    expenseItem.className = "expense-item";
    // Template literal to create the HTML structure
    expenseItem.innerHTML = `
            <div>
                <h4>${expense.description}</h4>
                <p>${formatExpenseDate(expense.date)}</p>
            </div>
            <div class="expense-category category-${expense.category.toLowerCase()}">${expense.category}</div>
            <div class="expense-amount">₹${expense.amount.toLocaleString("en-IN")}</div>
            <div class="expense-actions">
                <button class="edit-expense" data-id="${expense.id}">Edit</button>
                <button class="delete-expense" data-id="${expense.id}">Delete</button>
            </div>
        `;
    expenseList.appendChild(expenseItem); // Shows the expense item on the page by appending it to the expenseList container
  });
  const editButtons = document.querySelectorAll(".edit-expense");
  editButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      editExpense(Number(button.dataset.id)); // Calls the editExpense function with the ID of the expense to be edited when the "Edit" button is clicked
    });
  });
  const deleteButtons = document.querySelectorAll(".delete-expense");
  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      deleteExpense(Number(button.dataset.id)); // Calls the deleteExpense function with the ID of the expense to be deleted when the "Delete" button is clicked
    });
  });
  updateDashboard();
  updateAnalytics();
}
// Filter/sort event listeners
if (categoryFilter) {
  categoryFilter.addEventListener("change", displayExpenses);
}
if (expenseSort) {
  expenseSort.addEventListener("change", displayExpenses);
}

function editExpense(id) {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  const expense = expenses.find(function (item) {
    // searches for the object with that ID
    return item.id === id;
  });

  if (!expense) {
    return;
  }
  editingExpenseId = id; // Set the editingExpenseId to the id of the expense being edited

  document.getElementById("expense-amount").value = expense.amount;
  document.getElementById("expense-category").value = expense.category;
  document.getElementById("expense-description").value = expense.description;
  document.getElementById("expense-date").value = expense.date;

  expenseFormContainer.classList.add("show");
}
function deleteExpense(id) {
  const confirmed = confirm("Are you sure you want to delete this expense?");

  if (!confirmed) {
    return;
  }
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  const updatedExpenses = expenses.filter(function (expense) {
    return expense.id !== id;
  });

  localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

  alert("Expense deleted successfully!");
  displayExpenses();
}

/* BUDGET AND DASHBOARD */

const defaultBudget = 25000;
function getBudget() {
  return Number(localStorage.getItem("monthlyBudget")) || defaultBudget;
}

function updateDashboard() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const budget = getBudget();

  const totalSpent = expenses.reduce(function (total, expense) {
    return total + expense.amount;
  }, 0);

  const remaining = budget - totalSpent;

  const totalSpentElement = document.getElementById("total-spent");
  const monthlyBudgetElement = document.getElementById("monthly-budget");
  const remainingBudgetElement = document.getElementById("remaining-budget");
  const transactionCountElement = document.getElementById("transaction-count");
  const settingsBudgetElement = document.getElementById(
    "settings-current-budget",
  );

  if (totalSpentElement) {
    totalSpentElement.textContent = "₹" + totalSpent.toLocaleString("en-IN");
  }

  if (monthlyBudgetElement) {
    monthlyBudgetElement.textContent = "₹" + budget.toLocaleString("en-IN");
  }

  if (settingsBudgetElement) {
    settingsBudgetElement.textContent = "₹" + budget.toLocaleString("en-IN");
  }

  if (remainingBudgetElement) {
    remainingBudgetElement.textContent =
      "₹" + remaining.toLocaleString("en-IN");
  }

  if (transactionCountElement) {
    transactionCountElement.textContent = expenses.length;
  }

  const budgetProgressText = document.getElementById("budget-progress-text");
  const budgetPercentage = document.getElementById("budget-percentage");
  const budgetProgressFill = document.getElementById("budget-progress-fill");
  const budgetStatus = document.getElementById("budget-status");
  const progress = budget > 0 ? (totalSpent / budget) * 100 : 0;
  const displayedProgress = Math.min(progress, 100);

  if (budgetProgressText) {
    budgetProgressText.textContent =
      "₹" +
      totalSpent.toLocaleString("en-IN") +
      " of ₹" +
      budget.toLocaleString("en-IN");
  }
  if (budgetPercentage) {
    budgetPercentage.textContent = Math.round(progress) + "%";
  }
  if (budgetProgressFill) {
    budgetProgressFill.style.width = displayedProgress + "%";
  }
  if (budgetStatus) {
    if (totalSpent > budget) {
      budgetStatus.textContent = "You've exceeded your budget.";
      budgetStatus.style.color = "#ef4444";
    } else if (budget > 0 && totalSpent / budget >= 0.8) {
      budgetStatus.textContent = "You're approaching your budget limit.";
      budgetStatus.style.color = "#f59e0b";
    } else {
      budgetStatus.textContent = "You're within your budget.";
      budgetStatus.style.color = "#858585";
    }
  }
  const recentExpensesList = document.getElementById("recent-expenses-list");
  if (recentExpensesList) {
    recentExpensesList.innerHTML = "";
    const recentExpenses = [...expenses]
      .sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      })
      .slice(0, 3);
    if (recentExpenses.length === 0) {
      recentExpensesList.innerHTML =
        '<p class="recent-empty">No expenses yet.</p>';
    } else {
      recentExpenses.forEach(function (expense) {
        const recentItem = document.createElement("div");
        recentItem.className = "recent-expense-item";
        recentItem.innerHTML = `
                <div>
                    <h4>${expense.description}</h4>
                   <p>${expense.category} • ${formatExpenseDate(expense.date)}</p> 
                </div>
                <span>₹${expense.amount.toLocaleString("en-IN")}</span>
            `;
        recentExpensesList.appendChild(recentItem);
      });
    }
  }
}

const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");

if (budgetForm) {
  budgetInput.value = getBudget();
  budgetForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const budget = Number(budgetInput.value);

    if (budget <= 0) {
      alert("Please enter a valid budget.");
      return;
    }

    localStorage.setItem("monthlyBudget", budget);
    alert("Budget saved successfully!");
    updateDashboard();
    updateAnalytics();
  });
}

/* ANALYTICS */

function updateAnalytics() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const total = expenses.reduce(function (sum, expense) {
    return sum + expense.amount;
  }, 0);
  const categoryTotals = {};
  expenses.forEach(function (expense) {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
  });
  let topCategory = "-";
  let highestAmount = 0;
  for (const category in categoryTotals) {
    if (categoryTotals[category] > highestAmount) {
      highestAmount = categoryTotals[category];
      topCategory = category;
    }
  }
  const analyticsTotal = document.getElementById("analytics-total");
  const analyticsTransactions = document.getElementById(
    "analytics-transactions",
  );
  const analyticsTopCategory = document.getElementById(
    "analytics-top-category",
  );
  const analyticsTopCategoryPercentage = document.getElementById(
    "analytics-top-category-percentage",
  );
  if (analyticsTotal) {
    analyticsTotal.textContent = "₹" + total.toLocaleString("en-IN");
  }
  if (analyticsTransactions) {
    analyticsTransactions.textContent = expenses.length;
  }
  if (analyticsTopCategory) {
    analyticsTopCategory.textContent = topCategory;
  }
  if (analyticsTopCategoryPercentage) {
    const topPercentage = total > 0 ? (highestAmount / total) * 100 : 0;
    analyticsTopCategoryPercentage.textContent =
      topCategory === "-"
        ? "0% of spending"
        : Math.round(topPercentage) + "% of spending";
  }
  const categoryList = document.getElementById("category-list");
  if (categoryList) {
    categoryList.innerHTML = "";
    for (const category in categoryTotals) {
      const categoryItem = document.createElement("div");
      categoryItem.className = "category-item category-" + category.toLowerCase();
      const percentage =
        total > 0 ? (categoryTotals[category] / total) * 100 : 0;
      categoryItem.innerHTML = `
        <div class="category-info">
            <span>${category}</span>
            <span>₹${categoryTotals[category].toLocaleString("en-IN")} · ${Math.round(percentage)}%</span>
        </div>
        <div class="category-bar">
            <div class="category-bar-fill" style="width: ${percentage}%"></div>
        </div>
    `;
      categoryList.appendChild(categoryItem);
    }
  }
}

// updateAnalytics();
displayExpenses(); // Call the displayExpenses function to show the list of expenses when the page loads
