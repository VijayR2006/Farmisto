# Farmisto

**Farm-to-Table Agricultural Marketplace Connecting Local Farmers with Consumers**

---

## 1. Project Overview

### What Farmisto Does

Farmisto is a full-stack agricultural marketplace that enables local farmers to sell their produce directly to consumers within a 30km radius. The platform eliminates middlemen by providing a digital storefront where farmers can list products, manage inventory, and track orders, while consumers can browse fresh produce, compare prices across sellers, and place orders.

### The Problem It Solves

- **For Farmers**: Limited access to consumers, dependency on middlemen reducing profits, difficulty in managing sales and inventory digitally
- **For Consumers**: Lack of transparency in produce sourcing, difficulty finding fresh local produce, no price comparison across local sellers
- **For Both**: No efficient platform connecting local agricultural supply with demand

### Target Users

| User Type | Role | Capabilities |
|-----------|------|--------------|
| **Consumer** | End buyer | Browse marketplace, add to cart, place orders, track deliveries |
| **Farmer** | Seller | List products, manage inventory, view dashboard analytics, handle orders |

---

## 2. Architecture

### Frontend Structure (React SPA)

- **State Management**: React Context API (AuthContext, CartContext)
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS + Framer Motion animations
- **HTTP Client**: Axios with interceptors

### Backend Structure (Express.js REST API)

- **Authentication**: JWT-based (3-day expiry)
- **Database**: MongoDB via Mongoose ODM
- **File Storage**: Cloudinary for product images
- **Geolocation**: Google Maps Geocoding API + Haversine formula
- **PDF Generation**: PDFKit for invoices

### Important Modules and Interactions

| Module | Purpose | Interacts With |
|--------|---------|----------------|
| AuthContext | JWT token management, login/logout state | All authenticated components |
| CartContext | Global cart count sync | NavBar, Cart, Marketplace |
| TokenAuth | JWT generation/verification | All protected routes |
| Authentication middleware | Request authentication | All protected routes |
| GeoController | Distance calculation, nearby farmers | userRoutes, NearbyFarmers page |
| MarketController | Product CRUD with image processing | MarketRoutes, MarketPlace page |
| PaymentController | Order creation, invoice PDF | PaymentRoutes, Cart page |

---

## 3. Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite 6 | Build tool and dev server |
| React Router DOM 7 | Client-side routing |
| Tailwind CSS 3 | Utility-first CSS framework |
| Framer Motion 11 | Animations |
| Axios 1.7 | HTTP client |
| Chart.js 4 | Dashboard charts |
| React Leaflet | Maps integration |
| jwt-decode 4 | Client-side token decoding |
| React Icons 5 | Icon library |
| Material UI 6 | UI components |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express 4 | Web framework |
| Mongoose 8 | MongoDB ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Multer | File upload handling |
| Cloudinary | Image hosting and processing |
| PDFKit | Invoice PDF generation |
| Nodemailer | Email functionality |
| Google Maps API | Geocoding and reverse geocoding |

### Database

- **MongoDB** (hosted on MongoDB Atlas)
- Collections: users, markets, carts, payments, promocodes

### External Services

| Service | Purpose |
|---------|---------|
| MongoDB Atlas | Cloud database hosting |
| Cloudinary | Image upload, storage, CDN |
| Google Maps Geocoding API | Address resolution from coordinates |
| Remove.bg API | Background removal for product images |

---

## 4. Project Structure

