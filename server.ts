import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDb } from './config/database'

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors({ credentials: true }))

connectDb()

const port = process.env.PORT ?? 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
