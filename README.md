# RentNest Backend

RentNest Backend is a role-based property rental platform API built with Node.js, Express, TypeScript, Prisma, and PostgreSQL. It supports tenant, landlord, and admin workflows for property listing, rental requests, payments, reviews, and user management.

## 🚀 Live Deployment

Production URL:

- https://rentnest-backend-server.vercel.app/

Local development:

- Base URL: http://localhost:5000

---

## 🧩 Project Overview

This backend powers a rental marketplace where:

- Tenants can browse properties, submit rental requests, pay for approved rentals, and leave reviews.
- Landlords can create and manage properties, review rental requests, and approve or reject them.
- Admins can manage users, view rental requests, and create categories.

### Main Features

- User authentication and profile management
- Property listing and management
- Category management
- Rental request workflow
- Stripe-based payment checkout
- Review creation after completed rentals
- Role-based authorization

---

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Stripe
- Vercel deployment

---

## 📦 Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd RentNest
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create environment variables

   ```bash
   cp .env.example .env
   ```

4. Update the .env file with your database and Stripe credentials.

5. Run Prisma migrations

   ```bash
   npx prisma migrate dev
   ```

6. Start the development server
   ```bash
   npm run dev
   ```

---

## 🔐 Roles and Permissions

### 1. Tenant

Can:

- Register and log in
- View own profile
- Update own profile
- Browse all properties
- View a property by ID
- Create a rental request
- View own rental requests
- View a specific rental request
- Pay for an approved rental request
- Create a review after a completed rental

### 2. Landlord

Can:

- Register and log in
- View own profile
- Update own profile
- Create, update, and delete own properties
- View all properties
- View a property by ID
- View rental requests for their properties
- Approve or reject rental requests

### 3. Admin

Can:

- View all users
- Ban or unban users
- Delete users
- View all properties
- View all rental requests
- Create categories

---

## 📚 API Endpoints

All endpoints are prefixed with:

- Local: http://localhost:5000/api
- Production: https://rentnest-backend-server.vercel.app

### Authentication

#### 1. Register user

- Method: POST
- URL: /api/auth/register
- Body:
  ```json
  {
    "name": "Tanvir",
    "email": "tanvir@example.com",
    "password": "123456",
    "role": "TENANT",
    "activeStatus": "UNBANNED"
  }
  ```
- Notes:
  - Admin registration is not allowed.
  - Role can be TENANT, LANDLORD, or ADMIN.

#### 2. Login user

- Method: POST
- URL: /api/auth/login
- Body:
  ```json
  {
    "email": "tanvir@example.com",
    "password": "123456"
  }
  ```
- Notes:
  - Returns an access token and user info.
  - Token is usually sent as a Bearer token or stored in cookies.

#### 3. Get own profile

- Method: GET
- URL: /api/auth/me
- Auth: Required for TENANT, LANDLORD, ADMIN

#### 4. Update own profile

- Method: PUT
- URL: /api/auth/me
- Auth: Required for TENANT, LANDLORD, ADMIN
- Body example:
  ```json
  {
    "name": "Updated Name",
    "phone": "01700000000",
    "profileImage": "https://example.com/avatar.png"
  }
  ```

---

### Properties

#### 1. Get all properties

- Method: GET
- URL: /api/properties
- Public
- Query params (optional):
  - searchTerm
  - page
  - limit
  - sortBy
  - sortOrder

#### 2. Get property by ID

- Method: GET
- URL: /api/properties/:id
- Public

#### 3. Create property

- Method: POST
- URL: /api/properties/properties
- Auth: LANDLORD only
- Body:
  ```json
  {
    "title": "Luxury Apartment",
    "description": "Beautiful apartment near the city center",
    "price": 25000,
    "location": "Dhaka",
    "propertyType": "Apartment",
    "availabilityStatus": "AVAILABLE",
    "amenities": ["Wi-Fi", "Parking", "Lift"]
  }
  ```

#### 4. Update property

