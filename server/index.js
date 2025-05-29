import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// JWT Secret
const JWT_SECRET = 'your-secret-key-should-be-in-env-file';

// In-memory database (for demo purposes)
// In a real app, this would be a database connection
let users = [];

// Try to load users from file if exists
const usersFilePath = path.join(__dirname, 'users.json');
try {
  if (fs.existsSync(usersFilePath)) {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    users = JSON.parse(data);
    console.log(`Loaded ${users.length} users from file`);
  }
} catch (err) {
  console.error('Error loading users from file:', err);
}

// Save users to file
const saveUsers = () => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error saving users to file:', err);
  }
};

// Routes
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: `user${users.length + 1}`,
      name,
      email,
      password: hashedPassword,
      avatar: `https://img.heroui.chat/image/avatar?w=200&h=200&u=${users.length + 5}`,
      role: 'Team Member',
      roleType: 'user',
      createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save to file
    saveUsers();
    
    // Create JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user without password and token
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user without password and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route example
app.get('/users/me', (req, res) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
