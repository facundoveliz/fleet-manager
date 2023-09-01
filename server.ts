import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/database";
import User from "./models/user";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({ credentials: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
