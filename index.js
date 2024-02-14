const express = require('express');
const mongoose = require('mongoose');
const notesRoutes = require('./routes/notes.route');
const userRoute = require('./routes/user.route')
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const connect = require('./config/db')
app.use('/notes', notesRoutes);


const PORT = process.env.PORT 

app.use('/' , userRoute);

app.listen(PORT, async () => {
    try {
        await connect();
        console.log(`server is running on port ${PORT}`);
    } catch (error) {
        console.log(error);
    }
});
