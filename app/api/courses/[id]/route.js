import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

// GET course by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const course = await Course.findById(params.id);

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

    const body = await request.json();
    const course = await Course.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

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

    const course = await Course.findByIdAndDelete(params.id);

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
