"use client"
import React from 'react';
import { useRouter } from 'next/navigation' // Para redirigir
import Cookies from 'js-cookie'; // Para manejar las cookies

const LogoutButton = () => {
  const router = useRouter()

  const handleLogout = () => {
    // Borra el token de las cookies
    Cookies.remove('token'); // Asegúrate de que 'token' es el nombre correcto de la cookie

    // Redirige a la página de inicio
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
