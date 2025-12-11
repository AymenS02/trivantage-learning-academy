import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';

// POST enroll a user in a course
export async function POST(request) {
  try {
    await dbConnect();

    const { userId, courseId } = await request.json();

    if (!userId || !courseId) {
      return NextResponse.json(
        { success: false, error: 'Please provide both userId and courseId' },
        { status: 400 }
      );
    }

    // Find user and course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user is already enrolled
    if (user.coursesEnrolled.includes(courseId)) {
      return NextResponse.json(
        { success: false, error: 'User is already enrolled in this course' },
        { status: 400 }
      );
    }

    // Check if course has reached max enrollment
    if (course.currentEnrollment >= course.maxEnrollment) {
      return NextResponse.json(
        { success: false, error: 'Course has reached maximum enrollment' },
        { status: 400 }
      );
    }

    // Enroll user in course
    user.coursesEnrolled.push(courseId);
    await user.save();

    // Update course enrollment count
    course.currentEnrollment += 1;
    await course.save();

    // Return updated user with populated courses
    const updatedUser = await User.findById(userId).populate(
      'coursesEnrolled',
      'title category format'
    );

    return NextResponse.json(
      {
        success: true,
        data: updatedUser,
        message: 'User successfully enrolled in course',
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

// DELETE unenroll a user from a course
export async function DELETE(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');

    if (!userId || !courseId) {
      return NextResponse.json(
        { success: false, error: 'Please provide both userId and courseId' },
        { status: 400 }
      );
    }

    // Find user and course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user is enrolled
    if (!user.coursesEnrolled.includes(courseId)) {
      return NextResponse.json(
        { success: false, error: 'User is not enrolled in this course' },
        { status: 400 }
      );
    }

    // Unenroll user from course
    user.coursesEnrolled = user.coursesEnrolled.filter(
      (id) => id.toString() !== courseId
    );
    await user.save();

    // Update course enrollment count
    course.currentEnrollment = Math.max(0, course.currentEnrollment - 1);
    await course.save();

    // Return updated user with populated courses
    const updatedUser = await User.findById(userId).populate(
      'coursesEnrolled',
      'title category format'
    );

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User successfully unenrolled from course',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
