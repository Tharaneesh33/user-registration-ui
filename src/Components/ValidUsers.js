import axios from "axios";
import React, { useState } from "react";
import "./ValidUsers.css";
import Register from "./Register";

const ValidUsers = (props) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [userForEdit, setUserForEdit] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/users/`);
      setUsers(response.data);
      props.setShowUsers(true);
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
    setEditUser(true);
    setShowUsers(false);
    setUserForEdit(userToEdit);
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
      {
        !editUser && (
          <div className="view">
            <button onClick={fetchUsers} disabled={loading}>
              {loading ? "Loading..." : "View Users"}
            </button>
          </div>)
      }

      {error && <p className="error">{error}</p>}

      {showUsers && users.length > 0 && !editUser && (
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

      {
        editUser && (
          <Register user={userForEdit} setShowUsers={props.setShowUsers}
          setEditUser={setEditUser}/>
        )
      }
    </div>
  );
};

export default ValidUsers;
