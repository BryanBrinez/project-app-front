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
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Detalles de la tarea */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
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
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Chat de la tarea</h3>

        {/* Mensajes del chat */}
        <div className="h-60 overflow-y-auto border-b border-gray-200 mb-4">
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
            className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