- Method: PUT
- URL: /api/properties/properties/:id
- Auth: LANDLORD only
- Body example:
  ```json
  {
    "price": 28000,
    "availabilityStatus": "BOOKED"
  }
  ```

#### 5. Delete property

- Method: DELETE
- URL: /api/properties/properties/:id
- Auth: LANDLORD only

---

### Categories

#### 1. Get all categories

- Method: GET
- URL: /api/categories
- Public

#### 2. Create category

- Method: POST
- URL: /api/categories
- Auth: ADMIN only
- Body:
  ```json
  {
    "name": "Luxury",
    "description": "High-end rental properties"
  }
  ```

---

### Rental Requests

#### 1. Create rental request

- Method: POST
- URL: /api/rentals
- Auth: TENANT only
- Body:
  ```json
  {
    "propertieId": "PROPERTY_ID_HERE"
  }
  ```

#### 2. Get all rental requests

- Method: GET
- URL: /api/rentals
- Auth: TENANT or ADMIN
- Notes:
  - Tenants see their own requests.
  - Admins see all requests.

#### 3. Get rental request by ID

- Method: GET
- URL: /api/rentals/:requestId
- Auth: TENANT only

#### 4. Approve or reject rental request

- Method: PATCH
- URL: /api/rentals/:requestId
- Auth: LANDLORD only
- Body:
  ```json
  {
    "rentalStatus": "APPROVED"
  }
  ```
- Allowed values:
  - APPROVED
  - REJECTED

---

### Landlord Request Management

#### 1. View landlord rental requests

- Method: GET
- URL: /api/landlord/requests
- Auth: LANDLORD only

#### 2. Update landlord rental request status

- Method: PATCH
- URL: /api/landlord/requests/:id
- Auth: LANDLORD only

---

### Admin Panel

#### 1. Get all users

- Method: GET
- URL: /api/admin/users
- Auth: ADMIN only

#### 2. Update user status

- Method: PATCH
- URL: /api/admin/users/:id
- Auth: ADMIN only
- Body:
  ```json
  {
    "activeStatus": "BANNED"
  }
  ```

#### 3. Delete user

- Method: DELETE
- URL: /api/admin/users/:id
- Auth: ADMIN only

#### 4. Get all properties as admin

- Method: GET
- URL: /api/admin/properties
- Auth: ADMIN only

#### 5. Get all rental requests as admin

- Method: GET
- URL: /api/admin/rentals
- Auth: ADMIN only

---

### Payments

#### 1. Create Stripe checkout session

- Method: POST
- URL: /api/payments/create
- Auth: TENANT only
- Body:
  ```json
  {
    "rentalRequestId": "RENTAL_REQUEST_ID_HERE"
  }
  ```
- Notes:
  - Only approved rental requests can be paid.
  - Stripe webhook is also supported.

#### 2. Stripe webhook

- Method: POST
- URL: /api/payments/webhook
- Notes:
  - Used by Stripe to confirm payment events.

---

### Reviews

#### 1. Create review

- Method: POST
- URL: /api/reviews
- Auth: TENANT only
- Body:
  ```json
  {
    "propertyId": "PROPERTY_ID_HERE",
    "comment": "Great stay and smooth experience"
  }
  ```
- Notes:
  - Review can only be created after a completed rental request.

---

## 🧪 Postman Setup Tips

- Add a header:
  - Key: Authorization
  - Value: Bearer <accessToken>
- For login and registration, send JSON body.
- For protected routes, make sure the JWT token is included.
- For local testing, use:
  - Base URL: http://localhost:5000/api

---

## 🌐 Deployment Notes

This project is deployed on Vercel.

### Deploy command

```bash
vercel --prod
```

### Current production URL

```text
https://rentnest-backend-server.vercel.app/
```

---

## 📌 Notes

- The backend uses cookies for authentication in the browser flow.
- In Postman, you can also use the Authorization header if cookie-based auth is inconvenient.
- Make sure your Stripe webhook secret is configured correctly for payment events.
