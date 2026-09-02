import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname === "/admin/login";

      // Les routes de données de l'admin vivent sous /api/admin, qui ne
      // commence pas par /admin : sans ce test, elles répondaient à tout le
      // monde et exposaient bénévoles, adhérents, dons et messages.
      if (nextUrl.pathname.startsWith("/api/admin")) {
        if (isLoggedIn) return true;
        return new Response(JSON.stringify({ error: "Non autorisé." }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (isOnAdmin && !isOnLogin && !isLoggedIn) {
        return Response.redirect(new URL("/admin/login", nextUrl.origin));
      }

      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl.origin));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
