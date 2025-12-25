import { useState } from "react";
import api from "./api";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await api.post("/auth/register", { email, password });
      alert("Registered! Now login.");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Register</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <br /><br />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={register}>Register</button>
    </div>
  );
}

export default Register;
