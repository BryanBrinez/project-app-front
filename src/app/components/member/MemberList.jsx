import React, { useState, useEffect } from "react";
import axios from "axios";

const MembersList = ({ members }) => {
    // const [members, setMembers] = useState(members);
    const [userInfo, setUserInfo] = useState({});
    const [error, setError] = useState("");



    // Fetch user information for each member
    useEffect(() => {
        const fetchUserInfo = async () => {
            for (const member of members) {
                try {
                    const response = await axios.get(
                        `http://localhost:3000/api/users/${member.userId}`
                    );
                    setUserInfo((prevUserInfo) => ({
                        ...prevUserInfo,
                        [member.userId]: response.data,
                    }));
                } catch (err) {
                    console.error(`Error fetching user info for ${member.userId}:`, err);
                }
            }
        };

        if (members.length > 0) {
            fetchUserInfo();
        }
    }, [members]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Miembros del Proyecto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {members.map((member) => (
                    <div key={member.id} className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="font-semibold text-lg">
                            {userInfo[member.userId] ? userInfo[member.userId].name : "Cargando..."}
                        </h3>
                        <p className="text-gray-500">
                            {userInfo[member.userId] ? userInfo[member.userId].email : "Cargando..."}
                        </p>
                        <p className="mt-2 text-sm">
                            <strong>Rol:</strong> {member.role}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MembersList;
