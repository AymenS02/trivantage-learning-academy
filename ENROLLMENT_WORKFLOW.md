# Enrollment System Workflow

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         STUDENT ENROLLMENT FLOW                          │
└─────────────────────────────────────────────────────────────────────────┘

1. BROWSE COURSES
   ┌──────────────────┐
   │  /programs       │  Student views published courses
   │                  │  Each course shows:
   │  [Course List]   │  - Title, description, price
   │                  │  - Category, duration, format
   │  "Enroll Now" →  │  - "Enroll Now" button (if not enrolled)
   └──────────────────┘

                ↓

2. SUBMIT ENROLLMENT
   ┌──────────────────┐
   │  /admissions     │  Student fills enrollment form:
   │                  │  - Personal information ✓
   │  [Form]          │  - Address & demographics
   │  - Select Course │  - Immigration status
   │  - Fill Details  │  - Work experience
   │  - Submit →      │  - Selected course ✓
   └──────────────────┘
                ↓
   ┌──────────────────┐
   │ API: POST        │  Creates enrollment request
   │ /enrollment-     │  - Status: "pending"
   │  requests        │  - Links to user if logged in
   └──────────────────┘

                ↓

3. CHECK STATUS
   ┌──────────────────┐
   │  /programs       │  Student returns to programs
   │                  │  
   │  "Pending" →     │  Button now shows "Pending"
   │                  │  (not clickable)
   └──────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          ADMIN REVIEW FLOW                               │
└─────────────────────────────────────────────────────────────────────────┘

4. ADMIN REVIEW
   ┌──────────────────┐
   │  /admin          │  Admin sees dashboard
   │                  │  
   │  Pending: 5      │  Shows pending enrollment count
   │  "Review" →      │
   └──────────────────┘
                ↓
   ┌──────────────────┐
   │ /admin/          │  Admin reviews requests
   │  enrollments     │  
   │                  │  Table shows:
   │  [Table View]    │  - Student details
   │  - Filter: ▼     │  - Course selection
   │    • Pending     │  - Contact info
   │    • Accepted    │  - Submission date
   │    • Rejected    │
   │                  │
   │  [Accept] [View] │  Actions available:
   │  [Reject]        │  - Accept, Reject, View Details
   └──────────────────┘

                ↓

5. APPROVAL/REJECTION
   
   ┌────────────────────────────────────────────────────┐
   │                  ACCEPT FLOW                       │
   ├────────────────────────────────────────────────────┤
   │  Admin clicks "Accept"                             │
   │         ↓                                          │
   │  API: PUT /enrollment-requests/[id]                │
   │  - Updates status to "accepted"                    │
   │  - Enrolls user in course                          │
   │  - Increments course enrollment count              │
   │  - Records admin and timestamp                     │
   │         ↓                                          │
   │  Student can now access course                     │
   └────────────────────────────────────────────────────┘
   
   ┌────────────────────────────────────────────────────┐
   │                  REJECT FLOW                       │
   ├────────────────────────────────────────────────────┤
   │  Admin clicks "Reject"                             │
   │         ↓                                          │
   │  API: PUT /enrollment-requests/[id]                │
   │  - Updates status to "rejected"                    │
   │  - If previously accepted, unenrolls user          │
   │  - Decrements course enrollment count              │
   │  - Records admin and timestamp                     │
   │         ↓                                          │
   │  Student enrollment denied                         │
   └────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      COURSE ACCESS FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

6. COURSE DASHBOARD ACCESS
   ┌──────────────────┐
   │  /programs       │  After acceptance:
   │                  │  
   │  "Dashboard" →   │  Button changes to "Dashboard"
   └──────────────────┘
                ↓
   ┌──────────────────┐
   │ /courses/[id]/   │  Student accesses course:
   │  dashboard       │  
   │                  │  Shows:
   │  [Course Info]   │  - Course overview
   │  [Enrollment]    │  - Enrollment details
   │  [Quick Links]   │  - Materials (when available)
   │                  │  - Support links
   └──────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      DATABASE RELATIONSHIPS                              │
