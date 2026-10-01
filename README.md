# Mahajana Grinding Mill System

A full-stack e-commerce and management system developed for Mahajana Grinding Mill to modernize product sales, customer management, orders, inventory, and sales operations.

## Project Overview

The Mahajana Grinding Mill System is a web-based e-commerce application that allows customers to browse products, select different product weights, add items to a cart, place orders, and make payments.

The system also provides a seller/admin dashboard for managing products, customers, orders, inventory, and sales information.

## Features

### Customer Features

* Customer registration and login
* Browse products by category
* Product search and viewing
* Multiple product weight options
* Shopping cart
* Order placement
* Order history
* Order status tracking
* Customer dashboard
* Recently viewed products
* Online payment integration with Stripe

### Seller/Admin Features

* Seller login
* Seller dashboard
* Product management
* Add and view products
* Customer management
* Order management
* Inventory management
* Sales dashboard
* Sales statistics and charts
* Update order status

## Product Categories

The system includes multiple product categories such as:

* Spices
* Flour
* Herbal Products
* Chai Masala
* Grains
* Nuts
* Facial Products
* Rice Flour
* Ready Mix
* Packaging
* Beverages
* Bakery Products
* Natural Sweet Products
* Ayurvedic Products

## Technologies Used

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Axios
* Chart.js

### Backend

* Node.js
* Express.js
* REST API

### Database

* MariaDB / MySQL
* XAMPP

### Payment

* Stripe Test Payment Integration

### Development Tools

* Visual Studio Code
* Git
* GitHub

## Project Structure

```text
Mahajana-Grinding-Mill-System/
│
├── mahajana-frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/pages
│   │   ├── context/
│   │   └── images/
│   ├── package.json
│   └── README.md
│
├── mahajana-backend/
│   ├── config/
│   ├── routes/
│   ├── server.js
│   ├── schema.sql
│   ├── seed-products.sql
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ZikraMuzammil/Mahajana-Grinding-Mill-System.git
```

### 2. Open the Project

```bash
cd Mahajana-Grinding-Mill-System
```

### 3. Install Backend Dependencies

```bash
cd mahajana-backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `mahajana-backend` folder.

Add your own local configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mahajana_db
PORT=5000
STRIPE_SECRET_KEY=your_stripe_test_secret_key
```

**Important:** The `.env` file is not included in this repository for security reasons.

### 5. Set Up the Database

Start **Apache** and **MySQL** using XAMPP.

Create a database named:

```text
mahajana_db
```

Import the SQL files from the `mahajana-backend` folder into MySQL/phpMyAdmin.

### 6. Start the Backend

Inside `mahajana-backend`:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 7. Install Frontend Dependencies

Open another terminal:

```bash
cd mahajana-frontend
npm install
```

### 8. Start the Frontend

```bash
npm start
```

The React application will open at:

```text
http://localhost:3000
```

## Security

Sensitive information such as:

* Stripe secret keys
* Database passwords
* Environment variables

is excluded from GitHub using `.gitignore`.

Never upload secret API keys or passwords to GitHub.

## Project Purpose

This project was developed as a final-year IT project to provide a modern digital solution for Mahajana Grinding Mill by replacing manual business processes with an integrated e-commerce and management system.

## Author

**Zikra Muzzammil**

Higher National Diploma in Information Technology (HNDIT)

Advanced Technology Institute, Nawalapitiya

## GitHub

https://github.com/ZikraMuzammil/Mahajana-Grinding-Mill-System
