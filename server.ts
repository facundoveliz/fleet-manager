import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { connectDb } from './config/database'
import indexRouter from './routes/index'
import { errorHandlerMiddleware } from './utils/error'

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors({ credentials: true }))
app.use(morgan('combined'))
app.use('/', indexRouter)
app.use(errorHandlerMiddleware)

connectDb().catch((err) => {
  console.error('Unable to connect to the database:', err)
})

const port = process.env.PORT ?? 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
