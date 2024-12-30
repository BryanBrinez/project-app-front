import React, { useState } from "react";
import axios from "axios";

export default function CreateTaskModal({ isOpen, onClose, projectId, onTaskCreated }) {
  const [formState, setFormState] = useState({
    title: "",
    status: "PENDING",
    userId: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError("");

    const { title, status, userId } = formState;

    if (!title || !userId) {
      setError("El título y el usuario son obligatorios.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/task", {
        title,
        status,
        userId,
        projectId,
      });

      onTaskCreated(response.data);
      setFormState({ title: "", status: "Pending", userId: "" });
      onClose();
    } catch (err) {
      console.error("Error creating task:", err);
      setError("No se pudo crear la tarea. Intenta nuevamente.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear Tarea</h2>

        {error && (
          <div className="text-red-500 text-sm mb-4 p-2 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateTask}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              name="title"
              value={formState.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="status"
              value={formState.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            >
              <option value="PENDING">Pendiente</option>
              <option value="In Progress">En progreso</option>
              <option value="Completed">Completada</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID de Usuario
            </label>
            <input
              type="text"
              name="userId"
              value={formState.userId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Crear Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
