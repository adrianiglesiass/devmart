# DevMart: Full-Stack E-commerce Prototype

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-black?logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blue?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-purple?logo=vite&logoColor=white)

This repository contains the source code for **DevMart**, an e-commerce prototype built with a monorepo architecture.

The backend is a **REST API** developed in **Python/Flask** that manages users, products, categories, and orders, with JWT authentication. The frontend is an application created with **React/TypeScript** and Tailwind/Radix for the UI.

## 🔗 Live Demo

**[View deployed project](https://devmart-frontend.netlify.app/)**


## Demo Gallery

| Home Page | Product Catalog |
| :---: | :---: |
| <img width="100%" height="350" alt="Home Page" src="https://github.com/user-attachments/assets/f4166491-d4b5-4444-a896-e356faf1723a" /> | <img width="100%" height="342" alt="Product Catalog" src="https://github.com/user-attachments/assets/092b4be1-18b6-407c-995b-e99a28595fd7" /> |
| **Admin Panel** | **Admin Panel (CRUD)** |
| <img width="100%" height="350" alt="Admin Panel" src="https://github.com/user-attachments/assets/9d1bd968-ea07-4d67-b1ec-743f0ced67a4" /> | <img width="100%" height="342" alt="Admin Panel (CRUD)" src="https://github.com/user-attachments/assets/c58f48f1-f08f-4122-bff7-2f4431376d6b" /> |


---

## Key Features

* **Secure Authentication:** User registration and login with **JSON Web Tokens (JWT)**.
* **Catalog Management:** Full CRUD for products and categories (restricted to administrators).
* **Shopping Flow:** Functional shopping cart and order creation.
* **Stock Management:** Product stock is decremented when an order is created and restored if the order is canceled.
* **User Roles:** Role system (admin, customer) to protect routes and actions.
* **API Documentation:** Auto-generated OpenAPI/Swagger documentation available in the backend.

---

## Tech Stack

The architecture is separated into two main folders: `/backend` and `/frontend`.

### Backend (`/backend`)

* **Framework:** **Flask**
* **Database:** **SQLAlchemy** (compatible with SQLite, PostgreSQL, etc.)
* **Migrations:** **Flask-Migrate** (based on Alembic)
* **Authentication:** **Flask-JWT-Extended**
* **API Docs:** **Flasgger** (OpenAPI / Swagger)
* **CORS:** `flask-cors`
* **Serialization/Validation:** `SQLAlchemy` (models)

### Frontend (`/frontend`)

* **Framework:** **React 19** + **TypeScript**
* **Bundler:** **Vite**
* **Server State Management:** **TanStack Query (React Query)**
* **HTTP Requests:** **Axios** (with interceptors to inject JWT)
* **Routing:** `react-router-dom`
* **UI/Styling:** **Tailwind CSS** + **Radix UI** (for accessible components)
* **Forms:** **React Hook Form** + **Zod** (for schema validation)

---

## Local Installation and Setup

Follow these steps to set up the development environment on your machine.

### Prerequisites

* **Python 3.10+** (with `pip` and `venv`)
* **Node.js 18+** (with `npm` or `yarn`)

### 1. Backend Setup (Flask)

1.  Open a terminal and navigate to the backend folder:
    ```bash
    cd backend
    ```

2.  Create and activate a virtual environment:
    ```bash
    # macOS / Linux
    python3 -m venv .venv
    source .venv/bin/activate
    
    # Windows
    python -m venv .venv
    .\.venv\Scripts\activate
    ```

3.  Install the Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Set up the environment variables. Create a `.env` file in the `/backend` folder. Use this as a guide:
    ```ini
    # backend/.env
    FLASK_ENV=development
    SECRET_KEY=your-flask-secret-key
    JWT_SECRET_KEY=your-jwt-secret-key
    
    # Defaults to SQLite if not specified
    DATABASE_URL=sqlite:///shop.db 
    ```

5.  Run the database migrations to create the tables:
    ```bash
    python migrate_db.py
    # Or alternatively:
    # flask db upgrade
    ```

6.  Start the backend server:
    ```bash
    python run.py
    ```
    *The server will be running at `http://127.0.0.1:5000`.*

### 2. Frontend Setup (React)

1.  Open a **new terminal** and navigate to the frontend folder:
    ```bash
    cd frontend
    ```

2.  Install the Node.js dependencies:
    ```bash
    npm install
    ```

3.  Set up the environment variables. Create a `.env` file in the `/frontend` folder:
    ```ini
    # frontend/.env
    VITE_API_URL= http://127.0.0.1:5000
    ```
    *(Make sure the URL matches your backend server)*.

4.  Start the Vite development server:
    ```bash
    npm run dev
    ```
    *The application will automatically open at `http://localhost:5173`.*

---

## Swagger

Once the backend is running, you can access the interactive API documentation (Swagger UI) at the following route:

* **UI Documentation:** `http://127.0.0.1:5000/docs`
* **JSON Specification:** `http://127.0.0.1:5000/apispec.json`

<img width="100%" alt="Swagger UI Documentation" src="https://github.com/user-attachments/assets/7940a0eb-29d2-44bb-b8db-e6f4ec6103a4" />
<img width="100%" alt="Swagger UI Documentation" src="https://github.com/user-attachments/assets/8dcdae6d-fddc-4da3-b1bb-6377fe6390b6" />


### Generating Types from the API

The frontend is configured to automatically generate TypeScript types from the backend's OpenAPI specification.

```bash
# Make sure the backend is running
cd frontend
npm run generate:types
```
## Deployment

This project is configured for simple deployment on modern platforms:

### Backend (Flask):

* Includes a `Dockerfile` to containerize the application.
* Includes `fly.toml`, ready to deploy on [Fly.io](https://fly.io/).
* Remember to configure the environment variables (`DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY`) in your hosting service.

### Frontend (React):

* Includes `netlify.toml`, ready for [Netlify](https://www.netlify.com/).
* It is also 100% compatible with [Vercel](https://vercel.com/).
* Remember to define the `VITE_API_URL` environment variable in your hosting service to point to your deployed backend URL.

---

## How to Contribute
Contributions are welcome! If you want to improve the project, follow these steps:

1. Open an Issue to discuss the bug or new feature.

2. Fork the repository.

3. Create a new branch for your changes: git checkout -b feat/my-improvement.

4. Implement your changes.

5. Commit and Push to your branch.

6. Open a Pull Request to the original repository.


## License
This project is under the MIT License. See the LICENSE file for more details.
