### How to run Dev


```bash
npm install
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```


### How to run Prod

```bash
npm install
docker-compose up --build
```


if they fail try running them as `sudo`


## Todo 

- create more tests
- ~~Use request body instead of route parameter~~
- ~~Query parameter for retrieval~~
- PUT endpoint for updating an application
- Delete endpoint for deleting an application
- create a notes field in the data schema
- POST endpoint for notes
- GET /applications/:id/suggestion returns a mock response




# Problem with NIXOS
- upon testing with JEST, mongodb-memory-server does not support nixos out of the box
  - https://github.com/typegoose/mongodb-memory-server/issues/782