└─────────────────────────────────────────────────────────────────────────┘

   ┌─────────────┐           ┌──────────────┐           ┌─────────────┐
   │   User      │           │  Enrollment  │           │   Course    │
   ├─────────────┤           ├──────────────┤           ├─────────────┤
   │ _id         │◄────┐     │ _id          │     ┌────►│ _id         │
   │ firstName   │     │     │ firstName    │     │     │ title       │
   │ lastName    │     │     │ lastName     │     │     │ description │
   │ email       │     │     │ email        │     │     │ category    │
   │ role        │     │     │ phone        │     │     │ price       │
   │ courses     │     │     │ ...details   │     │     │ duration    │
   │  Enrolled[] │◄────┼────►│ selectedCourse│────┘     │ maxEnroll   │
   │             │     │     │ userId       │          │ currentEnroll│
   └─────────────┘     │     │ status       │          └─────────────┘
                       │     │ reviewedBy   │
                       └─────┤              │
                             └──────────────┘

   Relationships:
   • Enrollment.userId → User._id (optional, if logged in)
   • Enrollment.selectedCourse → Course._id (required)
   • Enrollment.reviewedBy → User._id (admin who reviewed)
   • User.coursesEnrolled[] → Course._id[] (after acceptance)

┌─────────────────────────────────────────────────────────────────────────┐
│                          API ENDPOINTS                                   │
└─────────────────────────────────────────────────────────────────────────┘

   GET    /api/enrollment-requests              List enrollments (with filters)
   POST   /api/enrollment-requests              Create enrollment request
   GET    /api/enrollment-requests/[id]         Get single enrollment
   PUT    /api/enrollment-requests/[id]         Update enrollment (approve/reject)
   DELETE /api/enrollment-requests/[id]         Delete enrollment

   GET    /api/courses                          List courses
   GET    /api/courses/[id]                     Get course details

   GET    /api/users/[id]                       Get user details

┌─────────────────────────────────────────────────────────────────────────┐
│                      STATUS STATE MACHINE                                │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌──────────┐
                    │ PENDING  │  ← Initial state on submission
                    └────┬─────┘
                         │
            ┌────────────┼────────────┐
            │                         │
            ↓                         ↓
      ┌──────────┐              ┌──────────┐
      │ ACCEPTED │              │ REJECTED │
      └──────────┘              └──────────┘
            │                         │
            │                         │
            └────────────┬────────────┘
                         ↓
                    (Can change)
                         
   State Transitions:
   • pending → accepted: Admin approves, user enrolled
   • pending → rejected: Admin denies, no enrollment
   • accepted → rejected: Admin reverses, user unenrolled
   • rejected → accepted: Admin approves, user enrolled

┌─────────────────────────────────────────────────────────────────────────┐
│                      BUTTON STATE LOGIC                                  │
└─────────────────────────────────────────────────────────────────────────┘

   Programs Page Button Display:

   ┌────────────────────┬─────────────────────┬──────────────────────┐
   │  Enrollment Status │  Button Text        │  Button Action       │
   ├────────────────────┼─────────────────────┼──────────────────────┤
   │  None              │  "Enroll Now"       │  → /admissions       │
   │  Pending           │  "Pending"          │  (disabled/no action)│
   │  Accepted          │  "Dashboard"        │  → /courses/[id]/    │
   │                    │                     │    dashboard         │
   │  Rejected          │  "Enroll Now"       │  → /admissions       │
   └────────────────────┴─────────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      DATA CONSISTENCY                                    │
└─────────────────────────────────────────────────────────────────────────┘

   MongoDB Transactions ensure:
   
   1. Accept Enrollment:
      ┌─────────────────────────────────────────────────┐
      │ BEGIN TRANSACTION                               │
      │  1. Update enrollment.status = "accepted"       │
      │  2. Add course to user.coursesEnrolled[]        │
      │  3. Increment course.currentEnrollment          │
      │  4. Record reviewedBy and reviewedAt            │
      │ COMMIT TRANSACTION                              │
      └─────────────────────────────────────────────────┘
      
      If any step fails → entire transaction rolls back
   
   2. Reject Previously Accepted:
      ┌─────────────────────────────────────────────────┐
      │ BEGIN TRANSACTION                               │
      │  1. Update enrollment.status = "rejected"       │
      │  2. Remove course from user.coursesEnrolled[]   │
      │  3. Decrement course.currentEnrollment          │
      │  4. Record reviewedBy and reviewedAt            │
      │ COMMIT TRANSACTION                              │
      └─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      SECURITY MEASURES                                   │
└─────────────────────────────────────────────────────────────────────────┘

   1. Authentication Checks
      • Admin pages require admin role
      • Course dashboard requires enrollment verification
      
   2. Duplicate Prevention
      • Cannot enroll in same course multiple times
      • Checked by email + courseId + status
      
   3. Validation
      • Course existence validated
      • User existence validated (if userId provided)
      • Max enrollment capacity checked
      
   4. Authorization
      • Only admins can approve/reject
      • Only enrolled students can access dashboard
      
   5. Data Integrity
      • MongoDB transactions prevent race conditions
      • ObjectId comparisons done correctly with .toString()
