import React, { useState } from "react";
import axios from "axios";
import "./ValidUsers.css";

const ValidUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUsers, setShowUsers] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/users/`);
      setUsers(response.data);
      setShowUsers(true);
    } catch (error) {
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (id) => {
    const userToEdit = users.find((user) => user._id === id);
    if (!userToEdit) return;

    const editedName = prompt("Enter the new name:", userToEdit.name);
    const editedAbout = prompt("Enter the new about:", userToEdit.about);

    if (editedName && editedAbout) {
      try {
        await axios.put(`${API_URL}/api/users/${id}`, {
          name: editedName,
          about: editedAbout,
        });

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, name: editedName, about: editedAbout } : user
          )
        );
      } catch (error) {
        setError("Failed to update user. Please try again.");
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/api/users/${id}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      } catch (error) {
        setError("Failed to delete user. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="view">
        <button onClick={fetchUsers} disabled={loading}>
          {loading ? "Loading..." : "View Users"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {showUsers && users.length > 0 && (
        <div className="table-container">
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>Username</th>
                <th>About</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.about}</td>
                  <td>
                    <button onClick={() => handleEditUser(user._id)}>Edit</button>
                    <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ValidUsers;
