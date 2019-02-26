const { assert } = require('chai')
const sinon = require('sinon');
const { MongoClient } = require('mongo-mock')
const { ObjectID } = require('mongodb')
const { Db } = require('../lib/db')

const db = new Db(null, MongoClient)
let req = {}
let res = {}

// Resources:
// https://www.techighness.com/post/unit-testing-expressjs-controller-part-1/
// https://sinonjs.org/releases/latest/
// https://mochajs.org/
// https://www.chaijs.com/api/assert/
// https://expressjs.com/en/api.html

const defaultResAndReq = () => {
  let defaultRes = {
    json: sinon.stub().returnsThis(),
    status: sinon.stub().returnsThis(),
    send: sinon.stub().returnsThis(),
    sendStatus: sinon.stub().returnsThis()
    // Add additional methods if using them in the API
  }
  let defaultReq = {
    body: {},
    params: {}
  }
  return { res: defaultRes, req: defaultReq }
}

describe('getRecipes', () => {
  before(async () => {
    ({ res, req } = defaultResAndReq())

    req = {
      body: {
        recipe: {
          title: 'Cooked potatoes',
          ingredients: ['Potatoes'],
          instructions: 'Cook potatoes'
        }
      },
      params: {}
    }

    // populate db with five recipes TODO: Replace with fixtures

    for (let i = 0; i < 5; i++) {
      await db.createRecipe(req, res)
    }
  })

  beforeEach(async () => {
    ({ res, req } = defaultResAndReq())
  })

  after(async () => {
    await db.recipes.remove()
  })

  it('should return all recipes', async () => {
    // when
    await db.getRecipes(req, res)

    // then
    sinon.assert.calledWith(res.status, 200)
    sinon.assert.calledWith(res.json, sinon.match.array)

    const recipes = res.json.firstCall.args[0]
    assert.equal(recipes.length, 5)
  })

  it('should return subset of recipes', async () => {
    // given
    req.body = {
      pageSize: 2,
      pageNumber: 2
    }

    // when
    await db.getRecipes(req, res)

    // then
    sinon.assert.calledWith(res.status, 200)
    sinon.assert.calledWith(res.json, sinon.match.array)

    const recipes = res.json.firstCall.args[0]
    assert.equal(recipes.length, 2)
  })
})

describe('getRecipeById', () => {
  let correctId

  before(async () => {
    ({ res, req } = defaultResAndReq())

    req = {
      body: {
        recipe: {
          title: 'Cooked potatoes',
          ingredients: ['Potatoes'],
          instructions: 'Cook potatoes'
        }
      },
      params: {}
    }

    await db.createRecipe(req, res)

    correctId = res.json.firstCall.args[0]._id.toString()
  })

  beforeEach(async () => {
    ({ res, req } = defaultResAndReq())
  })

  after(async () => {
    await db.recipes.remove()
  })

  it('should fail when not passing id', async () => {
    // when
    await db.getRecipeById(req, res)

    // then
    sinon.assert.calledWith(res.sendStatus, 400)
  })

  it('should fail when passing nonexisting id', async () => {
    // given
    req.params.id = correctId.substring(2) + 'aa'

    // when
    await db.getRecipeById(req, res)

    // then
    sinon.assert.calledWith(res.sendStatus, 404)
  })

  it('should return when using correct id', async () => {
    // given
    req.params.id = correctId

    // when
    await db.getRecipeById(req, res)

    // then
    sinon.assert.calledWith(res.status, 200)
    sinon.assert.called(res.json)
    assert.equal(res.json.firstCall.args[0]._id.toString(), correctId)
  })
})

describe('createRecipe', () => {
  beforeEach(async () => {
    ({ res, req } = defaultResAndReq())
  })

  after(async () => {
    await db.recipes.remove()
  })

  it('should fail when not passing ingredients', async () => {
    // given
    req.body = {
      recipe: {
        imageUrl: "test.com",
        instructions: "Cook potatoes"
      }
    }

    // when
    await db.createRecipe(req, res)

    // then
    sinon.assert.calledWith(res.sendStatus, 400)
    sinon.assert.notCalled(res.json)
  })

  it('should add recipe to the database', async () => {
    // given
    req.body = {
      recipe: {
        title: "Cooked potatoes",
        imageUrl: "test.com",
        ingredients: ["Potatoes"],
        instructions: "Cook potatoes"
      }
    }

    // when
    await db.createRecipe(req, res)

    // then
    sinon.assert.calledWith(res.status, 200)
    sinon.assert.calledWithMatch(res.json, req.body.recipe)
  })
})

describe('updateRecipe', () => {
  let id

  before(async () => {
    ({ res, req } = defaultResAndReq())

    req = {
      body: {
        recipe: {
          title: 'Cooked potatoes',
          ingredients: ['Potatoes'],
          instructions: 'Cook potatoes'
        }
      },
      params: {}
    }

    await db.createRecipe(req, res)

    id = res.json.firstCall.args[0]._id.toString()
  })

  beforeEach(async () => {
    ({ res, req } = defaultResAndReq())
  })

  after(async () => {
    await db.recipes.remove()
  })

  it('should fail when not passing id', async () => {
    // given
    req.body = {
      recipe: {
        title: "Cooked potatoes",
        imageUrl: "test.com",
        ingredients: ["Apples"],
        instructions: "Cook apples"
      }
    }

    // when
    await db.updateRecipe(req, res)

    // then
    sinon.assert.calledWith(res.sendStatus, 400)
  })

  it('should fail when passing nonexisting id', async () => {
    // given
    req.params.id = id.substring(2) + 'aa'
    req.body = {
      recipe: {
        title: "Cooked apples",
        imageUrl: "test.com",
        ingredients: ["Apples"],
        instructions: "Cook apples"
      }
    }

    // when
    await db.updateRecipe(req, res)

    // then
    sinon.assert.calledWith(res.sendStatus, 404)
  })

  it('should fail when not passing ingredients', async () => {
    // given
    req.params.id = id
    req.body = {
      recipe: {
        imageUrl: "test.com",
        instructions: "Cook apples"
      }
    }

    // when
    await db.updateRecipe(req, res)

    // then
    sinon.assert.calledWith(res.sendStatus, 400)
    sinon.assert.notCalled(res.json)
  })

  it('should update recipe', async () => {
    // given
    req.params.id = id
    req.body = {
      recipe: {
        title: "Cooked apples",
        imageUrl: "test.com",
        ingredients: ["Apples"],
        instructions: "Cook apples"
      }
    }

    // when
    await db.updateRecipe(req, res)

    // then
    sinon.assert.calledWith(res.status, 200)
    sinon.assert.calledWithMatch(res.json, req.body.recipe)
  })
})

describe('deleteRecipe', () => {
  let id

  before(async () => {
    ({ res, req } = defaultResAndReq())

    req = {
      body: {
        recipe: {
          title: 'Cooked potatoes',
          ingredients: ['Potatoes'],
          instructions: 'Cook potatoes'
        }
      },
      params: {}
    }

    await db.createRecipe(req, res)

    id = res.json.firstCall.args[0]._id.toString()
  })

  beforeEach(async () => {
    ({ res, req } = defaultResAndReq())
  })

  after(async () => {
    await db.recipes.remove()
  })

  it('should fail when not passing id', async () => {
    // when
    await db.deleteRecipe(req, res)

    // then
    sinon.assert.calledWith(res.sendStatus, 400)
  })

  it('should delete when passing id', async () => {
    // given
    req.params.id = id

    // when
    await db.deleteRecipe(req, res)

    // then
    sinon.assert.calledWith(res.sendStatus, 200)
  })
})

// ... etc