```
Farmisto/
├── Farmisto-Backend/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary SDK configuration
│   │   ├── Db.js               # MongoDB connection setup
│   │   └── multer.js           # File upload middleware config
│   ├── controllers/
│   │   ├── CartController.js   # Cart operations (CRUD)
│   │   ├── FarmerController.js # Farmer profile and dashboard
│   │   ├── FarmerSettingsController.js # Farmer settings management
│   │   ├── GeoController.js    # Geolocation and nearby farmers
│   │   ├── MarketController.js # Product listing management
│   │   ├── PaymentController.js # Order and payment processing
│   │   ├── PromoCodeController.js # Promo code management
│   │   └── UserController.js   # User auth (register/login)
│   ├── middleware/
│   │   ├── Authentication.js   # JWT verification middleware
│   │   ├── asyncHandler.js     # Async error wrapper
│   │   ├── hashing.js          # Password hash/compare
│   │   └── TokenAuth.js        # JWT generate/verify functions
│   ├── models/
│   │   ├── Cart.js             # Cart item schema
│   │   ├── Farmer.js           # Legacy farmer schema
│   │   ├── Market.js           # Product listing schema
│   │   ├── Payment.js          # Payment/order schema
│   │   ├── PromoCode.js        # Promo code schema
│   │   └── User.js             # Unified user schema (consumer/farmer)
│   ├── routes/
│   │   ├── cartRoutes.js       # /cart/* endpoints
│   │   ├── FarmerRoutes.js     # /farmer/* endpoints
│   │   ├── MarketRoutes.js     # /market/* endpoints
│   │   ├── PaymentRoutes.js    # /payments/* endpoints
│   │   ├── PromoRoutes.js      # /promo/* endpoints
│   │   └── userRoutes.js       # /user/* endpoints
│   ├── server.js               # Express app entry point
│   └── package.json
│
├── Farmisto-Frontend/
│   ├── src/
│   │   ├── Components/         # Reusable UI components
│   │   ├── Dash/               # Farmer dashboard components
│   │   ├── Pages/              # Page components
│   │   ├── utils/              # Context providers and utilities
│   │   ├── assets/             # Images, icons, theme config
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   └── package.json
│
└── README.md                   # This file
```

---

## 5. API Documentation

### Base URL

- Development: http://localhost:4000
- Production: https://farmisto.onrender.com

### Google Sign-In Setup

Google sign-in uses Google Identity Services and the backend verifies the returned ID token before issuing Farmisto's JWT.

1. Create a Google OAuth 2.0 Web application client in Google Cloud Console.
2. Add `http://localhost:5173` and the deployed frontend origin to the client's authorized JavaScript origins.
3. Set the same client ID in `Farmisto-Frontend/.env` as `VITE_GOOGLE_CLIENT_ID` and in `Farmisto-Backend/.env` as `GOOGLE_CLIENT_ID`.
4. Restart both frontend and backend processes after changing environment variables.

### Authentication

Protected endpoints require a JWT token in the Authorization header:
`Authorization: Bearer <token>`

Tokens expire after 3 days.

### User Routes (/user)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /user/register | No | Register new user (consumer/farmer) |
| POST | /user/login | No | Login user |
| GET | /user/get-user/:id | No | Get user by ID |
| POST | /user/buy-item | Yes | Add item to cart |
| GET | /user/fetch-nearby-farmers | Yes | Get farmers within 30km radius |
| POST | /user/get-items-by-farmerId | Yes | Get items by farmer email |

### Market Routes (/market)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /market/add-item | Yes | Add new market item (farmer) |
| DELETE | /market/delete-item | Yes | Delete market item (farmer) |
| GET | /market/get-items | No | Get all market items (paginated) |
| GET | /market/get-items-farmer | Yes | Get farmer's own items |

### Cart Routes (/cart)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /cart/user | Yes | Get cart details for user |
| PATCH | /cart/update/:id | Yes | Update item quantity |
| DELETE | /cart/delete/:id | Yes | Delete cart item |
| PATCH | /cart/discount/:id | Yes | Update item discount |
| DELETE | /cart/clear | Yes | Clear entire cart |

### Payment Routes (/payments)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /payments/create-payment | Yes | Create payment (returns PDF invoice) |
| GET | /payments/farmer-get-payment | Yes | Get farmer payments |
| PATCH | /payments/farmer-update-payment | Yes | Update payment/order status |

### Farmer Routes (/farmer)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /farmer/settings/profile-data | Yes | Get farmer profile |
| PATCH | /farmer/settings/update-profile | Yes | Update farmer profile |
| PATCH | /farmer/settings/changePassword | Yes | Change password |
| GET | /farmer/dashboard | Yes | Get dashboard analytics |
| GET | /farmer/location | Yes | Get farmer location |
| GET | /farmer/settings/payment-data | Yes | Get payment settings |
| PATCH | /farmer/settings/update-payment | Yes | Update payment settings |
| POST | /farmer/support/feedback | Yes | Submit feedback |

