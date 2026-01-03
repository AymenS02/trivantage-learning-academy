import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Category from '@/models/Category';

// GET course by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const course = await Course.findById(id).populate('category');

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// PUT update course by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const body = await request.json();
    
    // If no category is provided, assign to "Other" category
    if (!body.category) {
      const otherCategory = await Category.findOne({ name: 'Other' });
      if (otherCategory) {
        body.category = otherCategory._id;
      }
    }
    
    const course = await Course.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate('category');

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE course by ID
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
