/* CHECK LOGIN */
if (window.location.pathname.endsWith("app.html")) {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
        window.location.href = "index.html#login";
    }

}

function showView(viewName) {
    const views = document.querySelectorAll(".view");

    views.forEach(function(view) {
        view.classList.remove("active");
    });

    const selectedView = document.getElementById(viewName + "-view");

    if (selectedView) {
        selectedView.classList.add("active"); // Adds class "active" to this element to make it visible
    }
}

function handleRoute() {
    let route = window.location.hash.substring(1); // Get the route from the URL hash (removing the '#' character) like signup in #signup

    if (route === "") {  // when route is empty, it will show the home view
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

    signupForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("signup-confirm-password").value;

        /* VALIDATION */
        if (name === "" || email === "" || password === "" || confirmPassword === "") {
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
            password: password
        };

        /* SAVE USER */
        localStorage.setItem("spendwiseUser", JSON.stringify(user));

        alert("Account created successfully!");
        window.location.hash = "login";
    });
}

/* LOGIN */
if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

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

if (sidebarLinks.length > 0) // To ensure that the code runs only on app.html where sidebar links exist, not on index.html
{
    // Functions are just defined here, not executed yet
    function showAppSection(sectionName) {

        appSections.forEach(function(section) {
            section.style.display = "none";  // Hides all sections by default
        });

        sidebarLinks.forEach(function(link) {
            link.classList.remove("active");  // Removes the "active" class from all sidebar links
        });

        const selectedSection = document.getElementById(sectionName + "-section");

        if (selectedSection) {
            selectedSection.style.display = "block"; // Shows the selected section
        }

        // Selects the sidebar link corresponding to the selected section
        const selectedLink = document.querySelector('.sidebar-link[href="#' + sectionName + '"]');

        if (selectedLink) {
            selectedLink.classList.add("active"); // Adds the "active" class to the selected sidebar link
        }
    }

    function handleAppRoute() {

        let route = window.location.hash.substring(1);
        if (route !== "dashboard" && route !== "expenses" &&
            route !== "analytics" && route !== "settings")
        {
            route = "dashboard";
        }
        showAppSection(route);
    }
    window.addEventListener("hashchange", handleAppRoute); // Register a fn to run later (when hash in URL changes)
    handleAppRoute(); // Actual fn call
}

/* EXPENSE MANAGEMENT */

const addExpenseBtn = document.getElementById("add-expense-btn");
const cancelExpenseBtn = document.getElementById("cancel-expense-btn");
const expenseFormContainer = document.getElementById("expense-form-container");
const expenseForm = document.getElementById("expense-form");

let editingExpenseId = null;

if (addExpenseBtn) {
    addExpenseBtn.addEventListener("click", function() {
        editingExpenseId = null;
        expenseForm.reset();
        expenseFormContainer.classList.add("show");
    });
}

if (cancelExpenseBtn) {
    cancelExpenseBtn.addEventListener("click", function() {
        editingExpenseId = null;
        expenseForm.reset();
        expenseFormContainer.classList.remove("show");
    });
}

if (expenseForm) {
    expenseForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const amount = document.getElementById("expense-amount").value;
        const category = document.getElementById("expense-category").value;
        const description = document.getElementById("expense-description").value.trim();
        const date = document.getElementById("expense-date").value;

        if (amount === "" || category === "" || description === "" || date === "") 
        {
            alert("Please fill in all fields.");
            return;
        }
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

        /* UPDATE EXISTING EXPENSE */
        if (editingExpenseId !== null) {
            const expenseIndex = expenses.findIndex(function(item) {
                    return item.id === editingExpenseId;
                });

            if (expenseIndex !== -1) {
                expenses[expenseIndex] = {
                    id: editingExpenseId,
                    amount: Number(amount),
                    category: category,
                    description: description,
                    date: date
                };
            }
            alert("Expense updated successfully!");
            editingExpenseId = null;
        } 
        else 
        {
            /* CREATE NEW EXPENSE */
            const expense = {
                id: Date.now(),
                amount: Number(amount),
                category: category,
                description: description,
                date: date
            };

            expenses.push(expense);
            alert("Expense added successfully!");
        }
        localStorage.setItem("expenses", JSON.stringify(expenses));
        expenseForm.reset();
        expenseFormContainer.classList.remove("show");
        displayExpenses();
    });
}

/* READ EXPENSES */
const expenseList = document.getElementById("expense-list");

function displayExpenses() {
    if (!expenseList) {
        return;
    }
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    if (expenses.length === 0) {
        expenseList.innerHTML = '<p class="empty-expenses">No expenses added yet.</p>';
        return;
    }

    expenseList.innerHTML = "";

    expenses.forEach(function(expense) {

        const expenseItem = document.createElement("div");
        expenseItem.className = "expense-item";

        expenseItem.innerHTML = `
            <div>
                <h4>${expense.description}</h4>
                <p>${expense.date}</p>
            </div>
            <div class="expense-category">${expense.category}</div>
            <div class="expense-amount">₹${expense.amount.toLocaleString("en-IN")}</div>
            <div class="expense-actions">
                <button class="edit-expense" data-id="${expense.id}">Edit</button>
                <button class="delete-expense" data-id="${expense.id}">Delete</button>
            </div>
        `;
        expenseList.appendChild(expenseItem);
    });

    const editButtons = document.querySelectorAll(".edit-expense");

    editButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            editExpense(Number(button.dataset.id));
        });
    });

    const deleteButtons = document.querySelectorAll(".delete-expense");

    deleteButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            deleteExpense(Number(button.dataset.id));
        });
    });
}
displayExpenses();

function editExpense(id) {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const expense =
        expenses.find(function(item) {
            return item.id === id;
        });

    if (!expense) {
        return;
    }
    editingExpenseId = id;

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

    const updatedExpenses =
        expenses.filter(function(expense) {
            return expense.id !== id;
        });

    localStorage.setItem(
        "expenses",
        JSON.stringify(updatedExpenses)
    );

    alert("Expense deleted successfully!");
    displayExpenses();
}