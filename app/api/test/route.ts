import { NextResponse } from 'next/server'

// Simple test API without database dependency
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        API_URL: process.env.NEXT_PUBLIC_API_URL,
        DB_HOST: process.env.DB_HOST,
        DB_NAME: process.env.DB_NAME
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
