import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Register.css";
import moment from 'moment';

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    age: "",
    dob: "",
    password: "",
    cpswd: "",
    gender: "",
    about: "",
  });

  const [genders, setGenders] = useState([]);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/genders`)
      .then((res) => setGenders(res.data))
      .catch(() => setGenders(["Male", "Female", "Other"]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validate field while typing
    if (name === "dob") {
      var age = moment().diff(moment(value), 'years');
      setUser({ ...user, age, [name]: value });
      validateField(name, value);
      validateField("dob", age);
    }
    else {
      setUser({ ...user, [name]: value });
      validateField(name, value);
    } 
  };


  const validateField = (name, value) => {
    let error = "";

    if (name === "name" && value.length < 2) error = "Enter a valid name";

    if (name === "age") {
      if (!value) error = "Age is required";
      else if (value < 0 || value > 120 || isNaN(value)) error = "Enter a valid age (0-120)";
    }

    if (name === "dob" && !value) error = "Date of Birth is required";

    if (name === "password" && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%*?&]{10,}$/.test(value)) {
      error = "Enter valid password";
    }

    if (name === "cpswd") {
      if (!value) error = "Password is required";
      else if (value !== user.password) error = "Must match with password";
    }

    if (name === "gender" && !value) error = "Select a gender";
    if (name === "about") {
      if (!value) error = "Tell me about you";
      else if (value.length > 5000) error = "Must be less than 5000 characters";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let formValid = true;

    Object.keys(user).forEach((key) => {
      validateField(key, user[key]);
      if (errors[key]) formValid = false;
    });

    if (user.password !== user.cpswd) {
      setErrors((prev) => ({ ...prev, cpswd: "Passwords do not match" }));
      formValid = false;
    }

    if (!formValid) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/`, user);
      alert("User registered successfully!");

      // Reset form
      setUser({
        name: "",
        age: "",
        dob: "",
        password: "",
        cpswd: "",
        gender: "",
        about: "",
      });
      setErrors({});
    } catch (err) {
      alert("Registration failed!");
    }
  };

  return (
    <div className="container">
      <h2>User Registration</h2>
      <form onSubmit={handleRegister}>
        <div className="input-container">
          <input type="text" name="name" placeholder="Name" value={user.name} onChange={handleChange} onBlur={handleBlur} required />
          <span className="info-icon" title="Name must contain atleast 2 characters">ℹ</span>
        </div>
        {errors.name && <span className="error">{errors.name}</span>}

        <div className="input-container">
          <input type="date" name="dob" value={user.dob} onChange={handleChange} onBlur={handleBlur} onKeyDown={(e) => e.preventDefault()}
            max={new Date().toISOString().split("T")[0]}
            min={new Date(new Date().setFullYear(new Date().getFullYear() - 120)).toISOString().split("T")[0]} required />
          <span className="info-icon" title="Select your date of birth">ℹ</span>
        </div>

        <div className="input-container">
          <input type="number" name="age" placeholder="Age" value={user.age} onChange={handleChange} onBlur={handleBlur} required />
          <span className="info-icon" title="Enter age between 0-120">ℹ</span>
        </div>
        {errors.age && <span className="error">{errors.age}</span>}

        <div className="input-container">
          <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} onBlur={handleBlur} required />
          <span className="info-icon" title="Must be 10 characters with letters, numbers, and only contain special characters of @$!%*?&">ℹ</span>
        </div>
        {errors.password && <span className="error">{errors.password}</span>}

        <div className="input-container">
          <input type="password" name="cpswd" placeholder="Confirm Password" value={user.cpswd} onChange={handleChange} onBlur={handleBlur} required />
          <span className="info-icon" title="Must match the password">ℹ</span>
        </div>
        {errors.cpswd && <span className="error">{errors.cpswd}</span>}

        <div className="input-container">
          <select name="gender" value={user.gender} onChange={handleChange} onBlur={handleBlur} required>
            <option value="">Select Gender</option>
            {genders.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {/* <span className="info-icon" title="Choose your gender">ℹ</span> */}
        </div>
        {errors.gender && <span className="error">{errors.gender}</span>}

        <div className="input-container">
          <textarea name="about" placeholder="About You Less than 5000 Characters" value={user.about} onChange={handleChange} onBlur={handleBlur} maxLength="5000"></textarea>
          <span className="info-icon" title="Write about yourself (Max 5000 characters)">ℹ</span>
        </div>
        {errors.about && <span className="error">{errors.about}</span>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
