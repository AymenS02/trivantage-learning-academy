import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import User from '@/models/User';
import Course from '@/models/Course';

// GET single enrollment request
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const enrollment = await Enrollment.findById(id)
      .populate('selectedCourse', 'title category price duration format')
      .populate('userId', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName');

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// PUT update enrollment request (mainly for admin to accept/reject)
export async function PUT(request, { params }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const enrollment = await Enrollment.findById(id).session(session);

    if (!enrollment) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, error: 'Enrollment request not found' },
        { status: 404 }
      );
    }

    // If accepting an enrollment, enroll the user in the course
    if (body.status === 'accepted' && enrollment.status !== 'accepted') {
      const course = await Course.findById(enrollment.selectedCourse).session(session);
      
      if (!course) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
          { success: false, error: 'Course not found' },
          { status: 404 }
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

      // If user exists in system, add course to their enrolled courses
      if (enrollment.userId) {
        const user = await User.findById(enrollment.userId).session(session);
        if (user && !user.coursesEnrolled.includes(enrollment.selectedCourse)) {
          user.coursesEnrolled.push(enrollment.selectedCourse);
          await user.save({ session });
        }
      }

      // Update course enrollment count
      course.currentEnrollment += 1;
      await course.save({ session });
    }

    // If rejecting a previously accepted enrollment, unenroll the user
    if (body.status === 'rejected' && enrollment.status === 'accepted') {
      const course = await Course.findById(enrollment.selectedCourse).session(session);
      
      if (course && course.currentEnrollment > 0) {
        course.currentEnrollment -= 1;
        await course.save({ session });
      }

      // Remove course from user's enrolled courses if user exists
      if (enrollment.userId) {
        const user = await User.findById(enrollment.userId).session(session);
        if (user) {
          user.coursesEnrolled = user.coursesEnrolled.filter(
            (courseId) => courseId.toString() !== enrollment.selectedCourse.toString()
          );
          await user.save({ session });
        }
      }
    }

    // Update enrollment
    Object.assign(enrollment, body);
    await enrollment.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Return updated enrollment
    const updatedEnrollment = await Enrollment.findById(id)
      .populate('selectedCourse', 'title category price duration format')
      .populate('userId', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName');

    return NextResponse.json({
      success: true,
      data: updatedEnrollment,
      message: 'Enrollment request updated successfully',
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

// DELETE enrollment request
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const enrollment = await Enrollment.findByIdAndDelete(id);

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: enrollment,
      message: 'Enrollment request deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
