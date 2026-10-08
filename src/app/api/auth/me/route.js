import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await dbConnect();
    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
