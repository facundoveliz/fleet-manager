import dotenv from 'dotenv'

dotenv.config()

const environment = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  secret: process.env.JWT_PRIVATE_KEY
}

export default environment