### Promo Code Routes (/promo)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /promo/gen-promo | Yes | Generate promo code |
| POST | /promo/apply-promo | No | Apply promo code |
| DELETE | /promo/del-promo/:id | Yes | Delete promo code |
| GET | /promo/list-promos | Yes | List all promo codes |

### System Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /health | No | Health check with DB status |
| GET | /logout | No | Logout (clear cookie) |

---

## 6. Core Features

### 1. User Authentication
- Dual registration for consumers and farmers
- JWT tokens with 3-day expiry
- Role-based access and redirects
- bcrypt password hashing

### 2. Marketplace and Product Browsing
- Paginated product listings (15 per page)
- Category and type filtering
- Debounced search functionality
- Price comparison across sellers
- Automatic background removal for product images

### 3. Shopping Cart
- Add to cart with quantity selection
- Cart management (update, delete, clear)
- Automatic discount and savings calculation
- Real-time cart badge via CartContext
- Persistent storage in MongoDB

### 4. Order and Payment
- Cash on Delivery payment method
- PDF invoice generation on order
- Order status tracking (Processing, Shipped, Delivered, Cancelled)
- Payment status tracking (Pending, Paid, Failed, Refunded)

### 5. Farmer Dashboard
- Sales analytics with charts (weekly, monthly, yearly)
- Transaction history
- Product management with image upload
- Customer location visualization on map
- Produce tracking by category

### 6. Geo-Location Features
- Haversine formula for distance calculation
- Nearby farmers within 30km radius
- Reverse geocoding for address resolution
- Leaflet map integration

### 7. Promo Code System
- Code generation with discount and expiry
- Usage limit validation
- Expiry date checking

### 8. Farmer Settings
- Profile management
- Password change
- Payment settings (bank details, UPI)
- Feedback submission

---

## 7. Setup Instructions

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher
- MongoDB (local or Atlas account)
- Cloudinary account
- Google Maps API key with Geocoding enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bhanupratapvk06/Farmisto.git
cd Farmisto
```

2. Install Backend Dependencies:
```bash
cd Farmisto-Backend
npm install
```

3. Install Frontend Dependencies:
```bash
cd ../Farmisto-Frontend
npm install
```

### Environment Variables

**Backend** (.env in Farmisto-Backend/):
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/Farmisto
PORT=4000
JWT_SECRET=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
GOOGLE_API_KEY=your_google_maps_api_key
```

**Frontend** (.env in Farmisto-Frontend/):
```
VITE_API_BASE_URL=http://localhost:4000
VITE_NODE=development
```

### Running Locally

**Start Backend** (from Farmisto-Backend/):
```bash
npm run dev    # Development with auto-reload
npm start      # Production
```
Server runs on http://localhost:4000

**Start Frontend** (from Farmisto-Frontend/):
```bash
npm run dev      # Development server
npm run build    # Build for production
npm run preview  # Preview production build
```
Frontend dev server runs on http://localhost:5173

---

## 8. Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Root Directory: `Farmisto-Backend`
4. Add environment variables
5. Deploy

Current deployment: https://farmisto.onrender.com

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd Farmisto-Frontend
npm run build
```

2. Deploy to Vercel:
```bash
npx vercel
```

3. Or deploy to Netlify:
   - Connect repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variable: `VITE_NODE=production`

---

## 9. Future Improvements

### Real-Time Negotiation System

A real-time price negotiation feature is planned for future implementation. This will enable direct communication between farmers and consumers for price discussions.

**Planned Features:**
- Chat-based negotiation window using Socket.io
- Real-time messaging via WebSockets
- Price offer/counter-offer system
- Potential voice/video calls via WebRTC (future)

**Integration Plan:**
1. Socket.io server added to server.js
2. New MongoDB collection for chat history
3. JWT authentication for WebSocket connections
4. Room-based system for farmer-consumer pairs
5. Event types: join-negotiation, send-message, price-offer, price-counter, accept-offer, end-negotiation

The negotiation window UI already exists in the codebase and would connect to Socket.io client for real-time updates.

---

## License

This project is proprietary. All rights reserved.

---

## Contributors

- **Bhanu Pratap** - Project Lead and Full Stack Developer

---

*Built with care for local farmers and fresh food lovers.*
