import React, { useState, useEffect } from "react";
import { firestoreKey } from "../firebase/FirebaseKey";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import Footer from "../comp/wasd/Footer";
import Navbar from "../comp/wasd/Navbar";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [status, setStatus] = useState("");

    // Fetch users from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(firestoreKey, "userCollectionOfSave");
                const usersSnapshot = await getDocs(usersCollection);

                const usersList = usersSnapshot.docs.map((doc) => ({
                    id: doc.id, // This is the user's UID
                    ...doc.data(),
                }));

                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
                setStatus("Error fetching users.");
            }
        };

        fetchUsers();
    }, []);

    // Ban user
    const handleBanUser = async () => {
        if (!selectedUserId) {
            setStatus("Please select a user to ban.");
            return;
        }

        try {
            const userDoc = doc(firestoreKey, "userCollectionOfSave", selectedUserId);

            await updateDoc(userDoc, { isBanned: true });

            setStatus(`User ${selectedUserId} has been banned successfully.`);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === selectedUserId ? { ...user, isBanned: true } : user
                )
            );
            setSelectedUserId("");
        } catch (error) {
            console.error("Error banning user:", error);
            setStatus(`Error banning user: ${error.message}`);
        }
    };

    // Unban user
    const handleUnbanUser = async () => {
        if (!selectedUserId) {
            setStatus("Please select a user to unban.");
            return;
        }

        try {
            const userDoc = doc(firestoreKey, "userCollectionOfSave", selectedUserId);

            await updateDoc(userDoc, { isBanned: false });

            setStatus(`User ${selectedUserId} has been unbanned successfully.`);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === selectedUserId ? { ...user, isBanned: false } : user
                )
            );
            setSelectedUserId("");
        } catch (error) {
            console.error("Error unbanning user:", error);
            setStatus(`Error unbanning user: ${error.message}`);
        }
    };

    return (
        <div className="h-screen w-full p-2 flex flex-col justify-between">
            <Navbar />
            <div className="flex items-center justify-center flex-col">
                <div className="flex flex-col">
                    <div className="flex items-center justify-center flex-col">
                        <h1>Admin Page</h1>
                        <h2>User List</h2>
                    </div>

                    <ul>
                        {users.map((user) => (
                            <li key={user.id} style={{ marginBottom: "10px" }}>
                                <strong>{user.name || "Unnamed User"}</strong> (UID: {user.Uid || "No UID"}){" "}
                                {user.isBanned ? (
                                    <span style={{ color: "red" }}>Banned</span>
                                ) : (
                                    <span style={{ color: "green" }}>Active</span>
                                )}
                                <button
                                    onClick={() => setSelectedUserId(user.id)}
                                    style={{ marginLeft: "10px" }}
                                    className="py-1 px-2 bg-slate-400 rounded-sm"
                                >
                                    {user.isBanned ? "Unban User" : "Ban User"}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <button
                            onClick={handleBanUser}
                            style={{ marginTop: "20px", marginRight: "10px" }}
                            disabled={!selectedUserId}
                            className="py-2 px-4 bg-slate-400 rounded-sm"
                        >
                            Confirm Ban
                        </button>
                        <button
                            onClick={handleUnbanUser}
                            style={{ marginTop: "20px" }}
                            disabled={!selectedUserId}
                            className="py-2 px-4 bg-slate-400 rounded-sm"
                        >
                            Confirm Unban
                        </button>
                    </div>


                    <p
                        style={{
                            marginTop: "20px",
                            color: status.startsWith("Error") ? "red" : "green",
                        }}
                    >
                        {status}
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminPage;
