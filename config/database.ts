import { Sequelize } from "sequelize";
import environment from "./environment";

const { database, username, password, host } = environment;

const sequelize = new Sequelize(database!, username!, password!, {
	host: host,
	dialect: "sqlite",
});

export default sequelize;
