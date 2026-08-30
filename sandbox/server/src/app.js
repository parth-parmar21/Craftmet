import e, { urlencoded } from "express"
import express from "express"
import morgan from 'morgan'

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(urlencoded({ extended: true }))

app.get("/api/sandbox/health", (req, res) => {
    res.status(200).json({
        message: "Hello, Sandbox!",
        status: "ok"
    });
});


export default app