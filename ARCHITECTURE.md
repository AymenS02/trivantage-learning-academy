# System Architecture: Dynamic Categories

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE LAYER                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────┐         ┌──────────────────────┐             │
│  │   Programs Page      │         │  Admin Courses Page  │             │
│  │  /programs/page.jsx  │         │  /admin/courses/     │             │
│  ├──────────────────────┤         ├──────────────────────┤             │
│  │ • Fetch categories   │         │ • Fetch categories   │             │
│  │ • Dynamic filters    │         │ • Dynamic dropdown   │             │
│  │ • Filter by cat._id  │         │ • CRUD operations    │             │
│  │ • Display cat.name   │         │ • Display cat.name   │             │
│  └─────────┬────────────┘         └─────────┬────────────┘             │
│            │                                 │                           │
└────────────┼─────────────────────────────────┼───────────────────────────┘
             │                                 │
             ▼                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           API LAYER (Next.js)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────┐       ┌────────────────────────┐            │
│  │  Category Routes       │       │  Course Routes         │            │
│  │  /api/categories/      │       │  /api/courses/         │            │
│  ├────────────────────────┤       ├────────────────────────┤            │
│  │ GET    /               │       │ GET    /               │            │
│  │ POST   /               │       │ POST   /               │            │
│  │ GET    /:id            │       │ GET    /:id            │            │
│  │ PUT    /:id            │       │ PUT    /:id            │            │
│  │ DELETE /:id            │       │ DELETE /:id            │            │
│  │ POST   /seed           │       │                        │            │
│  │                        │       │ • Populate category    │            │
│  │ • Validate             │       │ • Auto-assign "Other"  │            │
│  │ • Protect "Other"      │       │                        │            │
│  └────────┬───────────────┘       └────────┬───────────────┘            │
│           │                                │                             │
└───────────┼────────────────────────────────┼─────────────────────────────┘
            │                                │
            ▼                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER (MongoDB)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────┐       ┌────────────────────────┐            │
│  │  Category Collection   │       │  Course Collection     │            │
│  │  models/Category.js    │◄──────│  models/Course.js      │            │
│  ├────────────────────────┤       ├────────────────────────┤            │
│  │ _id: ObjectId          │       │ _id: ObjectId          │            │
│  │ name: String (unique)  │       │ title: String          │            │
│  │ description: String    │       │ description: String    │            │
│  │ isDefault: Boolean     │       │ category: ObjectId ────┤            │
│  │ createdAt: Date        │       │   ref: 'Category'      │            │
│  │ updatedAt: Date        │       │ duration: String       │            │
│  └────────────────────────┘       │ format: String         │            │
│                                    │ ...                    │            │
│  Default Categories:               └────────────────────────┘            │
│  • Healthcare                                                            │
│  • Leadership                     Relationship:                          │
│  • Newcomer Pathways              Course.category → Category._id         │
│  • Other (protected)              One-to-Many                            │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW EXAMPLES                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  1. USER VIEWS PROGRAMS PAGE                                             │
│     User → /programs → fetch('/api/categories')                          │
│                      → fetch('/api/courses?status=published')            │
│                      → Display dynamic filters & courses                 │
│                                                                           │
│  2. ADMIN CREATES COURSE                                                 │
│     Admin → /admin/courses → Select category from dropdown               │
│                            → POST /api/courses {category: catId}         │
│                            → Course created with category reference      │
│                                                                           │
│  3. ADMIN DELETES CATEGORY                                               │
│     Admin → DELETE /api/categories/:id                                   │
│           → Check if "Other"? → Error if yes                             │
│           → Update courses: category = "Other"._id                       │
│           → Delete category                                              │
│                                                                           │
│  4. MIGRATION (ONE-TIME)                                                 │
│     Admin → POST /api/categories/seed                                    │
│           → Create 4 default categories                                  │
│           → Match existing string categories → ObjectIds                 │
│           → Unmatched courses → "Other" category                         │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        KEY DESIGN DECISIONS                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ✓ ObjectId References (not embedded)                                    │
│    → Allows category updates to reflect across all courses               │
│    → Maintains data normalization                                        │
│                                                                           │
│  ✓ "Other" as Protected Default                                          │
│    → Cannot be deleted                                                    │
│    → Automatic fallback for uncategorized courses                        │
│    → Orphaned courses reassigned during category deletion                │
│                                                                           │
│  ✓ Populate on Read                                                      │
│    → Course API populates category details                               │
│    → Frontend receives full category object                              │
│    → No additional frontend API calls needed                             │
│                                                                           │
│  ✓ Migration-Friendly                                                    │
│    → Seed endpoint handles string → ObjectId conversion                  │
│    → Type checking to find string-based categories                       │
│    → Idempotent (safe to run multiple times)                             │
│                                                                           │
│  ✓ Minimal Frontend Changes                                              │
│    → Same UI/UX, different data source                                   │
│    → Simple fetch → map pattern                                          │
│    → Graceful fallbacks (category?.name || 'Other')                      │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## Benefits of This Architecture

### Scalability
- Add unlimited categories without code changes
- Categories managed through database/API, not deployments

### Maintainability
- Single source of truth for categories
- Changes propagate automatically to all courses
- No hardcoded values scattered across codebase

### Flexibility
- Easy to add category metadata (icons, colors, descriptions)
- Foundation for advanced features (hierarchies, ordering, etc.)
- API-driven approach enables future admin UI

### Data Integrity
- Foreign key relationships enforce valid categories
- Cascade logic prevents orphaned courses
- Protected "Other" category ensures data safety

### Developer Experience
- Clear separation of concerns (Model-API-UI)
- Consistent patterns across endpoints
- Well-documented with migration guide
