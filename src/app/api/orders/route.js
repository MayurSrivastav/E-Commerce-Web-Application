import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    let orders;
    if (payload.role === 'admin') {
      orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user: payload.userId }).sort({ createdAt: -1 });
    }
    
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { items, totalAmount } = await request.json();

    const order = await Order.create({
      user: payload.userId,
      items,
      totalAmount
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
