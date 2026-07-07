import { NextResponse } from 'next/server';
import { runNourishPlanningCycle } from '@/lib/engine/orchestrator';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') ?? undefined;
    const vegOnly = searchParams.get('vegOnly') === 'true';

    const result = await runNourishPlanningCycle({
      userId: user?.id,
      query,
      vegOnly,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'agent_run_failed',
        message: error instanceof Error ? error.message : 'Nourish agent failed to run',
      },
      { status: 500 },
    );
  }
}
