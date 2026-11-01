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

function readStorageJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (value === null || value === undefined || value === "") {
      return fallback;
    }
    const parsedValue = JSON.parse(value);
    return parsedValue === null ? fallback : parsedValue;
  } catch (error) {
    return fallback;
  }
}

function formatMonthKey(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue + "T00:00:00");
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return year + "-" + month;
}

function parseDateString(dateString) {
  if (!dateString || typeof dateString !== "string") {
    return new Date(NaN);
  }

  const trimmedValue = dateString.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    return new Date(NaN);
  }

  const [year, month, day] = trimmedValue.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getCurrentMonthKey() {
  return formatMonthKey(new Date());
}

function getMonthLabel(monthKey) {
  if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
    return "This Month";
  }

  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function getSelectedMonthKey() {
  const currentMonthKey = getCurrentMonthKey();
  const savedMonth = localStorage.getItem("selectedMonth");

  if (!savedMonth || !/^\d{4}-\d{2}$/.test(savedMonth)) {
    return currentMonthKey;
  }

  return savedMonth <= currentMonthKey ? savedMonth : currentMonthKey;
}

function setSelectedMonthKey(monthKey) {
  const currentMonthKey = getCurrentMonthKey();

  if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
    return;
  }

  if (monthKey <= currentMonthKey) {
    localStorage.setItem("selectedMonth", monthKey);
  }
}

function getMonthKeyFromExpense(dateString) {
  const parsedDate = parseDateString(dateString);
  if (Number.isNaN(parsedDate.getTime())) {
    return getCurrentMonthKey();
  }
  return formatMonthKey(parsedDate);
}

function getBudgetForMonth(monthKey) {
  const budgets = readStorageJSON("monthlyBudgets", {});
  const selectedKey = monthKey || getSelectedMonthKey();
  return Number(budgets[selectedKey]) || defaultBudget;
}

function saveBudgetForMonth(monthKey, budgetValue) {
  const budgets = readStorageJSON("monthlyBudgets", {});
  budgets[monthKey] = Number(budgetValue);
  localStorage.setItem("monthlyBudgets", JSON.stringify(budgets));
}

function migrateLegacyBudgetStorage() {
  const budgets = readStorageJSON("monthlyBudgets", {});
  const currentMonthKey = getCurrentMonthKey();
  const legacyBudget = Number(localStorage.getItem("monthlyBudget"));

  if (Number.isFinite(legacyBudget) && legacyBudget > 0 && !budgets[currentMonthKey]) {
    budgets[currentMonthKey] = legacyBudget;
    localStorage.setItem("monthlyBudgets", JSON.stringify(budgets));
  }

  if (!localStorage.getItem("monthlyBudgets") && Number.isFinite(legacyBudget) && legacyBudget > 0) {
    localStorage.setItem("monthlyBudgets", JSON.stringify({ [currentMonthKey]: legacyBudget }));
  }

  if (!localStorage.getItem("selectedMonth")) {
    localStorage.setItem("selectedMonth", currentMonthKey);
  }
}

function renderMonthSelectors() {
  const selectedMonthKey = getSelectedMonthKey();
  const currentMonthKey = getCurrentMonthKey();
  const monthLabels = document.querySelectorAll(".month-label");
  monthLabels.forEach(function (label) {
    label.textContent = getMonthLabel(selectedMonthKey);
  });

  const budgetInput = document.getElementById("budget-input");
  if (budgetInput) {
    budgetInput.value = getBudgetForMonth(selectedMonthKey);
  }

  document.querySelectorAll(".month-nav-btn").forEach(function (button) {
    const direction = button.dataset.monthNav;
    const isDisabled = direction === "next" && selectedMonthKey >= currentMonthKey;
    button.disabled = isDisabled;
  });

  document.querySelectorAll(".current-month-btn").forEach(function (button) {
    button.disabled = selectedMonthKey === currentMonthKey;
  });
}

