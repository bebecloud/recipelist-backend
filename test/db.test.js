const { assert } = require('chai')
const sinon = require('sinon');
const { MongoClient } = require('mongo-mock')
const { Db } = require('../lib/db')

const db = new Db('mongodb://localhost:27017', MongoClient)

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

  it.skip('should fail when not passing any arguments', async () => {
    // when
    await db.createRecipe(req, res)

    // then
    sinon.assert.calledWith(res.sendStatus, 400)
  })

  it.skip('should add recipe to the database', async () => {
    // given
    // define req body

    // when
    await db.createRecipe(req, res)

    // then
    // assert that res.status was called correctly
    // assert that res.json was called correctly
    // assert that recipe was added to mongo
  })
})

// ... etc
