// app/api/admin/medicines/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { parseMedicine } from '@/lib/parser';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Medicine name is required' },
        { status: 400 }
      );
    }

    const parsed = parseMedicine(name.trim());

    if (!parsed.brand || !parsed.strength || !parsed.form) {
      return NextResponse.json(
        { error: 'Could not reliably parse brand, strength and form' },
        { status: 400 }
      );
    }

    const variant = parsed.variant ?? '';

    // Consistent canonical name generation
    const canonicalName = [parsed.brand, parsed.strength, parsed.form, variant]
      .filter(Boolean)
      .join(' ')
      .trim();

    // Duplicate check — both canonical and structural
    const duplicate = await prisma.medicine.findFirst({
      where: {
        OR: [
          { canonicalName },
          {
            AND: [
              { brand: parsed.brand },
              { strength: parsed.strength },
              { form: parsed.form },
              { variant },
            ],
          },
        ],
      },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          status: 'ALREADY_EXISTS',
          id: duplicate.id,
          canonicalName: duplicate.canonicalName,
        },
        { status: 409 }
      );
    }

    // Create directly — approved by default
    const medicine = await prisma.medicine.create({
      data: {
        brand: parsed.brand,
        strength: parsed.strength,
        form: parsed.form,
        variant,
        canonicalName,
        approved: true,          // ← admin action → always approved
      },
    });

    return NextResponse.json({
      status: 'CREATED',
      medicine,
    });
  } catch (err: any) {
    console.error('ADMIN_ADD_MEDICINE_ERROR', err);
    return NextResponse.json(
      { error: 'Internal error', message: err.message },
      { status: 500 }
    );
  }
}