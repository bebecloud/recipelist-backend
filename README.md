# Recipe List Backend
This repository contains the practical project for our DevOps course at the University of Amsterdam.


## Running the server locally
Install NPM dependencies

```
cd recipelist-backend
npm install
```

Download MongoDB, and start it as a background service

```
mongod &
```

Start the Express server

```
npm start
```

## Running tests locally

```
npm test
```

## API spec

Recipe schema:

```
recipe = {
    title: 'String',
    ingredients: ['String'],
    instructions: 'String', // optional
    imageUrl: 'String' // optional
}
```

### GET /recipes
Retrieves all recipes, or paginated recipes
- (Optional) body param `pageSize`
- (Optional) body param `pageNumber`

Status 200
Returns `[recipe]`

### GET /recipes/:id
Retrieves single recipe
- url param `id`

Status 404 if recipe can't be found
Status 200
Returns `recipe`

### POST /recipes
Creates a new recipe
- body param `recipe` (see recipe schema)

Status 400 if recipe param is omitted or malformed
Status 500 if recipe could not be created because of db error
Status 200
Returns created `recipe`

### PUT /recipes/:id
Updates an existing recipe
- url param `id`
- body param `recipe` (see recipe schema)

Status 400 if recipe param is omitted or malformed
Status 404 if recipe can't be found
Status 200
Returns updated `recipe`

### DELETE /recipes/:id
- url param `id`

Status 200
