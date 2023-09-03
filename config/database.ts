import { Sequelize } from 'sequelize'
import environment from './environment'

const { database, username, password, host } = environment

const sequelize = new Sequelize(database!, username!, password, {
  host,
  dialect: 'sqlite',
  storage: 'fleet-manager.sqlite3'
})

export default sequelize
