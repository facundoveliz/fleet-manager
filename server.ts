import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors({ credentials: true }))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
