// components/Task.js
"use client";

import Link from "next/link";

export default function Task({ task, projectId }) {
    return (
        <Link href={`${projectId}/task/${task.id}`} passHref>
            <div
                className="flex justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-[#f2f3ff]"
            >
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-600 ">{task.title}</h3>
                    <p className="mt-2 text-sm text-gray-500">Fecha limite:{task.limit_date}</p>
                    
                </div>
                <div className="ml-4">

                    <span
                        className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                            task.status === "COMPLETED"
                                ? "bg-lime-500 text-green-800"
                                : task.status === "IN_PROGRESS"
                                ? "bg-sky-600 text-yellow-800"
                                : "bg-yellow-400 text-gray-800"
                        }`}
                    >
                        {task.status}
                    </span>
                </div>
            </div>
        </Link>
    );
}
