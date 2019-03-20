
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const { Db } = require('./lib/db')
const bearerToken = require('express-bearer-token')
const { verifyJWT } = require('./lib/auth-middleware')

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

app.use(bearerToken())

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/recipes', db.getRecipes)
app.get('/recipes/:id', db.getRecipeById)
app.post('/recipes', verifyJWT, db.createRecipe)
app.put('/recipes/:id', verifyJWT, db.updateRecipe)
app.delete('/recipes/:id', verifyJWT, db.deleteRecipe)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
