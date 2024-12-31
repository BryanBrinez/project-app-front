import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CreateTaskModal({ isOpen, onClose, projectId, onTaskCreated }) {
  const [formState, setFormState] = useState({
    title: "",
    status: "PENDING",
    userId: "",
    limit_date: "",
  });
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]); // Aquí almacenaremos los usuarios obtenidos
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga

  useEffect(() => {
    // Función para obtener los miembros del proyecto
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/members/project/${projectId}`);
        const members = response.data;

        // Ahora, obtenemos más detalles de cada usuario
        const usersWithDetails = await Promise.all(
          members.map(async (member) => {
            try {
              const userResponse = await axios.get(`http://localhost:3000/api/users/${member.userId}`);
              return { ...member, userDetails: userResponse.data };
            } catch (err) {
              console.error(`Error fetching user info for ${member.userId}:`, err);
              return { ...member, userDetails: null }; // Si ocurre un error, devolvemos el miembro sin detalles
            }
          })
        );
        console.log("los usersss",usersWithDetails)
        setUsers(usersWithDetails); // Establecemos los usuarios con la información adicional
        setLoading(false); // Ya terminamos de cargar
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("No se pudieron cargar los usuarios.");
        setLoading(false);
      }
    };

    if (projectId) {
      fetchUsers();
    }
  }, [projectId]);

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

    const { title, status, userId, limit_date } = formState;

    if (!title || !userId) {
      setError("El título y el usuario son obligatorios.");
      return;
    }

    try {
      const formattedLimitDate = limit_date ? new Date(limit_date).toISOString() : null;

      const response = await axios.post("http://localhost:3000/api/task", {
        title,
        status,
        userId,
        projectId,
        limit_date: formattedLimitDate,
      });

      onTaskCreated(response.data);
      setFormState({ title: "", status: "PENDING", userId: "", limit_date: "" });
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
              <option value="IN_PROGRESS">En progreso</option>
              <option value="COMPLETED">Completada</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            {loading ? (
              <p>Cargando usuarios...</p> // Mensaje mientras carga
            ) : (
              <select
                name="userId"
                value={formState.userId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              >
                <option value="">Selecciona un usuario</option>
                {users.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.userDetails ? `${user.userDetails.name} (${user.userDetails.email})` : `Usuario ${user.userDetails.name}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Límite
            </label>
            <input
              type="date"
              name="limit_date"
              value={formState.limit_date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
