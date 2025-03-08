import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Register.css";


const Register = () => {
  const [user, setUser] = useState({
    name: "",
    age: "",
    dob: "",
    password: "",
    gender: "",
    about: "",
  });

  const [genders, setGenders] = useState([]);

  useEffect(() => {
    // Fetch gender options from the correct API endpoint
    axios.get("http://localhost:5000/api/users/genders")
      .then((res) => setGenders(res.data))
      .catch((err) => {
        console.error("Error fetching genders:", err);
        setGenders(["Male", "Female", "Other"]); // Fallback options
      });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (user.name.length < 2) {
      alert("Name must be at least 2 characters");
      return false;
    }
    if (user.age < 0 || user.age > 120 || isNaN(user.age)) {
      alert("Age must be between 0 and 120");
      return false;
    }
    if (!user.dob) {
      alert("Date of Birth is required");
      return false;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(user.password)) {
      alert("Password must be at least 10 characters, alphanumeric, and contain a special character");
      return false;
    }
    
    if (user.about.length > 5000) {
      alert("About section cannot exceed 5000 characters");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/users", user);
      console.log("User registered successfully", res.data);
      alert("User registered successfully!");
    } catch (err) {
      console.error("Error registering user:", err.response?.data || err);
      alert("Registration failed!");
    }
  };

  return (
    <div className="container">
      <h2>User Registration</h2>
      <form onSubmit={handleRegister}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
        <input type="date" name="dob" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          {genders.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <textarea name="about" placeholder="About You" onChange={handleChange} maxLength="5000"></textarea>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
