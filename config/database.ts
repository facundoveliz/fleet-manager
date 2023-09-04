import { Sequelize } from 'sequelize'
import environment from './environment'

const { database, username, password, host } = environment

const sequelize = new Sequelize(database!, username!, password, {
  host,
  dialect: 'sqlite',
  storage: 'fleet-manager.sqlite3'
})

const connectDb = async (): Promise<void> => {
  await sequelize.authenticate()
  console.log('Connection has been established successfully.')
  console.log('All models were synchronized successfully.')
}

export { sequelize, connectDb }
