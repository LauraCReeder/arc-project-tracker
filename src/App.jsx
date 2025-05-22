import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else onAuth(data.user);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function Register({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else onAuth(data.user);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Register</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

function Dashboard({ user }) {
  return (
    <div style={{ padding: 40 }}>
      <h2>Welcome, {user.email}</h2>
      <p>Your projects will appear here.</p>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        navigate("/dashboard");
      }
    });
  }, []);

  if (user) {
    return <Routes><Route path="/dashboard" element={<Dashboard user={user} />} /></Routes>;
  }

  return (
    <Routes>
      <Route path="/" element={<Login onAuth={setUser} />} />
      <Route path="/register" element={<Register onAuth={setUser} />} />
    </Routes>
  );
}

export default App;