import { NextResponse } from "next/server";
import axios from "axios";

const rutasPublicas = ["/", "/Signup"]; // Rutas públicas que no requieren autenticación

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token"); // Obtener el token de las cookies

  // Permitir acceso a rutas públicas
  if (rutasPublicas.includes(pathname)) {
    return NextResponse.next();
  }

  console.log("el token",token)

  // Verificar si el token existe
  if (!token) {
    console.log("Token no encontrado, redirigiendo...");
    return NextResponse.redirect(new URL("/", req.url)); // Redirigir al login si no hay token
  }


  // Verificar el token con la API
  try {
    const response = await axios.get("http://localhost:3000/api/auth/verify", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    // Verificar si el usuario tiene acceso a la ruta
    const user = response.data.user;

    // Puedes agregar lógica adicional aquí, por ejemplo:
    // - Validar que el usuario sea miembro de un proyecto específico.
    // - Validar roles o permisos.

    return NextResponse.next();
  } catch (err) {
    console.error("Error al verificar el token:", err.message);
    return NextResponse.redirect(new URL("/", req.url)); // Redirigir al login si el token no es válido
  }
}

export const config = {
  matcher: [
    // Protege todas las rutas excepto las públicas
    "/((?!_next|[^?]*\\.(?:html?|css|js|json|jpeg|jpg|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/dashboard/:path*", // Protege las rutas del dashboard
  ],
};
