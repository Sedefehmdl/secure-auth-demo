import { useState } from "react";
import "./App.css";

const USERS_KEY = "auth_demo_users";
const SESSION_KEY = "auth_demo_session";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
}

function App() {
  const [mode, setMode] = useState("secure");
  const [view, setView] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  const isSecure = mode === "secure";

  function reset() {
    setUsername("");
    setPassword("");
    setMessage(null);
    setAttempts(0);
    setLocked(false);
    setLoggedInUser(null);
  }

  function handleRegister() {
    const users = getUsers();

    if (isSecure) {
      if (username.length < 3) return setMessage({ type: "error", text: "Username must be at least 3 characters." });
      if (password.length < 8) return setMessage({ type: "error", text: "Password must be at least 8 characters." });
      if (!/[A-Z]/.test(password)) return setMessage({ type: "error", text: "Password must contain an uppercase letter." });
      if (!/[0-9]/.test(password)) return setMessage({ type: "error", text: "Password must contain a number." });
      if (users[username]) return setMessage({ type: "error", text: "Registration failed." }); // generic — no user enumeration
      const fakeHash = `$2b$10$${btoa(password + "salt").substring(0, 40)}`;
      users[username] = { passwordHash: fakeHash };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      setMessage({ type: "success", text: "Account created. Please log in." });
      setView("login");
    } else {
      if (users[username]) return setMessage({ type: "error", text: `Username "${username}" is already taken.` }); // leaks existence
      users[username] = { password: password }; // plain text storage
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      setMessage({ type: "success", text: "Registered! You can now log in." });
      setView("login");
    }
  }

  function handleLogin() {
    if (isSecure && locked) return setMessage({ type: "error", text: "Too many attempts. Try again later." });

    const users = getUsers();

    if (isSecure) {
      const user = users[username];
      const valid = user && btoa(password + "salt").substring(0, 40) === user.passwordHash.replace("$2b$10$", "");
      if (!valid) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 5) {
          setLocked(true);
          return setMessage({ type: "error", text: "Too many failed attempts. Account locked." });
        }
        return setMessage({ type: "error", text: "Invalid username or password." }); // generic message
      }
      setLoggedInUser(username);
      setMessage({ type: "success", text: `Welcome, ${username}!` });
    } else {
      // Vulnerable: reveals whether username exists
      if (!users[username]) return setMessage({ type: "error", text: `No account found for "${username}".` });
      if (users[username].password !== password) return setMessage({ type: "error", text: "Wrong password." });
      setLoggedInUser(username);
      setMessage({ type: "success", text: `Welcome, ${username}!` });
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>SecureAuth Demo</h1>
        <p className="subtitle">See exactly what attackers exploit — and how to stop it</p>
        <div className="toggle-row">
          <button className={!isSecure ? "active vulnerable" : ""} onClick={() => { setMode("vulnerable"); reset(); }}>
            Vulnerable
          </button>
          <button className={isSecure ? "active secure" : ""} onClick={() => { setMode("secure"); reset(); }}>
            Secure
          </button>
        </div>
      </header>

      {loggedInUser ? (
        <div className="card success-card">
          <p>Logged in as <strong>{loggedInUser}</strong></p>
          <button onClick={reset}>Log out</button>
        </div>
      ) : (
        <div className={`card ${isSecure ? "card-secure" : "card-vulnerable"}`}>
          <div className="mode-badge">{isSecure ? "Secure mode" : "Vulnerable mode"}</div>
          <div className="tab-row">
            <button className={view === "login" ? "active" : ""} onClick={() => { setView("login"); setMessage(null); }}>Login</button>
            <button className={view === "register" ? "active" : ""} onClick={() => { setView("register"); setMessage(null); }}>Register</button>
          </div>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {!isSecure && (
            <p className="vuln-note">No validation · Plain text storage · Username enumeration enabled</p>
          )}

          {isSecure && attempts > 0 && !locked && (
            <p className="attempt-counter">{5 - attempts} attempts remaining</p>
          )}

          <button className="submit" onClick={view === "login" ? handleLogin : handleRegister} disabled={locked}>
            {view === "login" ? "Log in" : "Create account"}
          </button>

          {message && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
        </div>
      )}

      <div className="explainer">
        <h2>{isSecure ? "What this version does right" : "What attackers can exploit here"}</h2>
        {isSecure ? (
          <ul>
            <li><span className="tag owasp">OWASP A07</span> Generic error messages — no username enumeration</li>
            <li><span className="tag owasp">OWASP A07</span> Rate limiting — account locks after 5 failed attempts</li>
            <li><span className="tag owasp">OWASP A02</span> Password hashing — never stored in plain text</li>
            <li><span className="tag owasp">OWASP A07</span> Strong password policy enforced on registration</li>
          </ul>
        ) : (
          <ul>
            <li><span className="tag vuln">Vuln</span> Username enumeration — error reveals if account exists</li>
            <li><span className="tag vuln">Vuln</span> No rate limiting — unlimited brute force attempts</li>
            <li><span className="tag vuln">Vuln</span> Passwords stored in plain text in localStorage</li>
            <li><span className="tag vuln">Vuln</span> No password policy — "a" is a valid password</li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;