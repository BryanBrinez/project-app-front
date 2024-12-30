// components/Task.js
"use client";

import Link from "next/link";

export default function Task({ task, projectId }) {
    return (
        <Link href={`${projectId}/task/${task.id}`} passHref>
            <div
                className="flex justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
            >
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    
                </div>
                <div className="ml-4">
                    <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            task.status === "Completada"
                                ? "bg-green-100 text-green-800"
                                : task.status === "En progreso"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                    >
                        {task.status}
                    </span>
                </div>
            </div>
        </Link>
    );
}
