AI Personal Assistant

**[✨ Live Demo ✨](https://ai-assistant-frontend-ppvc.onrender.com)**

A smart, conversational personal assistant that helps you manage your daily life. It handles structured data like groceries, tasks, and expenses with a rich, tailored interface, and also provides the flexibility to create and manage any custom list you can think of—all through a simple chat interface.

✨ Features

    Natural Language Processing: Talk to the assistant just like you would to a person. No need to learn complex commands.

    Specialized Modules: Get a rich, tailored experience for managing your:

        Groceries: Add, update, and view your grocery list.

        Tasks: Manage your to-do list.

        Expenses: Log your spending and visualize it with an interactive pie chart.

    Flexible & Creative: Create any other kind of list you need on the fly—a book list, workout log, gift ideas, and more! The assistant intelligently handles any request that doesn't fit a specialized category.

    Secure & Session-Based: Uses secure HttpOnly cookies to manage user sessions, ensuring each user's data is private and persistent.

    Multi-Tenant Architecture: All user data is stored in a single, secure database and is strictly segregated by a user_id on every query.

    Modern Chat UI: A responsive and intuitive chat interface built with React.

🚀 How It Works

The application uses a "smart fallback" architecture. The AI first tries to match a user's request to a specialized tool. If it can't find a match, it gracefully falls back to a generic, flexible tool.

    Frontend (React): The user types a message in the chat UI.

    Backend (Node.js/Express on Render): The backend receives the message and identifies the user via their secure HttpOnly cookie.

    AI Agent (Google Gemini): The backend constructs a prompt containing the user's message, their unique userId, and the database schemas.

    Smart Query Generation:

        The AI first checks if the request matches a specialized table (groceries, tasks, expenses). If yes, it generates a precise SQL query for that table.

        If not, it falls back and generates a query for the generic custom_lists table.

    Database (PostgreSQL on Render): The backend executes the query. Every query is filtered by user_id, ensuring data is never shared between users.

    Response & Visualization: The database returns the result. The frontend receives the data and intelligently decides how to display it—as a custom pie chart, a formatted table, or a simple success message.

☁️ Deployment on Render

This project is deployed using a modern, multi-service architecture on Render:

    PostgreSQL Database: A managed PostgreSQL instance that securely stores all user data.

    Backend Web Service: The Node.js/Express server runs as a web service, handling API requests and communicating with the database and AI.

    Frontend Static Site: The React application is served as a fast, static site, configured with rewrite rules for a seamless single-page application experience.
## 🛠️ Tech Stack ✨

| Category     | Technology                                                                          |
| :----------- | :---------------------------------------------------------------------------------- |
| **Frontend** | React, Axios, Chart.js (`react-chartjs-2`), React Toastify                          |
| **Backend** | Node.js, Express.js                                                                 |
| **Database** | PostgreSQL                                                                          |
| **AI** | Google Generative AI (Gemini)                                                       |
| **Platform** | Deployed on Render (Static Site + Web Service + PostgreSQL)                         |