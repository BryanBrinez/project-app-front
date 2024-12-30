"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import LogoutButton from "../components/LogOutButtom";
import CreateProjectModal from "../components/modals/CreateProjectModal";
import ProjectCard from "../components/project/ProjectCard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          setError("Token no encontrado. Por favor, inicia sesión.");
          return;
        }

        // Intentar obtener los datos del usuario
        let response;
        try {
          response = await axios.get("http://localhost:3000/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user);
        } catch (err) {
          console.error("Error al verificar el token:", err);
          setError("No se pudo verificar el token. Por favor, intenta nuevamente.");
          return;
        }

        // Intentar obtener los proyectos del usuario
        let projectsResponse;
        try {
          projectsResponse = await axios.get(`http://localhost:3000/api/projects/owner/${response.data.user.email}`);

          console.log("sisa",projectsResponse.data)
          if (projectsResponse.data.length === 0) {
            setError("No tienes proyectos creados. ¿Quieres crear uno?");
          } else {
            setProjects(projectsResponse.data);
          }
        } catch (err) {
          console.error("Error al obtener proyectos:", err);
          setError("No se pudo cargar la información de proyectos. Por favor, intenta más tarde.");
        }
      } catch (err) {
        console.error("Error general:", err);
        setError("Hubo un error al cargar la información. Por favor, intenta nuevamente.");
      }
    };

    fetchUserData();
  }, []);

  const handleSuccess = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
    setIsModalOpen(false);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div>
        <h1 className="text-2xl font-bold">Hola, {user.name}</h1>
        <p className="text-gray-600 mt-2">
          {projects.length === 0
            ? "No tienes ningún proyecto creado. ¿Deseas crear uno?"
            : "Estos son tus proyectos:"}
        </p>
      </div>

      {/* Solo muestra la lista de proyectos si hay proyectos */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Si no hay proyectos, mostrar mensaje con opción de crear */}
      {projects.length === 0 && (
        <div className="mt-6 text-gray-600">
          <p>No tienes proyectos. ¿Quieres crear uno?</p>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Crear Proyecto
        </button>
      </div>

      <div>
        <LogoutButton />
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        ownerId={user.email}
        owner={user.name}
      />
    </div>
  );
}
