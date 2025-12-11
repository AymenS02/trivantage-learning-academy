import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';

// POST enroll a user in a course
export async function POST(request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await dbConnect();

    const { userId, courseId } = await request.json();

    if (!userId || !courseId) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, error: 'Please provide both userId and courseId' },
        { status: 400 }
      );
    }

    // Find user and course
    const user = await User.findById(userId).session(session);
    const course = await Course.findById(courseId).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user is already enrolled
    if (user.coursesEnrolled.includes(courseId)) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, error: 'User is already enrolled in this course' },
        { status: 400 }
      );
    }

    // Check if course has reached max enrollment
    if (course.currentEnrollment >= course.maxEnrollment) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, error: 'Course has reached maximum enrollment' },
        { status: 400 }
      );
    }

    // Enroll user in course
    user.coursesEnrolled.push(courseId);
    await user.save({ session });

    // Update course enrollment count
    course.currentEnrollment += 1;
    await course.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

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
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE unenroll a user from a course
export async function DELETE(request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');

    if (!userId || !courseId) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, error: 'Please provide both userId and courseId' },
        { status: 400 }
      );
    }

    // Find user and course
    const user = await User.findById(userId).session(session);
    const course = await Course.findById(courseId).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (!course) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user is enrolled
    if (!user.coursesEnrolled.includes(courseId)) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, error: 'User is not enrolled in this course' },
        { status: 400 }
      );
    }

    // Unenroll user from course
    user.coursesEnrolled = user.coursesEnrolled.filter(
      (id) => id.toString() !== courseId
    );
    await user.save({ session });

    // Update course enrollment count with validation
    if (course.currentEnrollment <= 0) {
      console.error(
        `Data integrity issue: Course ${courseId} has enrollment count of ${course.currentEnrollment} but user ${userId} was enrolled`
      );
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, error: 'Data integrity issue with enrollment count' },
        { status: 500 }
      );
    }
    course.currentEnrollment -= 1;
    await course.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

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
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
