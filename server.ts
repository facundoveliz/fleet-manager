import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDb } from './config/database'
import indexRouter from './routes/index'

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors({ credentials: true }))
app.use('/', indexRouter)

connectDb().catch((err) => {
  console.error('Unable to connect to the database:', err)
})

const port = process.env.PORT ?? 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
