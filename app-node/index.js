const express = require('express')
const app = express()
const os = require('os');
const port = 5000

app.get('/', (req, res) => {
    res.send(`Hello from ${os.hostname()}`);
})
app.listen(port, () => {
    console.log(`Server Started on Port  ${port}`)
})
