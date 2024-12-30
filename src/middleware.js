import { NextResponse } from "next/server";

const rutasPublicas = ["/", "/Signup", ]; // Rutas que no requieren autenticación

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token"); // Obtener el token de las cookies

    // Permitir acceso a rutas públicas
    if (rutasPublicas.includes(pathname)) {
        return NextResponse.next();
    }

    // Verificar si el token existe
    if (!token) {
        console.log("Token no encontrado, redirigiendo...");
        return NextResponse.redirect(new URL("/", req.url)); // Redirigir si no hay token
    }

    // Si el token existe, continuar con la solicitud
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Protege todas las rutas excepto las públicas
        "/((?!_next|[^?]*\\.(?:html?|css|js|json|jpeg|jpg|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/dashboard/:path*", // Protege las rutas del dashboard
        "/api/:path*", // Protege todas las rutas API
    ],
};
