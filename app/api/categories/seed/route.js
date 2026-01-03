import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Course from '@/models/Course';

// POST seed initial categories
export async function POST() {
  try {
    await dbConnect();

    // Check if categories already exist
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      return NextResponse.json({
        success: true,
        message: 'Categories already exist',
        data: await Category.find(),
      });
    }

    // Create initial categories
    const categories = [
      { name: 'Healthcare', description: 'Healthcare-related courses and programs' },
      { name: 'Leadership', description: 'Leadership development programs' },
      { name: 'Newcomer Pathways', description: 'Programs for newcomers and immigrants' },
      { name: 'Other', description: 'Miscellaneous courses', isDefault: true },
    ];

    const createdCategories = await Category.insertMany(categories);

    // Find the "Other" category ID
    const otherCategory = createdCategories.find(cat => cat.name === 'Other');

    // Update existing courses with string categories to use the new category references
    if (otherCategory) {
      // First, update courses that have matching category names
      for (const category of createdCategories) {
        await Course.updateMany(
          { category: category.name },
          { category: category._id }
        );
      }

      // Set "Other" as default for courses with no category, null, or any unmatched string categories
      // This uses $type: 2 to match string types, ensuring we catch all string-based categories
      await Course.updateMany(
        { 
          $or: [
            { category: { $exists: false } }, 
            { category: null },
            { category: { $type: 2 } } // Type 2 is string in MongoDB
          ] 
        },
        { category: otherCategory._id }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Categories seeded successfully',
        data: createdCategories,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
