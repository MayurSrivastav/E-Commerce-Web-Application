import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await dbConnect();
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await dbConnect();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
