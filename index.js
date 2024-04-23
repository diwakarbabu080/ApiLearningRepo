

//  This is DB link with PWD --
//  mongodb+srv://diwakarbabu080:HssryWEZnDL8NEH8@cluster0.xxruktw.mongodb.net/

// 


const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://diwakarbabu080:HssryWEZnDL8NEH8@cluster0.xxruktw.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// User model
const User = require('./models/User');

app.use(bodyParser.json());

// Sign up route
app.post('/signup', async (req, res) => {
    try {


     body=req.body

     const username = body.username;
     const password = body.password;
     
if(!(body.username && body.password)){
    return res.status(400).json({message:"both username and passwordd are required"});
}


        userDetails= await User.findOne({username:body.username})

        if(userDetails){
            return res.status(400).json({message:"user already signed up"})
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        console.log("hi from sign in api")
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Sign in route
app.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({ token,message:"sign in success" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => console.log(`Server is listening on port ${port}`));
