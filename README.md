# Patient Portal Document Manager

A full-stack web application for managing patient medical documents. This system allows patients to upload, view, and manage their PDF documents securely through a modern web interface.

## 🎯 Features

- **Document Upload**: Upload PDF documents with validation
- **Document Management**: View, download, and delete patient documents
- **Secure Storage**: Files stored in MongoDB with server-side validation
- **Responsive UI**: Modern React-based frontend with Tailwind CSS
- **RESTful API**: Express.js backend with MongoDB integration
- **Error Handling**: Comprehensive error handling and validation

## 🏗️ Project Structure

```
patient-portal-doc-manager/
├── backend/                    # Node.js/Express server
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API endpoints
│   ├── uploads/               # Document storage directory
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Environment variables template
│
└── frontend/                  # React application
    ├── src/                   # React components and logic
    ├── public/                # Static assets
    ├── package.json           # Frontend dependencies
    ├── vite.config.js         # Vite configuration
    ├── tailwind.config.js     # Tailwind CSS configuration
    └── .env.example           # Environment variables template
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **ESLint** - Code linting

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd patient-portal-doc-manager
```
### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables in .env
# Required variables:
# - MONGODB_URI: MongoDB connection string
# - PORT: Server port (default: 5000)
# - NODE_ENV: Environment (development/production)
# - UPLOAD_DIR: Directory for storing uploads

# Start the server
npm run dev    # Development with nodemon
npm start      # Production
```
### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables in .env
# Required variables:
# - VITE_API_URL: Backend API URL (e.g., http://localhost:5000)

# Start the development server
npm run dev

# Build for production
npm run build
```
## 📡 API Endpoints

### Health Check
- **GET** `/health` - Check if backend is running

### Documents
- **GET** `/documents` - Retrieve all documents
- **POST** `/documents` - Upload a new document
- **GET** `/documents/:id` - Get document details
- **DELETE** `/documents/:id` - Delete a document
- **GET** `/uploads/:filename` - Download document file

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/patient-portal
PORT=5000
NODE_ENV=development
UPLOAD_DIR=./uploads
```
### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```
## 📝 File Upload Specifications

- **Supported Format**: PDF only
- **Maximum File Size**: 10MB
- **Storage**: Server-side file storage with MongoDB metadata

## 🔒 Security Features

- File type validation (PDF only)
- File size limits (10MB max)
- CORS protection
- Input validation
- Error handling with safe error messages

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```
### Frontend
```bash
cd frontend
npm run lint
```
## 📦 Building for Production

### Backend
```bash
cd backend
npm install --production
npm start
```
### Frontend
```bash
cd frontend
npm run build
# Output will be in dist/ directory
```
## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check your MongoDB Atlas connection string
- Verify `MONGODB_URI` in `.env` is correct

### File Upload Errors
- Check that the `uploads/` directory exists and has write permissions
- Ensure file is in PDF format and under 10MB
- Verify `UPLOAD_DIR` path in `.env`

### CORS Errors
- Ensure backend is running on the correct port
- Verify `VITE_API_URL` in frontend `.env` matches backend URL
- Check CORS is enabled in backend

### Port Already in Use
- Change `PORT` in backend `.env` to an available port
- Update `VITE_API_URL` in frontend `.env` accordingly

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## 👤 Author

Made With❤️ By Pratik Raj 
---