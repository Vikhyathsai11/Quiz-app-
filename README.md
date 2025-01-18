---

# Quiz App

## Overview
This is a fully functional quiz application built using **Next.js** and styled with **Tailwind CSS**. The app features a start page to capture the user's email, a 15-question quiz fetched from the OpenTDB API, and a detailed report page showing the user's performance. The quiz includes navigation between questions, a countdown timer, and responsive design for various devices.

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Vikhyathsai11/Quiz-app-.git
```

### 2. Install Dependencies
Navigate to the cloned directory and install the required dependencies:
```bash
npm i
```

### 3. Run the Application
Start the development server:
```bash
npm run dev
```

The app will run on **localhost:3000**. Open your browser and navigate to:
```
http://localhost:3000
```

---

## Features
- **Start Page**: Collects the user's email with validation before beginning the quiz.
- **Quiz Functionality**:
  - Displays 15 questions fetched from the OpenTDB API.
  - Randomized answer options for each question.
  - Tracks visited and attempted questions.
  - 30-minute countdown timer that auto-submits the quiz.
- **Report Page**: Shows a detailed comparison of user's answers vs. correct answers and a performance summary.
- **Responsive Design**: Optimized for different devices and screen sizes.
- **Tech Stack**:
  - **Next.js**: For building the frontend and backend of the application.
  - **Tailwind CSS**: For modern and responsive UI design.

---

## Dependencies
- **Node.js**: Ensure you have Node.js installed on your system.
- **Next.js**: Framework for React-based server-side rendering.
- **Tailwind CSS**: Utility-first CSS framework for styling.

---

## End-to-End Testing
The application includes comprehensive end-to-end (e2e) testing using **Cypress**.

### Running Cypress Tests
To open Cypress and run the tests, use the following command:
```bash
npx cypress open
```

The tests are located in the `cypress/e2e` directory and cover functionality for both the start page and the quiz page.

---

## Deployment
For deploying the app **Vercel** 
https://quizapp-vikhyath.vercel.app/
---
