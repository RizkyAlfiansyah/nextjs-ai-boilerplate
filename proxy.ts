import acceptLanguage from "accept-language";
import { type NextRequest, NextResponse } from "next/server";
import { cookieName, fallbackLng, languages } from "./i18n/settings";

acceptLanguage.languages(languages);

export const config = {
  // matcher: '/:lng*'
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};

export default function proxy(req: NextRequest) {
  let lng: string | undefined | null;
  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  }
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  }
  if (!lng) {
    lng = fallbackLng;
  }

  // Rewrite if lng in path is not present
  if (
    !(
      languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) ||
      req.nextUrl.pathname.startsWith("/_next")
    )
  ) {
    return NextResponse.rewrite(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    );
  }

  return NextResponse.next();
}
