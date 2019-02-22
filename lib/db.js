class Db {
  constructor(mongoUrl, MongoClient) {
    mongoUrl = mongoUrl || 'mongodb://localhost:27017'
    MongoClient = MongoClient || require('mongodb').MongoClient

    this.initMongo = this.initMongo.bind(this)
    this.ready = this.ready.bind(this)
    this.getRecipes = this.getRecipes.bind(this)
    this.getRecipeById = this.getRecipeById.bind(this)
    this.createRecipe = this.createRecipe.bind(this)
    this.updateRecipe = this.updateRecipe.bind(this)
    this.deleteRecipe = this.deleteRecipe.bind(this)

    this._ready = (async () => {
      await this.initMongo(mongoUrl, MongoClient)
    })
  }

  async initMongo(mongoUrl, MongoClient) {
    this.client = await MongoClient.connect(mongoUrl)
  }

  async ready() {
    return this._ready
  }

  async getRecipes(request, response) {
    await this.ready()
    response.sendStatus(501)
  }

  async getRecipeById(request, response) {
    await this.ready()
    response.sendStatus(501)
  }

  async createRecipe(request, response) {
    await this.ready()
    response.sendStatus(501)
  }

  async updateRecipe(request, response) {
    await this.ready()
    response.sendStatus(501)
  }

  async deleteRecipe(request, response) {
    await this.ready()
    response.sendStatus(501)
  }
}

module.exports = {
  Db
}
