"use client"
import React, { useState } from "react";

export default function TaskDetails() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, user: "Administrador", content: "Este es un mensaje inicial en el chat." },
    { id: 2, user: "Usuario", content: "Otro mensaje para el chat." },
  ]);

  const handleSendMessage = () => {
    if (message.trim() === "") return; // No enviar mensaje vacío
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, user: "Usuario", content: message },
    ]);
    setMessage(""); // Limpiar el campo de mensaje
  };

  const task = {
    title: "Tarea de ejemplo",
    status: "En progreso",
    userName: "Juan Pérez",
    description: "Esta es una descripción de ejemplo de la tarea.",
  };

  return (
    <div className="flex flex-col items-center  min-h-screen py-6 bg-gray-100 w-screen px-2 lg:px-0 bg lg:w-1/2 text-black  gap-5">
      {/* Detalles de la tarea */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full ">
        <h2 className="text-2xl font-semibold mb-4">{task.title}</h2>
        <p className="text-sm text-gray-500 mb-2">
          <strong>Estado:</strong> {task.status}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          <strong>Asignado a:</strong> {task.userName}
        </p>
        <p className="text-gray-700">{task.description}</p>
      </div>

      {/* Simulación de chat */}
      <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-full flex-grow">
        <h3 className="text-xl font-semibold mb-4">Chat de la tarea</h3>

        {/* Mensajes del chat */}
        <div className="h-60 overflow-y-auto border-b border-gray-200 mb-4 flex-grow">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <strong className="text-sm text-indigo-600">{msg.user}:</strong>
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
    </div>
  );
}
