
import './App.css';
import React, { useState } from "react";
import Register from "./Components/Register";
import ValidUsers from "./Components/ValidUsers";

function App() {
  const [showUsers, setShowUsers] = useState(false);
  return (
    <div>
      {(showUsers)? null : <Register setShowUsers={setShowUsers}/>}
      <ValidUsers setShowUsers={setShowUsers}/>
    </div>
  );
  
  
}

export default App;

