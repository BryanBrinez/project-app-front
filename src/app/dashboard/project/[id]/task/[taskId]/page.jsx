// app/TaskDetails.js

import React from "react";
import ChatBox from "../../../../../components/chat/Chat"; // Importar el nuevo componente

export default function TaskDetails() {
  const task = {
    title: "Tarea de ejemplo",
    status: "En progreso",
    userName: "Juan Pérez",
    description: "Esta es una descripción de ejemplo de la tarea.",
    id: "task-id-123", // ID único para la tarea
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-6 bg-gray-100 w-screen px-2 lg:px-0 bg lg:w-1/2 text-black gap-5">
      {/* Detalles de la tarea */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">{task.title}</h2>
        <p className="text-sm text-gray-500 mb-2">
          <strong>Estado:</strong> {task.status}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          <strong>Asignado a:</strong> {task.userName}
        </p>
        <p className="text-gray-700">{task.description}</p>
      </div>

      {/* Chat de la tarea */}
      <ChatBox taskId={task.id} />
    </div>
  );
}
