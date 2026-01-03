import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Course from '@/models/Course';

// GET all categories
export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find().sort({ name: 1 });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// POST create a new category
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const category = await Category.create(body);

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
