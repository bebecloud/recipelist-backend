const { ObjectID } = require('mongodb')

class Db {
  constructor(mongoUrl, MongoClient) {
    this.initMongo = this.initMongo.bind(this)
    this.ready = this.ready.bind(this)
    this.getRecipes = this.getRecipes.bind(this)
    this.getRecipeById = this.getRecipeById.bind(this)
    this.createRecipe = this.createRecipe.bind(this)
    this.updateRecipe = this.updateRecipe.bind(this)
    this.deleteRecipe = this.deleteRecipe.bind(this)
    // ///////////////////////////////////////////////////////////////

    mongoUrl = mongoUrl || 'mongodb://localhost:27017/recipelist'
    MongoClient = MongoClient || require('mongodb').MongoClient

    this._ready = new Promise((resolve, reject) => {
      this.initMongo(mongoUrl, MongoClient).then(resolve).catch(reject)
    })
  }

  async initMongo(mongoUrl, MongoClient) {
    const client = await MongoClient.connect(mongoUrl)
    this.db = !!client.db ? client.db() : client
    this.recipes = this.db.collection('recipes')
  }

  async ready() {
    return this._ready
  }

  async getRecipes(request, response) {
    try {
      await this.ready()

      const { pageSize, pageNumber } = request.body

      let cursor = this.recipes.find()
      if (pageSize) cursor = cursor.limit(pageSize)
      if (pageNumber) cursor = cursor.skip(pageSize * (pageNumber - 1))

      const recipes = await cursor.toArray()
      response.status(200).json(recipes)
    } catch (e) {
      console.log(e)
      response.status(500).send(e.toString())
    }
  }

  // TODO: Should we make this authenticated?
  async getRecipesByOwner(request, response) {
    try {
      await this.ready()

      const { pageSize, pageNumber, ownerId } = request.body

      let cursor = this.recipes.find({ owner: ownerId })
      if (pageSize) cursor = cursor.limit(pageSize)
      if (pageNumber) cursor = cursor.skip(pageSize * (pageNumber - 1))

      const recipes = await cursor.toArray()
      response.status(200).json(recipes)
    } catch (e) {
      console.log(e)
      response.status(500).send(e.toString())
    }
  }

  // TODO: Should we make this authenticated?
  async getRecipeById(request, response) {
    try {
      await this.ready()

      if (!request.params.id) {
        return response.sendStatus(400)
      }

      const recipes = await this.recipes.find({ _id: ObjectID(request.params.id) }).toArray()

      if (!recipes || recipes.length === 0) {
        return response.sendStatus(404)
      }

      const recipe = recipes[0]

      response.status(200).json(recipe)
    } catch (e) {
      console.log(e)
      response.status(500).send(e.toString())
    }
  }

  async createRecipe(request, response) {
    try {
      await this.ready()
      const { recipe } = request.body

      if (!recipe) {
        return response.sendStatus(400)
      }

      if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
        return response.sendStatus(400)
      }

      if (!recipe.title) {
        return response.sendStatus(400)
      }

      recipe.owner = request.user.user_id;

      const result = await this.recipes.insertOne(recipe)

      if (result.insertedCount == 0) {
        response.sendStatus(500)
      } else {
        response.status(200).json(result.ops[0])
      }
    } catch (e) {
      console.log(e)
      response.status(500).send(e.toString())
    }
  }

  async updateRecipe(request, response) {
    try {
      await this.ready()
      const { recipe } = request.body

      if (!recipe) {
        return response.sendStatus(400)
      }

      if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
        return response.sendStatus(400)
      }

      if (!recipe.title) {
        return response.sendStatus(400)
      }

      if (!request.params.id) {
        return response.sendStatus(400)
      }

      const recipes = await this.recipes.find({ _id: ObjectID(request.params.id) }).toArray()
      if (!recipes || recipes.length === 0) {
        return response.sendStatus(404)
      }

      if (recipes[0].owner !== request.user.user_id) {
        return response.sendStatus(403)
      }

      await this.recipes.update({ _id: ObjectID(request.params.id) }, recipe)

      const updatedRecipe = (await this.recipes.find({ _id: ObjectID(request.params.id) }).toArray())[0]

      response.status(200).json(updatedRecipe)

    } catch (e) {
      console.log(e)
      response.status(500).send(e.toString())
    }
  }

  async deleteRecipe(request, response) {
    try {
      await this.ready()

      if (!request.params.id) {
        return response.sendStatus(400)
      }

      const recipes = await this.recipes.find({ _id: ObjectID(request.params.id) }).toArray()
      if (!recipes || recipes.length === 0) {
        return response.sendStatus(404)
      }

      if (recipes[0].owner !== request.user.user_id) {
        return response.sendStatus(403)
      }

      await this.recipes.deleteOne({ _id: ObjectID(request.params.id) })
      response.sendStatus(200)
    } catch (e) {
      console.log(e)
      response.status(500).send(e.toString())
    }
  }
}

module.exports = {
  Db
}
