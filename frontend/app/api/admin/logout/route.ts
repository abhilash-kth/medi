// app/api/admin/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create JSON response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // “Delete” the auth_token cookie by expiring it immediately
    response.cookies.set({
      name: 'auth_token',
      value: '',           // Clear value
      path: '/',           // Same path as when set
      httpOnly: true,      // Same as login cookie
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,           // Expire immediately → effectively deletes
    });

    return response;
  } catch (err: any) {
    console.error('Logout error:', err);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
