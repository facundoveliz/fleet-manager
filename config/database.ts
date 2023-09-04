import { Sequelize } from 'sequelize'
import environment from './environment'

const { database, username, password, host } = environment

const sequelize = new Sequelize(database!, username!, password, {
  host,
  dialect: 'sqlite',
  storage: 'fleet-manager.sqlite3'
})

const connectDb = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    // await sequelize.sync({ force: false, alter: true });
    console.log('Connection has been established successfully.')
    console.log('All models were synchronized successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export { sequelize, connectDb }
