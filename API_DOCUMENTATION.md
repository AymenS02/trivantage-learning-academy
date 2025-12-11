# API Documentation

This document describes the REST API endpoints for managing users, courses, and enrollments.

## Setup

1. Create a `.env.local` file in the root directory (use `.env.local.example` as template)
2. Add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/trivantage-learning-academy
   ```
   Or use a MongoDB Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

## Base URL
```
http://localhost:3000/api
```

## Users API

### Get All Users
```http
GET /api/users
```

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Get User by ID
```http
GET /api/users/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "coursesEnrolled": [...],
    "enrollmentDate": "2024-01-01T00:00:00.000Z",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create User
```http
POST /api/users
```

Request Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890"
}
```

### Update User
```http
PUT /api/users/:id
```

Request Body (all fields optional):
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "status": "active"
}
```

### Delete User
```http
DELETE /api/users/:id
```

## Courses API

### Get All Courses
```http
GET /api/courses
```

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category (Healthcare, Leadership, Newcomer Pathways, Other)
- `status` (optional): Filter by status (draft, published, archived)

Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Get Course by ID
```http
GET /api/courses/:id
```

### Create Course
```http
POST /api/courses
```

Request Body:
```json
{
  "title": "Healthcare Leadership Certificate",
  "description": "Comprehensive leadership training for healthcare professionals",
  "category": "Healthcare",
  "duration": "8 weeks",
  "format": "Virtual",
  "instructor": "Dr. Jane Smith",
  "price": 1500,
  "maxEnrollment": 30,
  "startDate": "2024-02-01",
  "endDate": "2024-03-30",
  "prerequisites": "None",
  "status": "published"
}
```

### Update Course
```http
PUT /api/courses/:id
```

Request Body (all fields optional):
```json
{
  "title": "Updated Course Title",
  "price": 1600,
  "status": "published"
}
```

### Delete Course
```http
DELETE /api/courses/:id
```

## Enrollments API

### Enroll User in Course
```http
POST /api/enrollments
```

Request Body:
```json
{
  "userId": "user_id_here",
  "courseId": "course_id_here"
}
```

Response:
```json
{
  "success": true,
  "data": { ...user with populated courses },
  "message": "User successfully enrolled in course"
}
```

### Unenroll User from Course
```http
DELETE /api/enrollments?userId=USER_ID&courseId=COURSE_ID
```

Query Parameters:
- `userId` (required): User ID
- `courseId` (required): Course ID

Response:
```json
{
  "success": true,
  "data": { ...user with populated courses },
  "message": "User successfully unenrolled from course"
}
```

## User Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| firstName | String | Yes | User's first name (max 50 chars) |
| lastName | String | Yes | User's last name (max 50 chars) |
| email | String | Yes | User's email (unique, validated) |
| phone | String | No | Phone number (max 20 chars) |
| coursesEnrolled | Array | No | Array of Course ObjectIds |
| enrollmentDate | Date | No | Date user enrolled (default: now) |
| status | String | No | active, inactive, or suspended (default: active) |
| createdAt | Date | Auto | Timestamp of creation |
| updatedAt | Date | Auto | Timestamp of last update |

## Course Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Course title (max 100 chars) |
| description | String | Yes | Course description (max 1000 chars) |
| category | String | Yes | Healthcare, Leadership, Newcomer Pathways, or Other |
| duration | String | Yes | Course duration (e.g., "8 weeks") |
| format | String | No | Virtual, In-Person, or Hybrid (default: Virtual) |
| instructor | String | No | Instructor name (max 100 chars) |
| price | Number | No | Course price (default: 0, min: 0) |
| maxEnrollment | Number | No | Max students (default: 30, min: 1) |
| currentEnrollment | Number | No | Current number of enrolled students (default: 0) |
| startDate | Date | No | Course start date |
| endDate | Date | No | Course end date |
| prerequisites | String | No | Course prerequisites |
| status | String | No | draft, published, or archived (default: draft) |
| createdAt | Date | Auto | Timestamp of creation |
| updatedAt | Date | Auto | Timestamp of last update |

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Example Usage with cURL

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  }'
```

### Create a Course
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Healthcare Leadership",
    "description": "Leadership training for healthcare professionals",
    "category": "Healthcare",
    "duration": "8 weeks",
    "format": "Virtual",
    "price": 1500,
    "status": "published"
  }'
```

### Enroll User in Course
```bash
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "courseId": "COURSE_ID_HERE"
  }'
```

### Get All Users
```bash
curl http://localhost:3000/api/users?page=1&limit=10
```

### Get User by ID
```bash
curl http://localhost:3000/api/users/USER_ID_HERE
```
