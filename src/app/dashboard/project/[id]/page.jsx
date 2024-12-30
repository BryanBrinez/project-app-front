"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Task from "../../../components/project/task/Task"; // Componente Task
import CreateTaskModal from "../../../components/modals/CreateTaskModal"; // Importar el modal

export default function ProjectDetails() {
    const params = useParams();
    const { id } = params || {};

    const [project, setProject] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedRole, setSelectedRole] = useState("member"); // Estado para el rol seleccionado
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [tasks, setTasks] = useState([]); // Ahora se inicializa como un array vacío
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false); // Estado para abrir/cerrar el dropdown
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

    useEffect(() => {
        if (!id) return;

        const fetchProjectData = async () => {
            try {
                const token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("token="))
                    ?.split("=")[1];

                if (!token) {
                    setError("Token no encontrado. Por favor, inicia sesión.");
                    return;
                }

                const userResponse = await axios.get("http://localhost:3000/api/auth/verify", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const userEmail = userResponse.data.user.email;

                const response = await axios.get(`http://localhost:3000/api/projects/${id}`);
                setProject(response.data);
            } catch (err) {
                console.error("Error fetching project data:", err);
                setError("No se pudo cargar la información del proyecto. Intenta nuevamente.");
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/users");
                const userData = Array.isArray(response.data.data) ? response.data.data : [];

                setUsers(userData);
                setFilteredUsers(userData); // Inicialmente todos los usuarios están visibles
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("No se pudo cargar la lista de usuarios. Intenta nuevamente.");
            }
        };

        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/task");
                setTasks(response.data.data); // Asumiendo que el endpoint devuelve un array de tareas
            } catch (err) {
                console.error("Error fetching tasks:", err);
                setError("No se pudieron cargar las tareas. Intenta nuevamente.");
            }
        };

        fetchProjectData();
        fetchUsers();
        fetchTasks(); // Llamada para obtener las tareas
    }, [id]);

    useEffect(() => {
        setFilteredUsers(
            users.filter(
                (user) =>
                    user.name.toLowerCase().includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, users]);

    const handleAddMember = async () => {
        try {
            if (!selectedUser) {
                alert("Por favor selecciona un usuario.");
                return;
            }

            await axios.post(`http://localhost:3000/api/projects/${id}/add-member`, {
                userId: selectedUser,
                role: selectedRole, // Enviar el rol junto con el ID del usuario
            });

            alert("Miembro agregado con éxito.");
            setSelectedUser("");
            setSelectedRole("member"); // Reiniciar el rol seleccionado
            setSearch(""); // Limpiar el campo de entrada
            setIsOpen(false); // Cerrar el dropdown
        } catch (err) {
            console.error("Error adding member:", err);
            alert("No se pudo agregar el miembro. Intenta nuevamente.");
        }
    };

    const handleInputChange = (e) => {
        setSearch(e.target.value);
        setIsOpen(true); // Abrir el dropdown cuando se escribe algo
    };

    const handleSelectUser = (user) => {
        setSearch(user.name); // Mostrar el nombre del usuario en el input
        setSelectedUser(user.id); // Guardar el ID del usuario seleccionado
        setIsOpen(false); // Cerrar el dropdown
    };

    const handleBlur = () => {
        // Cerrar el dropdown cuando se pierde el foco
        setIsOpen(false);
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!id || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Cargando información del proyecto...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gray-100 w-screen bg lg:w-1/2 text-black">
            <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
            <p className=" mb-4">{project.description || "Sin descripción disponible."}</p>
            <p className="text-sm text-gray-500">
                <strong>Fecha de creación:</strong> {new Date(project.createdAt).toLocaleDateString()}
            </p>

            {/* Apartado de Tareas */}
            <div className="mt-8">

                <div className="w-full flex items-center justify-between ">
                    <h2 className="text-xl font-semibold mb-4">Tareas</h2>
                    <div className="flex-grow border-b-2 border-dotted mx-4 relative top-1/2 transform -translate-y-1/2 mt-[-10px] "></div>
                    <button
                        className="mb-4 px-4 py-2 bg-[#3f51b5] text-white rounded-lg hover:bg-[#002284]"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Crear
                    </button>
                </div>
                {/* Modal para Crear Tarea */}
                <CreateTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    projectId={id}
                    onTaskCreated={(newTask) => setTasks((prev) => [...prev, newTask])}
                />
                {/* Lista de Tareas */}
                <div className="flex flex-col gap-3">
                    {tasks.map((task) => (
                        <Task key={task.id} task={task} projectId={id} />
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Agregar Miembros</h2>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 ps-3.5">
                        <svg className="shrink-0 size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </svg>
                    </div>
                    <input
                        className="h-12 py-3 ps-10 pe-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        type="text"
                        placeholder="Escribe para buscar y seleccionar"
                        value={search}
                        onChange={handleInputChange}
                        onBlur={handleBlur} // Cerrar el dropdown al perder el foco
                    />

                    {/* Dropdown */}
                    {isOpen && filteredUsers.length > 0 && (
                        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-72 overflow-y-auto">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSelectUser(user)}
                                >
                                    <div className="flex items-center">
                                        <span>{user.name} ({user.email})</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selector de Rol */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Rol:</label>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className=" h-12 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="MIEMBRO">Miembro</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                </div>

                <button
                    onClick={handleAddMember}
                    className="h-12 w-full mt-4 px-4 py-2 bg-[#3f51b5] text-white rounded-lg hover:bg-[#002284]"
                    disabled={!selectedUser}
                >
                    Agregar
                </button>
            </div>
        </div>
    );
}
