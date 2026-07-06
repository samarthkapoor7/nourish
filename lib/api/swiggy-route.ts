import { NextResponse } from 'next/server';
import { SwiggyReauthRequiredError, SwiggyToolError } from '@/lib/swiggy/errors';

export function handleSwiggyRouteError(error: unknown) {
  if (error instanceof SwiggyReauthRequiredError) {
    return NextResponse.json(
      { error: 'reauth_required', message: error.message },
      { status: 401 },
    );
  }

  if (error instanceof SwiggyToolError) {
    return NextResponse.json(
      { error: 'swiggy_tool_error', message: error.message },
      { status: error.status && error.status >= 400 ? error.status : 502 },
    );
  }

  return NextResponse.json(
    {
      error: 'internal_error',
      message: error instanceof Error ? error.message : 'Something went wrong.',
    },
    { status: 500 },
  );
}
