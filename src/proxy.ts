import { createClient } from '@/shared/api/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

const proxy = async (request: NextRequest) => {
  const response = NextResponse.next({
    headers: request.headers,
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
};

export const config = {
  matcher: ['/sign-in', '/sign-up'],
};

export default proxy;
