const express = require('express');
const cors = require("cors");
const { createServer } = require("http");
const userRoutes = require("./routes/user");
require("dotenv").config();

const connectDB = require('./DB/DB')
const app = express();

const corsOpts = {
    origin:'http://localhost:3000', 
    credentials:true, 
    methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type']
};
app.use(cors(corsOpts));

connectDB()

const httpServer = createServer(app);

const port = process.env.PORT || 3001;

app.use(express.json());

app.use("/user", userRoutes);


httpServer.listen(port, () => console.log(`Server listening on port ${port}`));
