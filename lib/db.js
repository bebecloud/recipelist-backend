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
