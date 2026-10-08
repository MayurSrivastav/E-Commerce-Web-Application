import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    
    const filter = query ? { name: { $regex: query, $options: 'i' } } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Basic Admin Check
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await dbConnect();
    const body = await request.json();
    const product = await Product.create(body);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
