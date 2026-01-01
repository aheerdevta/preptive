// app/api/contact/route.js
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createClient();
    const data = await request.json();
    
    const { name, email, grade, exam, message } = data;
    
    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }
    
    // Insert into Supabase
    const { data: result, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          grade: grade || null,
          exam: exam || null,
          message,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        },
      ])
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Database error. Please try again.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been submitted successfully.',
      data: result
    });
    
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}