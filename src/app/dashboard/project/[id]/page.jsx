"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Task from "../../../components/project/task/Task";
import CreateTaskModal from "../../../components/modals/CreateTaskModal";
import MembersList from "@/app/components/member/MemberList";

export default function ProjectDetails() {
    const params = useParams();
    const { id } = params || {};

    const [project, setProject] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [taskSearch, setTaskSearch] = useState(""); // Estado para la búsqueda de tareas
    const [filteredTasks, setFilteredTasks] = useState([]); // Tareas filtradas
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedRole, setSelectedRole] = useState("MIEMBRO");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [members, setMembers] = useState([]);

    const [selectedStatus, setSelectedStatus] = useState(""); // Filtro por estado
    const [selectedDate, setSelectedDate] = useState(""); // Filtro por fecha límite
    const [selectedAssigned, setSelectedAssigned] = useState(""); // Filtro por asignado

    const fetchMembers = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/members/project/${id}`
            );
            setMembers(response.data || []);
        } catch (err) {
            console.error("Error fetching members:", err);
            setError("No se pudieron cargar los miembros del proyecto. Intenta nuevamente.");
        }
    };

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

                const response = await axios.get(`http://localhost:3000/api/projects/${id}`);
                setProject(response.data);
            } catch (err) {
                console.error("Error fetching project data:", err);
                setError("No se pudo cargar la información del proyecto. Intenta nuevamente.");
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/members/project/${id}`);
                const userData = Array.isArray(response.data) ? response.data : [];

                // Obtener detalles de cada usuario
                const usersWithDetails = await Promise.all(
                    userData.map(async (member) => {
                        try {
                            const userResponse = await axios.get(`http://localhost:3000/api/users/${member.userId}`);
                            return { ...member, userDetails: userResponse.data };
                        } catch (err) {
                            console.error(`Error fetching user info for ${member.userId}:`, err);
                            return { ...member, userDetails: null }; // Si ocurre un error, devolvemos el miembro sin detalles
                        }
                    })
                );
                setUsers(usersWithDetails); // Establecemos los usuarios con la información adicional
                setFilteredUsers(usersWithDetails);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("No se pudo cargar la lista de usuarios. Intenta nuevamente.");
            }
        };

        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/task/project/${id}`);
                setTasks(response.data || []);
                setFilteredTasks(response.data || []); // Inicialmente, todas las tareas están visibles
            } catch (err) {
                console.error("Error fetching tasks:", err);
                setError("No se pudieron cargar las tareas. Intenta nuevamente.");
            }
        };

        fetchProjectData();
        fetchUsers();
        fetchTasks();
        fetchMembers();
    }, [id]);

    useEffect(() => {
        // Filtrar usuarios
        setFilteredUsers(
            users.filter(
                (user) =>
                    user.userDetails?.name.toLowerCase().includes(search.toLowerCase()) ||
                    user.userDetails?.email.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, users]);

    useEffect(() => {
        // Filtrar tareas por nombre, estado, fecha y asignado
        setFilteredTasks(
            tasks.filter((task) => {


                const dueDate = task.limit_date ? task.limit_date.slice(0, 10) : ''; // Validar que dueDate no sea undefined

                return (
                    (task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
                        task.status.toLowerCase().includes(taskSearch.toLowerCase())) &&
                    (selectedStatus ? task.status === selectedStatus : true) &&
                    (selectedDate ? dueDate === selectedDate : true) &&  // Comparar solo la fecha (YYYY-MM-DD)
                    (selectedAssigned ? task.userId === selectedAssigned : true)
                );
            })
        );
    }, [taskSearch, tasks, selectedStatus, selectedDate, selectedAssigned]);
    const handleAddMember = async () => {
        try {
            if (!selectedUser) {
                alert("Por favor selecciona un usuario.");
                return;
            }

            await axios.post("http://localhost:3000/api/members", {
                userId: selectedUser,
                projectsId: id,
                role: selectedRole,
            });
            fetchMembers();
            setSelectedUser("");
            setSelectedRole("MIEMBRO");
            setSearch("");
            setIsOpen(false);
        } catch (err) {
            console.error("Error adding member:", err);
        }
    };

    const handleInputChange = (e) => {
        setSearch(e.target.value);
        setIsOpen(true);
    };

    const handleSelectUser = (user) => {
        setSearch(user.userDetails.name);
        setSelectedUser(user.id);
        setIsOpen(false);
    };

    const handleBlur = () => {
        setTimeout(() => setIsOpen(false), 150); // Espera breve para permitir selección en dropdown
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gray-100 w-screen lg:w-1/2 text-black">
            <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
            <p className="mb-4">{project.description || "Sin descripción disponible."}</p>
            <p className="text-sm text-gray-500">
                <strong>Fecha de creación:</strong> {new Date(project.createdAt).toLocaleDateString()}
            </p>

            <div className="mt-8">
                <div className="w-full flex items-center justify-between">
                    <h2 className="text-xl font-semibold mb-4">Tareas</h2>
                    <button
                        className="mb-4 px-4 py-2 bg-[#3f51b5] text-white rounded-lg hover:bg-[#002284]"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Crear
                    </button>
                </div>

                {/* Filtros */}
                <div className="flex space-x-4 mb-4">
                    <input
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg text-sm"
                        type="text"
                        placeholder="Buscar tareas por nombre o estado"
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
                    />
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="h-12 px-4 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="">Estado</option>
                        <option value="IN_PROGRESS">En Progreso</option>
                        <option value="COMPLETED">Completado</option>
                        <option value="PENDING">Pendiente</option>
                    </select>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="h-12 px-4 border border-gray-300 rounded-lg text-sm"
                    />
                    <select
                        value={selectedAssigned}
                        onChange={(e) => setSelectedAssigned(e.target.value)}
                        className="h-12 px-4 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="">Asignado a</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.userDetails.id}>
                                {user.userDetails?.name}
                            </option>
                        ))}
                    </select>
                </div>

                <CreateTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    projectId={id}
                    onTaskCreated={(newTask) => setTasks((prev) => [...prev, newTask])}
                />

                <div className="flex flex-col gap-3">
                    {filteredTasks.map((task) => (
                        <Task key={task.id} task={task} projectId={id} />
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Agregar Miembros</h2>
                <div className="relative">
                    <input
                        className="h-12 py-3 ps-10 pe-4 block w-full border-gray-200 rounded-lg text-sm"
                        type="text"
                        placeholder="Escribe para buscar y seleccionar"
                        value={search}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                    {isOpen && filteredUsers.length > 0 && (
                        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-72 overflow-y-auto">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSelectUser(user)}
                                >
                                    <span>{user.userDetails?.name} ({user.userDetails?.email})</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Rol:</label>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="h-12 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md"
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

                <MembersList members={members} />
            </div>
        </div>
    );
}
