# SpendWise

SpendWise is a personal expense and budget management web application designed to help users track their daily spending, manage their budget, and understand their financial habits through a clean and intuitive interface.

The application is built using HTML, CSS, and JavaScript and uses browser LocalStorage for persistent client-side data storage. It demonstrates practical frontend development concepts including DOM manipulation, event handling, form validation, client-side navigation, CRUD operations, responsive design, and Web Storage.

---

# Project Proposal

## 1. Project Description

SpendWise is a frontend-only personal finance management application that allows users to record and manage their expenses in one place.

Users can create expense records by entering information such as amount, category, description, and date. The stored expenses can then be viewed, updated, or deleted. The application also provides spending summaries and analytics to help users understand their spending patterns.

The project focuses on applying HTML, CSS, and JavaScript concepts covered in the Web Fundamentals course to a practical real-world application.

All application data is stored on the client side using LocalStorage, so the project does not require a backend server or database.

---

# 2. Goals

The main goals of SpendWise are:

- Build a practical frontend-only web application using HTML, CSS, and JavaScript.
- Implement complete CRUD functionality for expense management.
- Use LocalStorage for persistent browser-based data storage.
- Demonstrate DOM manipulation and JavaScript event handling.
- Handle forms and user input using JavaScript.
- Implement client-side navigation between application sections.
- Create a responsive interface for desktop, tablet, and mobile devices.
- Provide users with a simple way to understand their spending patterns.
- Apply HTML, CSS, and JavaScript concepts learned in class.
- Develop a project suitable for a GitHub portfolio.

---

# 3. Project Specifications

## Technology Stack

The project uses the following technologies:

- HTML5
- CSS3
- JavaScript
- LocalStorage

No JavaScript frameworks or external JavaScript libraries are used.

The project is implemented using vanilla HTML, CSS, and JavaScript.

---

## Application Pages

SpendWise contains multiple application pages/views.

### Page 1: Landing Page

The landing page introduces the SpendWise application and contains:

- Navigation bar
- Hero section
- Call-to-action buttons
- Product preview
- Features section
- How It Works section
- Footer

The landing page provides navigation to the authentication and application pages.

### Page 2: Application Page

The main application page contains the following sections:

- Dashboard
- Expenses
- Analytics
- Settings

The application page is responsible for the main expense management functionality.

### Authentication

The application also provides:

- Signup
- Login

Authentication is implemented on the frontend for educational purposes using LocalStorage.

---

# 4. Core Features

## Expense Management

Users can manage their personal expenses through a simple interface.

Each expense contains information such as:

```js
{
    id: 1,
    amount: 500,
    category: "Food",
    description: "Lunch",
    date: "2026-09-30"
}
