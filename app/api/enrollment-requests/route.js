import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import User from '@/models/User';

// GET all enrollment requests
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;

    // Get enrollments with populated course information
    const enrollments = await Enrollment.find(query)
      .populate('selectedCourse', 'title category price duration format')
      .populate('userId', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Enrollment.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: enrollments,
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

// POST create new enrollment request
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Verify the course exists
    const course = await Course.findById(body.selectedCourse);
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Selected course not found' },
        { status: 404 }
      );
    }

    // Check if this email already has a pending or accepted enrollment for this course
    const existingEnrollment = await Enrollment.findOne({
      email: body.email,
      selectedCourse: body.selectedCourse,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        {
          success: false,
          error: 'You already have a pending or accepted enrollment for this course',
        },
        { status: 400 }
      );
    }

    // If userId is provided, verify the user exists
    if (body.userId) {
      const user = await User.findById(body.userId);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
    }

    // Create enrollment request
    const enrollment = await Enrollment.create(body);

    // Populate the course information for response
    await enrollment.populate('selectedCourse', 'title category price duration format');

    return NextResponse.json(
      {
        success: true,
        data: enrollment,
        message: 'Enrollment request submitted successfully',
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