function refreshMonthDependentData() {
  renderMonthSelectors();
  updateDashboard();
  updateAnalytics();
  displayExpenses();
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
  if (!expenseList) {
    return;
  }

  const expenses = readStorageJSON("expenses", []);
  const selectedCategory = categoryFilter
    ? categoryFilter.value.trim().toLowerCase()
    : "all";
  const selectedSort = expenseSort ? expenseSort.value : "newest";
  const monthViewFilter = document.getElementById("month-view-filter");
  const activeView = monthViewFilter ? monthViewFilter.value : "selected";
  const selectedMonthKey = getSelectedMonthKey();

  let filteredExpenses = expenses.filter(function (expense) {
    const matchesSelectedMonth =
      activeView === "all" || getMonthKeyFromExpense(expense.date) === selectedMonthKey;

    const matchesCategory =
      selectedCategory === "all" ||
      String(expense.category).trim().toLowerCase() === selectedCategory;

    return matchesSelectedMonth && matchesCategory;
  });

  filteredExpenses.sort(function (a, b) {
    if (selectedSort === "oldest") {
      return parseDateString(a.date) - parseDateString(b.date);
    }
    if (selectedSort === "highest") {
      return Number(b.amount) - Number(a.amount);
    }
    if (selectedSort === "lowest") {
      return Number(a.amount) - Number(b.amount);
    }
    return parseDateString(b.date) - parseDateString(a.date);
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
    const emptyMessage =
      activeView === "all"
        ? "No expenses match your current filters."
        : "No expenses recorded for " + getMonthLabel(selectedMonthKey) + ".";

    expenseList.innerHTML = `
            <div class="empty-expense-state">
                <h3>No matching expenses</h3>
                <p>${emptyMessage}</p>
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
    expenseItem.innerHTML = `
            <div>
                <h4>${expense.description}</h4>
                <p>${formatExpenseDate(expense.date)}</p>
            </div>
            <div class="expense-category category-${String(expense.category).toLowerCase()}">${expense.category}</div>
            <div class="expense-amount">₹${Number(expense.amount).toLocaleString("en-IN")}</div>
            <div class="expense-actions">
                <button class="edit-expense" data-id="${expense.id}">Edit</button>
                <button class="delete-expense" data-id="${expense.id}">Delete</button>
            </div>
        `;
    expenseList.appendChild(expenseItem);
  });

  const editButtons = document.querySelectorAll(".edit-expense");
  editButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      editExpense(Number(button.dataset.id));
    });
  });

  const deleteButtons = document.querySelectorAll(".delete-expense");
  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      deleteExpense(Number(button.dataset.id));
    });
  });

  updateDashboard();
  updateAnalytics();
}

if (categoryFilter) {
  categoryFilter.addEventListener("change", displayExpenses);
}
if (expenseSort) {
  expenseSort.addEventListener("change", displayExpenses);
}
if (document.getElementById("month-view-filter")) {
  document.getElementById("month-view-filter").addEventListener("change", displayExpenses);
}

const monthNavigationButtons = document.querySelectorAll(".month-nav-btn");
monthNavigationButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const direction = button.dataset.monthNav;
    const currentMonthKey = getCurrentMonthKey();
    const selectedMonthKey = getSelectedMonthKey();
    const [year, month] = selectedMonthKey.split("-").map(Number);
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + (direction === "next" ? 1 : -1));

    const nextMonthKey = formatMonthKey(date);
    if (nextMonthKey <= currentMonthKey) {
      setSelectedMonthKey(nextMonthKey);
      refreshMonthDependentData();
    }
  });
});

document.querySelectorAll(".current-month-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    setSelectedMonthKey(getCurrentMonthKey());
    refreshMonthDependentData();
  });
});

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

function getBudget(monthKey) {
  return getBudgetForMonth(monthKey || getSelectedMonthKey());
}

function updateDashboard() {
  const expenses = readStorageJSON("expenses", []);
  const selectedMonthKey = getSelectedMonthKey();
  const monthExpenses = expenses.filter(function (expense) {
    return getMonthKeyFromExpense(expense.date) === selectedMonthKey;
  });
  const budget = getBudget(selectedMonthKey);
  const totalSpent = monthExpenses.reduce(function (total, expense) {
    return total + Number(expense.amount);
  }, 0);

  const remaining = budget - totalSpent;

  const totalSpentElement = document.getElementById("total-spent");
  const monthlyBudgetElement = document.getElementById("monthly-budget");
  const remainingBudgetElement = document.getElementById("remaining-budget");
  const transactionCountElement = document.getElementById("transaction-count");
  const settingsBudgetElement = document.getElementById("settings-current-budget");
  const budgetProgressText = document.getElementById("budget-progress-text");
  const budgetPercentage = document.getElementById("budget-percentage");
  const budgetProgressFill = document.getElementById("budget-progress-fill");
  const budgetStatus = document.getElementById("budget-status");
  const recentExpensesList = document.getElementById("recent-expenses-list");

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
    remainingBudgetElement.textContent = "₹" + remaining.toLocaleString("en-IN");
  }

  if (transactionCountElement) {
    transactionCountElement.textContent = monthExpenses.length;
  }

  const progress = budget > 0 ? (totalSpent / budget) * 100 : 0;
  const displayedProgress = Math.min(progress, 100);

  if (budgetProgressText) {
    budgetProgressText.textContent =
      "₹" + totalSpent.toLocaleString("en-IN") + " of ₹" + budget.toLocaleString("en-IN");
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

  if (recentExpensesList) {
    recentExpensesList.innerHTML = "";
    const recentExpenses = [...monthExpenses]
      .sort(function (a, b) {
        return parseDateString(b.date) - parseDateString(a.date);
      })
      .slice(0, 3);

    if (recentExpenses.length === 0) {
      recentExpensesList.innerHTML = '<p class="recent-empty">No expenses yet.</p>';
    } else {
      recentExpenses.forEach(function (expense) {
        const recentItem = document.createElement("div");
        recentItem.className = "recent-expense-item";
        recentItem.innerHTML = `
                <div>
                    <h4>${expense.description}</h4>
                   <p>${expense.category} • ${formatExpenseDate(expense.date)}</p>
                </div>
                <span>₹${Number(expense.amount).toLocaleString("en-IN")}</span>
            `;
        recentExpensesList.appendChild(recentItem);
      });
    }
  }
}

const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");

if (budgetForm) {
  if (budgetInput) {
    budgetInput.value = getBudget();
  }

  budgetForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const budget = Number(budgetInput.value);
    const selectedMonthKey = getSelectedMonthKey();

    if (budget <= 0) {
      alert("Please enter a valid budget.");
      return;
    }

    saveBudgetForMonth(selectedMonthKey, budget);
    alert("Budget saved successfully for " + getMonthLabel(selectedMonthKey) + ".");
    updateDashboard();
    updateAnalytics();
    renderMonthSelectors();
  });
}

/* ANALYTICS */

const categoryColors = {
  Food: "#22c55e",
  Shopping: "#a78bfa",
  Health: "#38bdf8",
  Travel: "#f59e0b",
  Entertainment: "#f472b6",
  Bills: "#ef4444",
  Education: "#2f8d9e",
  Other: "#9ca3af",
};
function updateAnalytics() {
  const expenses = readStorageJSON("expenses", []);
  const selectedMonthKey = getSelectedMonthKey();
  const selectedMonthExpenses = expenses.filter(function (expense) {
    return getMonthKeyFromExpense(expense.date) === selectedMonthKey;
  });
  const total = selectedMonthExpenses.reduce(function (sum, expense) {
    return sum + Number(expense.amount);
  }, 0);
  const categoryTotals = {};

  selectedMonthExpenses.forEach(function (expense) {
    const category = expense.category;
    categoryTotals[category] = (categoryTotals[category] || 0) + Number(expense.amount);
  });

  const donutChart = document.getElementById("donut-chart");
  const donutTotal = document.getElementById("donut-total");
  const donutLegend = document.getElementById("donut-legend");

  if (donutChart && donutTotal && donutLegend) {
    donutTotal.textContent = "₹" + total.toLocaleString("en-IN");
    donutLegend.innerHTML = "";

    const categories = Object.keys(categoryTotals);
    if (categories.length === 0) {
      donutChart.style.background = "conic-gradient(#292929 0deg 360deg)";
      donutLegend.innerHTML = '<div class="empty-chart-message">No expenses recorded for this month.</div>';
    } else {
      let currentAngle = 0;
      const slices = [];

      categories.forEach(function (category) {
        const percentage = total > 0 ? (categoryTotals[category] / total) * 100 : 0;
        const angle = percentage * 3.6;
        const color = categoryColors[category] || categoryColors.Other;

        if (angle > 0) {
          slices.push(color + " " + currentAngle + "deg " + (currentAngle + angle) + "deg");
          currentAngle += angle;
        }

        const legendItem = document.createElement("div");
        legendItem.className = "donut-legend-item";
        legendItem.innerHTML = `
            <span class="donut-legend-color" style="background:${color}"></span>
            <span>${category} · ${Math.round(percentage)}%</span>
            <span>₹${categoryTotals[category].toLocaleString("en-IN")}</span>
        `;
        donutLegend.appendChild(legendItem);
      });

      donutChart.style.background = slices.length
        ? "conic-gradient(" + slices.join(", ") + ")"
        : "conic-gradient(#292929 0deg 360deg)";
    }
  }

  let topCategory = "-";
  let highestAmount = 0;

  for (const category in categoryTotals) {
    if (categoryTotals[category] > highestAmount) {
      highestAmount = categoryTotals[category];
      topCategory = category;
    }
  }

  const analyticsTotal = document.getElementById("analytics-total");
  const analyticsTransactions = document.getElementById("analytics-transactions");
  const analyticsTopCategory = document.getElementById("analytics-top-category");
  const analyticsTopCategoryPercentage = document.getElementById("analytics-top-category-percentage");

  if (analyticsTotal) {
    analyticsTotal.textContent = "₹" + total.toLocaleString("en-IN");
  }
  if (analyticsTransactions) {
    analyticsTransactions.textContent = selectedMonthExpenses.length;
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

    if (Object.keys(categoryTotals).length === 0) {
      categoryList.innerHTML = '<div class="empty-chart-message">No category data for this month.</div>';
    } else {
      for (const category in categoryTotals) {
        const categoryItem = document.createElement("div");
        categoryItem.className = "category-item category-" + category.toLowerCase();
        const percentage = total > 0 ? (categoryTotals[category] / total) * 100 : 0;
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

  updateTimeAnalytics();
}

/* TIME-BASED ANALYTICS */
function renderTrendChart(containerId, periods, expenses, colorClass) {
  const chart = document.getElementById(containerId);
  if (!chart) return;

  const totals = periods.map(function (period) {
    return expenses.reduce(function (sum, expense) {
      const date = parseDateString(expense.date);
      return period.matches(date) ? sum + Number(expense.amount) : sum;
    }, 0);
  });

  const maxTotal = Math.max(...totals, 1);
  chart.innerHTML = "";

  periods.forEach(function (period, index) {
    const column = document.createElement("div");
    column.className = "trend-column";

    const value = document.createElement("span");
    value.className = "trend-value";
    value.textContent = "₹" + totals[index].toLocaleString("en-IN");

    const barArea = document.createElement("div");
    barArea.className = "trend-bar-area";

    const bar = document.createElement("div");
    bar.className = "trend-bar " + colorClass;
    bar.style.height = totals[index] > 0 ? Math.max((totals[index] / maxTotal) * 100, 4) + "%" : "0%";
    bar.title = period.label + ": ₹" + totals[index].toLocaleString("en-IN");

    const label = document.createElement("span");
    label.className = "trend-label";
    label.textContent = period.label;

    barArea.appendChild(bar);
    column.appendChild(value);
    column.appendChild(barArea);
    column.appendChild(label);
    chart.appendChild(column);
  });
}

function updateTimeAnalytics() {
  const expenses = readStorageJSON("expenses", []);
  const selectedMonthKey = getSelectedMonthKey();
  const [selectedYear, selectedMonth] = selectedMonthKey.split("-").map(Number);

  const monthlyPeriods = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(selectedYear, selectedMonth - 1 - i, 1);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    monthlyPeriods.push({
      label: monthDate.toLocaleDateString("en-IN", { month: "short" }),
      matches: function (date) {
        return date.getFullYear() === year && date.getMonth() === month;
      },
    });
  }

  const monthlyDescription = document.querySelector("#monthly-chart")?.closest(".trend-card")?.querySelector(".trend-description");
  if (monthlyDescription) {
    const firstPeriodDate = new Date(selectedYear, selectedMonth - 1 - 5, 1);
    const lastPeriodDate = new Date(selectedYear, selectedMonth - 1, 1);
    const firstPeriod = monthlyPeriods[0];
    const lastPeriod = monthlyPeriods[monthlyPeriods.length - 1];
    monthlyDescription.textContent =
      "Your spending from " + firstPeriod.label + " " + firstPeriodDate.getFullYear() + " to " + lastPeriod.label + " " + lastPeriodDate.getFullYear();
  }

  renderTrendChart("monthly-chart", monthlyPeriods, expenses, "");

  const selectedDay = selectedMonthKey === getCurrentMonthKey() ? new Date().getDate() : 15;
  const weekAnchor = new Date(selectedYear, selectedMonth - 1, Math.min(selectedDay, new Date(selectedYear, selectedMonth, 0).getDate()));
  const mondayOffset = (weekAnchor.getDay() + 6) % 7;
  const monday = new Date(weekAnchor);
  monday.setDate(weekAnchor.getDate() - mondayOffset);

  const weeklyPeriods = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const year = day.getFullYear();
    const month = day.getMonth();
    const dateNumber = day.getDate();

    weeklyPeriods.push({
      label: day.toLocaleDateString("en-IN", { weekday: "short" }),
      matches: function (expenseDate) {
        return (
          expenseDate.getFullYear() === year &&
          expenseDate.getMonth() === month &&
          expenseDate.getDate() === dateNumber
        );
      },
    });
  }

  const weeklyDescription = document.querySelector("#weekly-chart")?.closest(".trend-card")?.querySelector(".trend-description");
  if (weeklyDescription) {
    const startDate = new Date(monday);
    const endDate = new Date(monday);
    endDate.setDate(monday.getDate() + 6);
    weeklyDescription.textContent =
      "Week of " + startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + " – " + endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  renderTrendChart("weekly-chart", weeklyPeriods, expenses, "weekly-bar");
}

migrateLegacyBudgetStorage();
renderMonthSelectors();
displayExpenses();
