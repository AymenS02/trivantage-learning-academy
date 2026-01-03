import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Course from '@/models/Course';

// GET single category
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// PUT update category
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE category
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    // Find the "Other" category to reassign courses
    const otherCategory = await Category.findOne({ name: 'Other' });
    
    if (!otherCategory) {
      return NextResponse.json(
        { success: false, error: 'Default "Other" category not found. Cannot delete category.' },
        { status: 400 }
      );
    }

    // Check if trying to delete the "Other" category
    const categoryToDelete = await Category.findById(id);
    if (categoryToDelete && categoryToDelete.name === 'Other') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete the default "Other" category' },
        { status: 400 }
      );
    }

    // Reassign all courses from this category to "Other"
    await Course.updateMany(
      { category: id },
      { category: otherCategory._id }
    );

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {},
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
