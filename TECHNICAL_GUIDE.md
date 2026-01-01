# KRC! Coffee Website - Technical Code Guide

This document explains **how the code works** internally. It describes the data flow, the purpose of key directories, and the logic behind major features.

## 1. High-Level Architecture (MERN Stack)

The application follows a standard **MERN** (MongoDB, Express, React, Node.js) architecture:

1.  **Frontend (React)**: The user interacts with the UI. When they perform an action (e.g., "Add to Cart"), React updates the local state. When they need data (e.g., "View Products"), React sends an HTTP request to the Backend.
2.  **Backend (Express & Node.js)**: The server receives the HTTP request. It routes the request to a specific **Controller** function.
3.  **Database (MongoDB)**: The Controller interacts with the MongoDB database using **Mongoose Models** to fetch or save data.
4.  **Response**: The Backend sends the data (JSON) back to the Frontend, which then renders it for the user.

---

## 2. Backend Logic (`/backend`)

The backend is the brain of the application. Here is the flow of a typical request:

### A. Entry Point (`server.js`)
- This is the first file that runs.
- It connects to the database via `config/db.js`.
- It sets up **Middleware** (like `cors` to allow frontend requests and `express.json` to read POST data).
- It defines the base routes (e.g., `app.use('/api/products', productRoutes)`).

### B. Routes (`/routes`)
- Files here (e.g., `productRoutes.js`) define available URLs (endpoints).
- They map a specific URL (like `GET /`) to a specific Controller function.
- They also apply **Middleware** like `protect` (in `authMiddleware.js`) to ensure only logged-in users can access certain routes.

### C. Controllers (`/controllers`)
- This is where the actual logic lives.
- **Example (`orderController.js`)**:
  - Checks if the data sent by the user is valid.
  - Calculates totals.
  - Creates a new `Order` entry in the database.
  - Triggers an email notification (using `utils/sendEmail.js`).
  - Sends a success or error message back to the frontend.

### D. Models (`/models`)
- these files define the "Shape" of the data using Mongoose Schemas.
- **Example (`Product.js`)**: Defines that a product *must* have a name (String), price (Number), and image (String).

---

## 3. Frontend Logic (`/frontend`)

The frontend is what the user sees. It is built with **React** and **Vite**.

### A. Routing (`App.jsx`)
- Uses `react-router-dom` to switch between pages without reloading the browser.
- Defines which Component (Page) to show for which URL (e.g., `/shop` shows `<Shop />`).

### B. Pages (`/pages`)
- **Public**: Components like `Home.jsx`, `Shop.jsx` that anyone can see. They usually `fetch` data from the backend inside a `useEffect` hook when the page loads.
- **Admin**: Pages heavily protected by logic that checks if the user is an 'admin'.

### C. State Management (`/context`)
- **CartContext.jsx**: This is crucial for the shopping experience.
  - It saves the cart items in a global "state" so they persist even if you go from the Home page to the Shop page.
  - It often syncs this state with `localStorage` so the cart isn't lost on refresh.

### D. API Integration
- The frontend talks to the backend using `fetch` or `axios`.
- **Example Flow (Login)**:
  1. User types email/password in `Login.jsx`.
  2. `handleSubmit` function calls `POST http://localhost:5000/api/auth/login`.
  3. If successful, the backend returns a **Token**.
  4. The frontend saves this Token in `localStorage`.
  5. Future requests include this Token in the header to prove identity.

---

## 4. Key Workflows Explained

### Workflow 1: User Registration
1. **Frontend**: `Register.jsx` collects Name, Email, Password. Validates inputs (e.g., 10-digit phone).
2. **Backend**: `authController.registerUser` receives data.
   - Checks if user already exists.
   - Hashes the password (using `bcryptjs`) so it's secure.
   - Saves user to DB.
   - Sends a welcome email.

### Workflow 2: Placing an Order (Cash on Delivery)
1. **Frontend**: `Checkout.jsx` gathers address and cart details.
2. **Action**: User clicks "Place Order".
3. **Backend**: `orderController.addOrderItems` runs.
   - Validates that cart is not empty.
   - Saves the Order to MongoDB with status `Processing`.
   - Clears the user's cart (logic usually handled on frontend response).
4. **Email**: The backend automatically looks up the user's email and sends an "Order Confirmation" via Nodemailer.

### Workflow 3: Admin Dashboard
1. **Frontend**: `AdminDashboard.jsx` requests stats (total sales, total users).
2. **Backend**: A specialized route aggregates data from `Order` and `User` collections and sends the counts back.
3. **Display**: React renders graphs or cards with these numbers.

---

## 5. Security Features
- **Passwords**: Never stored in plain text. They are "hashed" (scrambled).
- **JWT Tokens**: Used instead of sessions. The server doesn't "remember" logged-in users; it just verifies the Token they send is valid.
- **Protected Routes**: Middleware blocks access to Admin API routes if the user's token doesn't say `isAdmin: true`.
