import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Обновляем куки в объекте запроса, чтобы getUser() и другие вызовы ниже
          // в рамках этого же proxy видели актуальные токены.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          // Создаем новый ответ, так как мы изменили куки запроса
          supabaseResponse = NextResponse.next({
            request,
          });

          // Прокидываем измененные куки в итоговый ответ браузеру
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() освежает сессию, если токен истек
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Если юзер уже залогинен, перенаправляем его с авторизационных экранов (Route Guard)
  if (
    user &&
    (request.nextUrl.pathname.startsWith('/sign-in') ||
      request.nextUrl.pathname.startsWith('/sign-up'))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/sign-in', '/sign-up'],
};
