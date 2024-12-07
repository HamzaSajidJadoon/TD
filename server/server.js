const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const MONGO_URI='mongodb+srv://hamzasajidjadoon1997:uRPyCEjlLFMYaowN@td-cluster.joo5n.mongodb.net/?retryWrites=true&w=majority&appName=td-cluster';
const JWT_SECRET='0106203abcdefgsvdsvvsrsya34s6dd7';


// Initialize Express app
const app = express();
const port = 3001; // Use the port from .env file

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB using the URI from .env
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Failed to connect to MongoDB Atlas', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

// Task Schema and Model
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskTitle: { type: String, required: true },
  taskDetail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);

// Utility function for JWT verification
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'Token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded; // Add decoded user info to request object
    next(); // Call next() to move to the next middleware or route handler
  });
};


// Sign-up Route
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred', error: err.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Create the JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    // Respond with the message, token, and user data
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,        // Pass the user ID
        username: user.username  // Pass the username
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred', error: err.message });
  }
});

// Add Task Route
app.post('/addTask', verifyToken, async (req, res) => {
  try {
   
    console.log('Request body:', req.body);

    // Retrieve data from request body
    const { taskTitle, taskDetail, userId } = req.body;

    // Make sure the taskTitle and taskDetail are provided
    if (!taskTitle || !taskDetail) {
      return res.status(400).json({ message: 'Please provide task title and detail' });
    }

    // Create a new task and save it to the database
    const newTask = new Task({
      taskTitle,
      taskDetail,
      userId, // Use userId from request body (can also be from JWT if preferred)
    });

    await newTask.save(); // Save the task to the database
    console.log('Task saveed');
    return res.status(201).json({
      message: 'Task added successfully',
      task: newTask,
    });
   
  } catch (err) {
    console.error('Error occurred in /addTask route:', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get All Tasks Route
app.get('/getAllTasks', verifyToken, async (req, res) => {
  console.log('Authorization Header:', req.headers['authorization']); // Log the authorization header
  
  try {
    const userId = req.user.id;  // Get user ID from the verified token
    
    // Fetch tasks for the authenticated user
    const tasks = await Task.find({ userId });

    // Send tasks in the response
    res.status(200).json({ tasks });
  } catch (err) {
    console.error('Error occurred in /getAllTasks route:', err);
    res.status(500).json({ message: 'An error occurred', error: err.message });
  }
});


// Add this route to handle task deletion
app.delete('/deleteTask/:id', verifyToken, async (req, res) => {
  try {
    const taskId = req.params.id;

    // Check if the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the user is authorized to delete the task (you could verify this by checking the userId)
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this task' });
    }

    // Delete the task
    await Task.findByIdAndDelete(taskId);
console.log('Task deleted');
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error occurred in /deleteTask route:', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

app.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while logging out' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
