const config = require('./config/config')

const express = require('express')
const app = express()

app.get('/', (req, res) => res.json({ data: "hello world" }))
app.use((req, res, next) => res.status(404).json({ error: "This endpoint does not exist" }))

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}`))