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

handleRoute();

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
        if ( name === "" || email === "" || password === "" || confirmPassword === "") {
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
        localStorage.setItem( "spendwiseUser", JSON.stringify(user));

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
        if ( email === storedUser.email && password === storedUser.password) {
            localStorage.setItem("isLoggedIn", "true");
            alert("Login successful!");
            window.location.href = "app.html";
        } else {
            alert("Invalid email or password.");
        }
    });
}