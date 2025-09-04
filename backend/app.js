//const express =  require("express");
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// const cors = require('cors');
import cors from "cors";
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
dotenv.config();
// const mongoose = require("mongoose");
const app = express();

//middlewares
app.use(express.json());
app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/movie",movieRouter);
app.use("/booking",bookingsRouter);

app.use(cors({
    origin: 'http://localhost:3000'
}));


mongoose
    .connect
    (`mongodb+srv://dharmik1185:Dharmik153@cluster0.vqk0pvq.mongodb.net/movieticketbookinapp?retryWrites=true&w=majority`
    )
    .then(() =>
        app.listen(5000, () =>
            console.log("Connected to database and server is running")
        )
    )
    .catch((e) => console.log(e));

// app.listen(5000, () => {
//     console.log(`connection to the local host port ${5000}`);
// })