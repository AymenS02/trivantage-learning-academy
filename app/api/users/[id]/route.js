import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET user by ID
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const user = await User.findById(params.id).populate(
      'coursesEnrolled',
      'title description category format duration price'
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// PUT update user by ID
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const body = await request.json();
    const user = await User.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).populate('coursesEnrolled', 'title category format');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE user by ID
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const user = await User.findByIdAndDelete(params.id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
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
