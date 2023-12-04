require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { SERVER_PORT } = process.env

const app = express();

app.use(express());
app.use(cors());

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))