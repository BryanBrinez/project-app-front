"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ProjectCard({ project }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/project/${project.id}`); // Redirige a la página del proyecto
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white shadow-lg p-4 rounded-lg hover:shadow-xl transition-shadow"
    >
      <h3 className="text-lg font-bold">{project.name}</h3>
      <p className="text-gray-600 mt-1">{project.description || "Sin descripción"}</p>
      <p className="text-sm text-gray-400 mt-2">Propietario: {project.owner}</p>
    </div>
  );
}
