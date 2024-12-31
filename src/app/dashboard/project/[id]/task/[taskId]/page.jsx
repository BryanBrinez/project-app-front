"use client";
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
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar el modo de edición

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

  const handleEditClick = () => {
    setIsEditing(true); // Activar el modo de edición
  };

  const handleSaveClick = async () => {
    try {
      const taskEdited = await axios.patch(`http://localhost:3000/api/task/${taskId}`, {
        title: task.title,
        limit_date: task.limit_date,
        status: task.status,
      });

      console.log(taskEdited)
      setIsEditing(false); // Desactivar el modo de edición después de guardar
    } catch (err) {
      console.error("Error saving task details:", err);
      setError("No se pudo guardar la tarea. Intenta nuevamente.");
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false); // Desactivar el modo de edición sin guardar
    // Restaurar los valores originales de la tarea
    setTask({ ...task });
  };

  if (error) {
    return <div className="text-red-500">{error}</div>; // Mostrar error si ocurre
  }

  if (!task || !userInfo) {
    return <div>Cargando...</div>; // Mostrar mensaje de carga mientras obtenemos la tarea y el usuario
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-6 bg-gray-100 w-screen px-2 lg:px-0 lg:w-1/2 text-black gap-5">
      {/* Detalles de la tarea */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        {isEditing ? (
          // Formulario para editar los detalles de la tarea
          <div>
            <input
              type="text"
              value={task.title || ""} // Aseguramos que no sea null
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="date"
              value={task.limit_date || ""} // Aseguramos que no sea null
              onChange={(e) => setTask({ ...task, limit_date: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <select
              value={task.status || ""} // Aseguramos que no sea null
              onChange={(e) => setTask({ ...task, status: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            >
              <option value="PENDING">Pendiente</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="COMPLETED">Completada</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={handleSaveClick}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Guardar
              </button>
              <button
                onClick={handleCancelClick}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          // Vista de solo lectura de los detalles de la tarea
          <div>
            <h2 className="text-2xl font-semibold mb-4">{task.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              <strong>Estado:</strong> {task.status}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <strong>Fecha limite:</strong> {task.limit_date}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Asignado a:</strong> {userInfo.name}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p className="text-gray-700 mb-4">{task.description}</p>
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Editar
            </button>
          </div>
        )}
      </div>

      {/* Chat de la tarea */}
      <ChatBox taskId={task.id} />
    </div>
  );
}
