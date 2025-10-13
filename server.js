require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Register user
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase.from('users').insert([{ email, password: hashedPassword }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'User registered', user: data[0] });
});

// Login user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();

  if (error || !data) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, data.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ message: 'Login successful', user: { id: data.id, email: data.email, deposit: data.deposit } });
});

// Add deposit
app.post('/deposit', async (req, res) => {
  const { email, amount } = req.body;
  if (!email || !amount || amount < 250) return res.status(400).json({ error: 'Invalid deposit' });

  const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (error || !user) return res.status(404).json({ error: 'User not found' });

  const newDeposit = parseFloat(user.deposit) + parseFloat(amount);
  const { data, updateError } = await supabase.from('users').update({ deposit: newDeposit }).eq('email', email);

  if (updateError) return res.status(400).json({ error: updateError.message });
  res.json({ message: 'Deposit successful', deposit: newDeposit });
});

// Get user info
app.get('/user/:email', async (req, res) => {
  const { email } = req.params;
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (error || !data) return res.status(404).json({ error: 'User not found' });
  res.json(data);
});

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT}`));