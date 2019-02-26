const { assert } = require('chai')
const sinon = require('sinon');
const { MongoClient } = require('mongo-mock')
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
  const defaultRes = {
    json: sinon.stub().returnsThis(),
    status: sinon.stub().returnsThis(),
    send: sinon.stub().returnsThis(),
    sendStatus: sinon.stub().returnsThis()
    // Add additional methods if using them in the API
  }
  const defaultReq = {
    body: {},
    params: {}
  }
  return { defaultRes, defaultReq }
}

describe('getRecipes', () => {
  before(async () => {
    ({ res, req } = defaultResAndReq())

    req = {
      body: {
        recipe: {
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
  beforeEach(async () => {
    ({ res, req } = defaultResAndReq())
  })

  after(async () => {
    await db.recipes.remove()
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
        imageUrl: "test.com",
        ingredients: ["Potatoes"],
        instructions: "Cook potatoes"
      }
    }

    // when
    await db.createRecipe(req, res)

    // then
    sinon.assert.calledWith(res.status, 201)
    sinon.assert.calledWithMatch(res.json, req.body.recipe)
  })
})

describe('updateRecipe', () => {
  beforeEach(async () => {
    ({ res, req } = defaultResAndReq())
  })

  after(async () => {
    await db.recipes.remove()
  })
})

describe('deleteRecipe', () => {
  beforeEach(async () => {
    ({ res, req } = defaultResAndReq())
  })

  after(async () => {
    await db.recipes.remove()
  })
})

// ... etc
