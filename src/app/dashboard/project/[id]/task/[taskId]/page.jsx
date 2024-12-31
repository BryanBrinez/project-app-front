// app/TaskDetails.js

"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatBox from "../../../../../components/chat/Chat"; // Importar el nuevo componente
import { useParams } from "next/navigation";

export default function TaskDetails() {
  const params = useParams();
  const { taskId } = params || {};
  const [task, setTask] = useState(null); // Estado para almacenar los detalles de la tarea
  const [userInfo, setUserInfo] = useState(null); // Estado para almacenar la información del usuario
  const [error, setError] = useState(null); // Estado para manejar errores

  // useEffect para hacer la consulta de los detalles de la tarea
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/task/${taskId}`);
        setTask(response.data); // Almacenar los detalles de la tarea en el estado
        
        // Obtener la información del usuario después de obtener la tarea
        const userResponse = await axios.get(`http://localhost:3000/api/users/${response.data.userId}`);
        setUserInfo(userResponse.data); // Almacenar los detalles del usuario
      } catch (err) {
        console.error("Error fetching task details:", err);
        setError("No se pudieron cargar los detalles de la tarea. Intenta nuevamente.");
      }
    };

    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]); // Ejecutar la consulta cada vez que el taskId cambie

  if (error) {
    return <div className="text-red-500">{error}</div>; // Mostrar error si ocurre
  }

  if (!task || !userInfo) {
    return <div>Cargando...</div>; // Mostrar mensaje de carga mientras obtenemos la tarea y el usuario
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-6 bg-gray-100 w-screen px-2 lg:px-0 bg lg:w-1/2 text-black gap-5">
      {/* Detalles de la tarea */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">{task.title}</h2>
        <p className="text-sm text-gray-500 mb-2">
          <strong>Estado:</strong> {task.status}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          <strong>Asignado a:</strong> {userInfo.name} {/* Mostrar el nombre del usuario */}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          <strong>Email:</strong> {userInfo.email} {/* Mostrar el correo del usuario */}
        </p>
        <p className="text-gray-700">{task.description}</p>
      </div>

      {/* Chat de la tarea */}
      <ChatBox taskId={task.id} />
    </div>
  );
}
