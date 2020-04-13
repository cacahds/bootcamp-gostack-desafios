const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  if (repositories.length > 0 )
    response.json(repositories);
  else
    response.status(204).send();
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  var repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  repositories.push(repository);

  response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const { title, url, techs } = request.body;

  let repositoryIndex = repositories.findIndex(repository => repository.id === id );

  if (repositoryIndex < 0)
    response.status(400).json({ message: `repository '${id}' not found` });

  var repository = {
    id: repositories[repositoryIndex].id,
    title: title,
    url: url,
    techs: techs,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const id = request.params.id;
  let repositoryIndex = repositories.findIndex(repository => repository.id === id );

  if (repositoryIndex < 0)
    response.status(400).json({ message: `repository '${id}' not found` });

  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const id = request.params.id;
  let repositoryIndex = repositories.findIndex(repository => repository.id === id );

  if (repositoryIndex < 0)
    response.status(400).json({ message: `repository '${id}' not found` });

  var repository = repositories[repositoryIndex];
  repository.likes++;
  repositories[repositoryIndex] = repository;

  response.json({ likes: repository.likes });

});

module.exports = app;
