# Expense Tracking Project

A Node.js web application for tracking expenses, sharing posts, and interacting with a community via comments. This project uses Express, MongoDB, and EJS to create a dynamic server-side rendered application.

## Features

*   **User Authentication**: Sign up, sign in, and sign out functionality with session management.
*   **Expense Posts**: 
    *   Create posts with a title, expense amount, and description.
    *   Descriptions support **Markdown** syntax.
    *   Edit and Delete your own posts.
    *   View tracking (Page Views) for each post.
*   **Comments**: 
    *   Users can comment on posts.
    *   Delete comments (permissions enforcement included).
*   **Security**: Middleware to protect routes ensuring only logged-in users can perform actions like posting or editing.

## Tech Stack

*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (via `mongolass` or Mongoose wrapper)
*   **Templating**: EJS (Embedded JavaScript templates)
*   **Styling**: Custom CSS and Semantic UI (class names detected in views)
*   **Utilities**: 
    *   `marked`: For rendering Markdown content.
    *   `formidable`: For form data handling.

## Project Structure

```
expense_tracking_project/
├── models/             # Database models (posts, comments, users)
├── routes/             # Route handlers (signin, signup, posts, comments)
├── middleware/         # Custom middleware (login checks)
├── views/              # EJS templates for UI rendering
├── public/             # Static assets (CSS, images)
├── lib/                # Database configuration and connection
└── index.js            # Application entry point
```

## Installation & Setup

1.  **Prerequisites**:
    *   Node.js installed.
    *   MongoDB installed and running locally.

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start the Database**:
    Ensure your MongoDB instance is running (usually on port 27017).

4.  **Run the Application**:
    ```bash
    node index.js
    # or if you have a start script
    npm start
    ```

5.  **Access the App**:
    Open your browser and navigate to `http://localhost:3000` (or the port defined in your configuration).
