# Category System Migration Guide

## Overview
The program categories have been migrated from static hardcoded values to a dynamic database-driven system. This allows administrators to create, update, and manage categories through the database.

## What Changed

### Before
- Categories were hardcoded in the frontend: `Healthcare`, `Leadership`, `Newcomer Pathways`, `Other`
- Course category was stored as a string enum in the database

### After
- Categories are stored in a separate `Category` collection in MongoDB
- Courses reference categories via ObjectId
- Categories can be managed dynamically through API endpoints
- Courses without a category automatically get assigned to "Other"

## Initial Setup

### 1. Seed Initial Categories
Before using the new system, you need to seed the initial categories. Make a POST request to:

```
POST /api/categories/seed
```

This will:
- Create the four default categories: Healthcare, Leadership, Newcomer Pathways, Other
- Update existing courses to use the new category references
- Set courses without categories to "Other"

You can do this by:
1. Using curl:
   ```bash
   curl -X POST http://localhost:3000/api/categories/seed
   ```
2. Using the browser's console on any page of your app:
   ```javascript
   fetch('/api/categories/seed', { method: 'POST' })
     .then(r => r.json())
     .then(data => console.log(data))
   ```

### 2. Verify Categories
Check that categories were created:
```bash
curl http://localhost:3000/api/categories
```

## API Endpoints

### Categories

#### Get All Categories
```
GET /api/categories
```
Returns all categories sorted by name.

#### Create Category
```
POST /api/categories
Body: {
  "name": "Category Name",
  "description": "Optional description"
}
```

#### Get Single Category
```
GET /api/categories/:id
```

#### Update Category
```
PUT /api/categories/:id
Body: {
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### Delete Category
```
DELETE /api/categories/:id
```
Note: Cannot delete the "Other" category. Courses in deleted categories are automatically moved to "Other".

### Courses

Courses now return populated category objects:
```json
{
  "_id": "...",
  "title": "Course Title",
  "category": {
    "_id": "...",
    "name": "Healthcare",
    "description": "Healthcare-related courses"
  },
  ...
}
```

## UI Changes

### Programs Page
- Filter buttons are now generated dynamically from the database
- Categories are fetched on page load
- Filtering works by category ID instead of string matching

### Admin Courses Page
- Category dropdown is populated from the database
- Displays category name instead of string value
- Automatically fetches categories on page load

## Default Behavior

### "Other" Category
- The "Other" category serves as the default category
- Cannot be deleted
- Courses without a category are automatically assigned to "Other"
- When a category is deleted, its courses are moved to "Other"

## Troubleshooting

### Categories not showing in UI
1. Make sure you've run the seed endpoint: `POST /api/categories/seed`
2. Check browser console for API errors
3. Verify MongoDB connection is working

### Existing courses not showing category
1. Run the seed endpoint to migrate existing courses
2. If courses still don't have categories, they should automatically be assigned "Other" when updated

### Can't create new courses
1. Ensure categories exist in the database
2. Check that the "Other" category exists as a fallback
3. Verify MongoDB connection

## Benefits

1. **Flexibility**: Add/remove/modify categories without code changes
2. **Scalability**: Easy to add new program types
3. **Data Integrity**: Proper relational structure with foreign keys
4. **Future-proof**: Foundation for more advanced category features (icons, colors, ordering, etc.)

## Future Enhancements

Potential features that can be added:
- Category icons or images
- Category ordering/priority
- Hierarchical categories (parent/child)
- Category-specific metadata
- Category colors for UI themes
- Active/inactive status for categories
