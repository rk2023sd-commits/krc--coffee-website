# KRC! Coffee Website - Project Documentation

## 1. Project Overview
The **KRC! Coffee Website** is a full-stack e-commerce application designed for selling coffee products. It features a modern, responsive user interface built with **React** and a robust backend API powered by **Node.js** and **Express**. The application supports user authentication, product management, order processing with payment gateway integration, content management (CMS), and administrative controls.

## 2. Technology Stack

### Frontend
- **Framework**: React 18 (built with Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: React Context API
- **HTTP Client**: Axios (implied)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer
- **Email Service**: Nodemailer

## 3. Project Structure

```
c:\Projects\w1111\KRC! COFFEE WEBSITE 6
├── backend
│   ├── config          # Database and external service configuration
│   ├── controllers     # Request logic (Auth, Order, Product, etc.)
│   ├── middleware      # Auth checks, error handling, etc.
│   ├── models          # Mongoose schemas (User, Product, Order, etc.)
│   ├── routes          # API route definitions
│   ├── utils           # Helper functions (emails, tokens, etc.)
│   ├── uploads         # Stored uploaded files (images)
│   ├── .env            # Backend environment variables
│   └── server.js       # Entry point for the backend server
├── frontend
│   ├── public          # Static assets
│   ├── src
│   │   ├── assets      # Images, icons, global styles
│   │   ├── components  # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── context     # Global state providers (Auth, Cart)
│   │   ├── layouts     # Page layout wrappers
│   │   ├── pages       # Application pages (Public, Admin, User)
│   │   ├── App.jsx     # Main application component
│   │   └── main.jsx    # Entry point for React
│   ├── .env            # Frontend environment variables
│   ├── index.html      # HTML entry point
│   └── vite.config.js  # Vite configuration
└── DOCUMENTATION.md    # This file
```

## 4. Key Features

### User Features
- **Authentication**: Register, Login, Forgot Password.
- **Product Browsing**: Shop page with categories, filtering, and product details.
- **Cart & Checkout**: Add to cart, view cart, secure checkout (COD).
- **User Dashboard**: View order history, manage profile, wishlist.
- **Engagement**: Blog reading, writing reviews, submitting contact forms.

### Admin Features
- **Dashboard**: Overview of sales, orders, and users.
- **Product Management**: Create, update, delete products and categories.
- **Order Management**: View and update order status (Processing, Shipped, Delivered).
- **CMS**: Manage dynamic content for blog posts, FAQs, and offers.
- **Settings**: Configure site-wide settings.
- **Reports**: View analytics and reports.

## 5. Database Models
The application uses the following MongoDB collections:
- **Users**: User profiles, roles (admin/customer).
- **Products**: Product details, price, stock, images.
- **Orders**: Order details, payment status, shipping info.
- **Categories**: Product categories.
- **Blogs**: Blog posts content and metadata.
- **Reviews**: Product reviews and ratings.
- **Offers**: Promotional offers and banners.
- **Notifications**: System notifications.
- **Settings**: General site configurations.
- **Contacts**: Messages from the contact form.
- **FAQs**: Frequently asked questions.

## 6. API Endpoints (Overview)

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Other Routes
- `/api/users` - User management
- `/api/categories` - Category management
- `/api/blogs` - Blog management
- `/api/reviews` - Product reviews
- `/api/offers` - Offers management

## 7. Setup & Installation

### Prerequisites
- Node.js installed
- MongoDB installed and running (or MongoDB Atlas URI)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env` file with:
   - `PORT`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
   - `EMAIL_USER`, `EMAIL_PASS` (for Nodemailer)
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 8. Scripts
- **Backend**:
  - `npm start`: Runs the server (production).
  - `npm run dev`: Runs the server with Nodemon (development).
- **Frontend**:
  - `npm run dev`: Starts Vite development server.
  - `npm run build`: Builds the app for production.
  - `npm run lint`: Runs ESLint for code quality.

