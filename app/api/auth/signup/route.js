import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// POST create a new user (signup)
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { firstName, lastName, email, password, phone } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user (password will be stored as-is for now)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: 'user', // Default role
    });

    // Return user without password
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    };

    return NextResponse.json(
      {
        success: true,
        data: userResponse,
        message: 'User created successfully',
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
