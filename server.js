const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory 'database'
let items = [
    { id: 1, name: 'Learn EC2', description: 'Deploy this backend to an EC2 instance' },
    { id: 2, name: 'Learn S3', description: 'Host the React frontend on an S3 bucket' }
];
let nextId = 3;

// Routes

// Health check endpoint (useful for load balancers / AWS health checks)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend is running smoothly' });
});

// GET all items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// GET single item
app.get('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
});

// CREATE an item
app.post('/api/items', (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }
    
    const newItem = {
        id: nextId++,
        name,
        description
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// UPDATE an item
app.put('/api/items/:id', (req, res) => {
    const { name, description } = req.body;
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found' });
    }
    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }
    
    items[itemIndex] = { ...items[itemIndex], name, description };
    res.json(items[itemIndex]);
});

// DELETE an item
app.delete('/api/items/:id', (req, res) => {
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    
    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found' });
    }
    
    const deletedItem = items.splice(itemIndex, 1);
    res.json(deletedItem[0]);
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT}/api/items to test`);
});
