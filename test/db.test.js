const { assert } = require('chai')
const sinon = require('sinon');
const { MongoClient } = require('mongo-mock')
const { Db } = require('../lib/db')

const db = new Db(null, MongoClient)

// Resources:
// https://www.techighness.com/post/unit-testing-expressjs-controller-part-1/
// https://sinonjs.org/releases/latest/
// https://mochajs.org/
// https://www.chaijs.com/api/assert/
// https://expressjs.com/en/api.html

describe('createRecipe', () => {
  let req = {}
  let res = {}

  beforeEach(async () => {
    res = {
      json: sinon.stub().returnsThis(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis(),
      sendStatus: sinon.stub().returnsThis()
      // Add additional methods if using them in the API
    }
    req = {
      body: {},
      params: {}
    }
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
    console.log(res.json.firstCall.args)

    // then
    sinon.assert.calledWith(res.status, 201)
    sinon.assert.calledWithMatch(res.json, req.body.recipe)
  })
})

// ... etc
