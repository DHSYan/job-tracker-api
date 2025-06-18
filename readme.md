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
- Use request body instead of route parameter
- Query parameter for retrieval



