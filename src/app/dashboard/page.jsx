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

          console.log("sisa", projectsResponse.data)
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
    <div className="min-h-screen p-6  w-screen bg lg:w-1/2  text-black flex flex-col gap-10" >

      <div>
        <div className="flex items-center justify-between ">
          <h1 className="text-2xl font-bold">Hola, {user.name}</h1>


          <LogoutButton />
        </div>


        <p className="text-gray-600 mt-2">
          {projects.length === 0
            ? "No tienes ningún proyecto creado. ¿Deseas crear uno?"
            : "Estos son tus proyectos:"}
        </p>

      </div>

      <div className="flex flex-col w-full flex-grow ">

        <div className="w-full flex items-center justify-between ">
          <h2 className="text-xl font-semibold mb-4">Proyectos</h2>
          <div className="flex-grow border-b-2 border-dotted mx-4 relative top-1/2 transform -translate-y-1/2 mt-[-10px] "></div>
          <button
            onClick={() => setIsModalOpen(true)}
            className=" px-4 py-2 bg-[#3f51b5] text-white rounded-lg hover:bg-[#002284]"
          >
            Crear
          </button>
        </div>



        {/* Solo muestra la lista de proyectos si hay proyectos */}
        {projects.length > 0 && (
          <div className="flex flex-col gap-4 mt-6 w-full">
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
