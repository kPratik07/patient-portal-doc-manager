# Patient Portal Document Manager - Design Document

## 1. Tech Stack Choices

### Q1: Frontend - React 19 + Vite + Tailwind CSS
- **React 19**: Component-based, modular UI
- **Vite**: Fast build tool with HMR
- **Tailwind CSS**: Rapid UI development
- **Axios**: HTTP client with better error handling

### Q2: Backend - Express.js (Node.js)
- **Express.js**: Lightweight, perfect for REST APIs
- **Node.js**: JavaScript across full stack
- **Mongoose**: Schema validation & MongoDB integration
- **Multer**: Industry-standard file upload middleware

### Q3: Database - MongoDB
- **Document-based**: Natural fit for file metadata
- **Scalable**: Horizontal scaling easier than SQLite
- **Cloud-ready**: MongoDB Atlas free tier for development
- **Trade-off**: Requires network connection (Atlas) vs local SQLite

### Q4: Scaling to 1,000 Users
1. Add user authentication (JWT) & user_id to documents
2. Migrate to cloud storage (AWS S3)
3. Add database indexes & pagination
4. Implement Redis caching layer
5. Use CDN (CloudFront) for file delivery
6. Load balancing with multiple backend instances
7. Structured logging & monitoring (New Relic/DataDog)
8. Rate limiting & HTTPS/TLS security

---

## 2. Architecture Overview

```
Frontend (React)  →  HTTP/REST API  →  Backend (Express)
                                              ↓
                                    ┌─────────┴─────────┐
                                    ↓                   ↓
                              File System          MongoDB
                              (uploads/)           (metadata)
```

**Components:**
- **Frontend**: App.jsx, UploadForm.jsx, DocumentList.jsx, DocumentItem.jsx, PDFViewerModal.jsx, Navbar.jsx
- **Backend**: Routes (documents.js), Models (Document.js), Middleware (Multer, CORS, Error handling)
- **Storage**: uploads/ directory + MongoDB

---

## 3. API Specification

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/documents/upload` | POST | Upload PDF file |
| `/documents` | GET | List all documents |
| `/documents/:id` | GET | Download file |
| `/documents/:id/view` | GET | View file inline |
| `/documents/:id` | DELETE | Delete file |

### Upload Example
```bash
curl -X POST http://localhost:5000/documents/upload -F "file=@prescription.pdf"
```

**Response (201):**
```json
{
  "message": "File uploaded successfully",
  "document": {
    "id": "507f1f77bcf86cd799439011",
    "filename": "prescription.pdf",
    "filesize": 245632,
    "created_at": "2025-12-10T08:30:00.000Z"
  }
}
```

### List Documents
```bash
curl http://localhost:5000/documents
```

### Download File
```bash
curl -O http://localhost:5000/documents/507f1f77bcf86cd799439011
```

### Delete File
```bash
curl -X DELETE http://localhost:5000/documents/507f1f77bcf86cd799439011
```

---

## 4. Data Flow Description

### Q5: Upload & Download Process

**Upload Flow:**
1. User selects PDF file → Frontend validates (PDF only, <10MB)
2. Axios sends FormData to `/documents/upload`
3. Multer stores file in `uploads/` with unique name
4. Backend calculates SHA256 hash for duplicate detection
5. Mongoose saves metadata to MongoDB
6. Frontend refreshes document list
7. Toast notification confirms success

**Download Flow:**
1. User clicks Download button
2. Frontend sends GET to `/documents/:id`
3. Backend retrieves file path from MongoDB
4. Express sends file as attachment
5. Browser downloads with original filename

**View Flow:**
1. User clicks View button
2. PDFViewerModal opens with loading spinner
3. Frontend requests `/documents/:id/view`
4. Backend serves PDF inline
5. Browser's PDF viewer renders document
6. User can zoom, navigate, and download from viewer

**Delete Flow:**
1. User confirms deletion
2. Frontend sends DELETE to `/documents/:id`
3. Backend deletes file from disk & MongoDB record
4. Frontend removes item from list
5. Toast notification confirms deletion

---

## 5. Assumptions

### Q6: Key Assumptions Made

| Assumption | Rationale | Production Change |
|-----------|-----------|-------------------|
| **Single User** | Assignment specifies "assume one user" | Add JWT auth & user_id |
| **10MB File Limit** | Reasonable for medical docs | Make configurable |
| **PDF Only** | Simplifies processing | Support multiple formats |
| **Local File Storage** | Simple for development | Use AWS S3 |
| **SHA256 Duplicate Detection** | Saves storage space | Allow duplicates with versioning |
| **No Encryption** | Development environment | Implement AES-256 encryption |
| **No Backups** | Not production-critical | Daily backups & disaster recovery |
| **No Concurrency Locks** | Low concurrency in dev | File locks & upload queue |
| **Basic Error Handling** | Sufficient for dev | Structured logging (Winston) |
| **CORS All Origins** | Development convenience | Restrict to specific domains |
| **MongoDB Atlas** | No local install needed | Managed database service |
| **No Rate Limiting** | Single user | Implement express-rate-limit |

---

## Summary

✅ **All assignment requirements met:**
- Frontend: Upload, list, download, delete, view PDFs
- Backend: 5 REST endpoints with proper validation
- Database: MongoDB with file metadata schema
- Documentation: Design choices, API specs, data flows, assumptions
- Code: Clean, modular, production-ready structure
