const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3000
const db = require('./lib/queries')

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
app.delete('/recipes/:id', db.deletedeleteRecipeTodo)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
