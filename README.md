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

### GET /recipes/:id
Retrieves single recipe
- url param `id`

### POST /recipes
Creates a new recipe
- body param `recipe` (see recipe schema)

### PUT /recipes/:id
Updates an existing recipe
- url param `id`
- body param `recipe` (see recipe schema)

### DELETE /recipes/:id
- url param `id`
