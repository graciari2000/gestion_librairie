# BookVault - Library Management System

A modern, full-stack library management system built with React, Node.js,
Express, and MongoDB. Users can browse books, borrow them for a fee, and manage
their borrowing history.

## Features

### User Features

- **User Authentication**: Secure registration and login system
- **Book Browsing**: Search and filter through extensive book collection
- **Book Borrowing**: Rent books with flexible daily rates
- **Dashboard**: Track borrowed books, due dates, and fees
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### Admin Features

- **Book Management**: Add, edit, and delete books
- **User Management**: View and manage user accounts
- **Borrowing Tracking**: Monitor all borrowing activities
- **Analytics**: View library statistics and trends

### Technical Features

- **RESTful API**: Clean, well-documented backend API
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Integration**: Scalable database with Atlas support
- **Real-time Updates**: Dynamic fee calculations
- **Production Ready**: Optimized for deployment

## Technology Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for development and building

### Backend

- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd library-management-system
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables: Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5003
```

4. Start the development server:

```bash
npm run dev
```

This will start both the frontend (Vite) and backend (Express) servers
concurrently.

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Add your IP address to the IP whitelist
4. Create a database user
5. Get your connection string and update the `MONGODB_URI` in your `.env` file

## Project Structure

```
├── server/                 # Backend Express application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js          # Server entry point
├── src/                   # Frontend React application
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── pages/            # Page components
│   └── App.tsx           # Main App component
├── public/               # Static assets
└── package.json         # Dependencies and scripts
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Books

- `GET /api/books` - Get all books (with search/filter)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Add new book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### Borrowings

- `POST /api/borrowings` - Borrow a book
- `GET /api/borrowings/my-borrowings` - Get user's borrowings
- `PUT /api/borrowings/:id/return` - Return a book
- `GET /api/borrowings/all` - Get all borrowings (admin only)

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)

## Demo Accounts

For testing purposes, you can use these demo accounts:

**Admin Account:**

- Email: admin@bookvault.com
- Password: password123

**User Account:**

- Email: user@bookvault.com
- Password: password123

## Deployment

The application is ready for deployment on platforms like:

- **Frontend**: Netlify, Vercel, or any static hosting
- **Backend**: Heroku, Railway, or any Node.js hosting
- **Database**: MongoDB Atlas (recommended)

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
