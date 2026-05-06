import { createClient } from '@supabase/supabase-client';
import { NextResponse } from 'next/server';

export async function GET() {
  // Estos valores los sacas de Supabase -> Project Settings -> API
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('CreationTime', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || []
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
