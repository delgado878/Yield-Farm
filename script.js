const API_URL = 'http://localhost:3000';

// Register
async function register(email, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await res.json();
}

// Login
async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await res.json();
}

// Deposit
async function deposit(email, amount) {
  const res = await fetch(`${API_URL}/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, amount })
  });
  return await res.json();
}

// Get user info
async function getUser(email) {
  const res = await fetch(`${API_URL}/user/${email}`);
  return await res.json();
}