const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const shortid = require('shortid');

const Assistant = require('./models/assistant');

mongoose.connect('mongodb+srv://maruarjun6:Bd8ImCfUhLRVJwrX@cluster0.hvj1lgt.mongodb.net/Assistants?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MONGO CONNECTION OPEN!!!")
})
.catch(err => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!")
    console.log(err)
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use('/stylesheets', express.static('stylesheets'))

app.get('/', async (req, res) => {
    try {
        const assistants = await Assistant.find();
        res.status(200).json({ assistants });
    } catch (err) {
        console.error('Error retrieving assistants:', err);
        res.status(500).json({ error: 'Error retrieving assistants' });
    }
})

app.get('/assistant/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const assistant = await Assistant.findById(id)
        res.status(200).json({ assistant });
    } catch (err) {
        console.error('Error retrieving assistant:', err);
        res.status(404).json({ error: 'Assistant not found' });
    }
})

app.get('/newassistant', (req, res) => {
    res.render("new");
})

app.post('/createassistant', async (req, res) => {
    try {
        const newAssistant = new Assistant(req.body);
        newAssistant.id = shortid.generate();

        await newAssistant.validate(); 
        await newAssistant.save();
        res.status(201).json({ assistant: newAssistant });
    } catch (err) {
        console.error('Error creating assistant:', err);
        res.status(400).json({ error: 'Invalid data, please check your input' });
    }
})

app.get('/assistant/:id/edit', async (req, res) => {
    try {
        const { id } = req.params;
        const assistant = await Assistant.findById(id);
        res.render('edit', { assistant });
    } catch (err) {
        console.error('Error retrieving assistant for edit:', err);
        res.status(404).json({ error: 'Assistant not found' });
    }
})

app.put('/updateassistant/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const assistant = await Assistant.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
        res.status(200).json({ assistant });
    } catch (err) {
        console.error('Error updating assistant:', err);
        res.status(400).json({ error: 'Invalid data, please check your input' });
    }
})

app.delete('/deleteassistant/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Assistant.findByIdAndDelete(id);
        res.status(204).json({ message: 'Assistant deleted successfully' });
    } catch (err) {
        console.error('Error deleting assistant:', err);
        res.status(500).json({ error: 'Error deleting assistant' });
    }
})

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})
