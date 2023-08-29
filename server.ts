import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/database";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({ credentials: true }));

const testDatabase = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
testDatabase();
