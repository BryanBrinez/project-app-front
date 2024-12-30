"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000"); // Asegúrate de que la URL corresponda a tu servidor

const ChatBox = ({ taskId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Función asincrónica para obtener el usuario
    const fetchUserData = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        setError("Token no encontrado. Por favor, inicia sesión.");
        return;
      }

      // Intentar obtener los datos del usuario
      try {
        const response = await axios.get("http://localhost:3000/api/auth/verify", {
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
    };

    fetchUserData();

    // Unirse a la sala de la tarea cuando el componente se monte
    socket.emit("joinTask", taskId);

    // Escuchar los mensajes previos de la sala de la tarea
    socket.on("messageHistory", (messages) => {
      setMessages(messages);  // Establecer los mensajes previos
    });

    // Escuchar los mensajes nuevos de la sala de la tarea
    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      socket.off("newMessage"); // Dejar de escuchar los mensajes
      socket.off("messageHistory"); // Dejar de escuchar el historial de mensajes
    };
  }, [taskId]); // Dependencia de taskId

  const handleSendMessage = () => {
    if (message.trim() === "" || !user) return; // No enviar mensaje vacío ni sin usuario

    const payload = {
      taskId: taskId,
      userId: user.email, // Usamos el userId obtenido del backend
      content: message,
    };

    // Enviar el mensaje al servidor a través de WebSocket
    socket.emit("sendMessage", payload);

    // Limpiar el campo de mensaje
    setMessage("");
  };

  return (
    <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg flex-grow w-full">
      <h3 className="text-xl font-semibold mb-4">Chat de la tarea {taskId}</h3>

      {/* Mensajes del chat */}
      <div className="h-60 overflow-y-auto border-b border-gray-200 mb-4 flex-grow">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {/* Mostrar el nombre del usuario en lugar del userId */}
            <strong className="text-sm text-indigo-600">{msg.userId}:</strong>
            <p className="text-sm text-gray-700">{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Campo para enviar mensaje */}
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Escribe tu mensaje..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-[#3f51b5] text-white rounded-lg hover:bg-[#002284]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
