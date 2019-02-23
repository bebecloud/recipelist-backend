
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const { Db } = require('./lib/db')

require('dotenv').config();
const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 3000
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/recipelist'

const db = new Db(mongoUrl);

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(cors())

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/recipes', db.getRecipes)
app.get('/recipes/:id', db.getRecipeById)
app.post('/recipes', db.createRecipe)
app.put('/recipes/:id', db.updateRecipe)
app.delete('/recipes/:id', db.deleteRecipe)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
