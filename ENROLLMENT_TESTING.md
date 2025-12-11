# Enrollment System Testing Guide

This document provides instructions for testing the new enrollment system features.

## Overview

The enrollment system allows students to:
1. Browse available courses on the programs page
2. Click "Enroll Now" to go to the admissions page
3. Select a course and fill out an enrollment form
4. Submit the enrollment request
5. Track enrollment status (pending/accepted/rejected)
6. Access course dashboard once enrollment is accepted

Admins can:
1. View all enrollment requests in the admin panel
2. Filter requests by status (pending/accepted/rejected)
3. Review detailed enrollment information
4. Accept or reject enrollment requests
5. See pending enrollment count on dashboard

## Testing Steps

### 1. Setup
- Ensure MongoDB is running and connected
- Create some test courses via admin panel (or directly in database)
- Create test user accounts (both student and admin roles)

### 2. Student Enrollment Flow

#### A. Browse Courses
1. Navigate to `/programs`
2. Verify courses are displayed with their details (title, description, price, duration, etc.)
3. Verify "Enroll Now" button appears for courses you're not enrolled in

#### B. Submit Enrollment Request
1. Click "Enroll Now" on any course
2. You should be redirected to `/admissions` page
3. Verify the selected course is pre-selected in the Course Selection section
4. Fill out the enrollment form with required information:
   - First Name, Last Name, Email (required)
   - Gender (required)
   - Course Selection (required)
   - Consent Name and Date (required)
5. Click "Submit"
6. Verify success message appears
7. You should be redirected back to `/programs`

#### C. Check Enrollment Status
1. Return to `/programs` page
2. Verify the enrolled course now shows "Pending" instead of "Enroll Now"
3. Try to enroll in the same course again - should see error message

#### D. Access Course Dashboard (After Admin Approval)
1. After admin accepts your enrollment (see Admin Flow below)
2. Go to `/programs` page
3. Verify the approved course shows "Dashboard" button
4. Click "Dashboard"
5. Verify you can access the course dashboard at `/courses/[courseId]/dashboard`
6. Verify dashboard shows:
   - Course overview and details
   - Enrollment status (Enrolled)
   - Enrollment date
   - Quick links

### 3. Admin Enrollment Review Flow

#### A. Access Admin Panel
1. Login as admin user
2. Navigate to `/admin`
3. Verify "Pending Enrollments" stat shows correct count
4. Click "Review Enrollments" in Quick Actions

#### B. View Enrollment Requests
1. You should be at `/admin/enrollments`
2. Verify pending enrollments are displayed by default
3. Verify table shows:
   - Student name and gender
   - Course name and price
   - Contact information (email, phone)
   - Date submitted
   - Status badge
   - Action buttons

#### C. Review Detailed Information
1. Click "View Details" on any enrollment
2. Verify modal appears with comprehensive information:
   - Personal information
   - Course selection
   - Address (if provided)
   - Background (work experience, education)
   - Special needs (if provided)
   - Submission details
3. Close modal by clicking X

#### D. Accept Enrollment
1. Click "Accept" button on a pending enrollment
2. Confirm the action
3. Verify success message
4. Verify enrollment disappears from pending list
5. Switch filter to "accepted"
6. Verify enrollment appears in accepted list

#### E. Reject Enrollment
1. Switch filter back to "pending"
2. Click "Reject" button on a pending enrollment
3. Confirm the action
4. Verify success message
5. Verify enrollment disappears from pending list
6. Switch filter to "rejected"
7. Verify enrollment appears in rejected list

### 4. Data Integrity Tests

#### A. Course Enrollment Count
1. Note the course's `currentEnrollment` count before accepting
2. Accept an enrollment request
3. Verify course's `currentEnrollment` increased by 1
4. Verify user's `coursesEnrolled` array includes the course

#### B. Duplicate Prevention
1. Try to submit enrollment for same course twice
2. Verify error message appears
3. Verify no duplicate enrollment records are created

#### C. Max Enrollment Check
1. Set a course's `maxEnrollment` to a low number (e.g., 1)
2. Accept enrollments until max is reached
3. Try to accept another enrollment
4. Verify error message about max enrollment reached

#### D. Unenrollment on Rejection
1. Accept an enrollment
2. Verify user is enrolled in course
3. Change enrollment status from accepted to rejected
4. Verify user is removed from course
5. Verify course enrollment count decreased

## API Endpoints

### Enrollment Requests API

#### GET /api/enrollment-requests
- Query params: `status`, `userId`, `page`, `limit`
- Returns list of enrollment requests with pagination

#### POST /api/enrollment-requests
- Body: Enrollment data including `selectedCourse` (required)
- Creates new enrollment request with "pending" status

#### GET /api/enrollment-requests/[id]
- Returns single enrollment request with populated fields

#### PUT /api/enrollment-requests/[id]
- Body: Fields to update (typically `status`, `reviewedBy`, `reviewedAt`)
- Updates enrollment status
- Handles enrollment/unenrollment logic for accepted/rejected changes

#### DELETE /api/enrollment-requests/[id]
- Deletes enrollment request

## Database Models

### Enrollment Schema
- Student information (firstName, lastName, email, phone)
- Address & demographics
- Immigration & background information
- Selected course (reference to Course)
- Special needs
- Consent information
- Status (pending/accepted/rejected)
- User reference (if logged in)
- Admin review information (reviewedBy, reviewedAt, adminNotes)
- Timestamps

## Known Behaviors

1. **User Account Optional**: Students can submit enrollment requests without being logged in. If logged in, their userId is linked to the enrollment.

2. **Course Pre-selection**: When clicking "Enroll Now" from programs page, the course is pre-selected in the admissions form.

3. **Status Display**: Programs page shows different buttons based on enrollment status:
   - Not enrolled: "Enroll Now"
   - Pending: "Pending" (not clickable)
   - Accepted: "Dashboard" (links to course dashboard)

4. **Transaction Safety**: Accepting/rejecting enrollments uses MongoDB transactions to ensure data consistency.

5. **ObjectId Comparisons**: All course ID comparisons are done using `.toString()` for reliability.

## Troubleshooting

### Issue: Courses not loading in admissions page
- Check API endpoint `/api/courses?status=published&limit=1000`
- Verify courses exist with status "published"
- Check browser console for errors

### Issue: Enrollment status not updating
- Verify user is logged in when checking enrollment status
- Check enrollment-requests API returns correct data
- Verify userId matches between localStorage and enrollment records

### Issue: Cannot accept enrollment
- Check course's maxEnrollment vs currentEnrollment
- Verify MongoDB transactions are working
- Check for any validation errors in API response

### Issue: Dashboard not accessible
- Verify enrollment status is "accepted"
- Check user is logged in
- Verify course ID in URL is correct
