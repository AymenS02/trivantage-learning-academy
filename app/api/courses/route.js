import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

// GET all courses
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Course.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// POST create a new course
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const course = await Course.create(body);

    return NextResponse.json(
      { success: true, data: course },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
