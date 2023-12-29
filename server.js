require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { SERVER_PORT } = process.env
const { seed, addToTeam, getTeam, deleteFromTeam } = require("./database/controller")

const app = express();

app.use(express());
app.use(express.json());
app.use(cors());

app.post('/seed', seed);
app.post('/team', addToTeam);
app.get('/team', getTeam);
app.delete('/team/:id', deleteFromTeam)

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))