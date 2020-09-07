const express = require("express");
const cors = require("cors");
const { v4:uuidv4, validate: uuidValidate } = require('uuid');

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());



const repositories = [ ];

app.get("/repositories", (request, response) => {
  
  //just return all repos
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // take the values from request 
  const { title, url, techs } = request.body;

  //create a uuid, set 0 likes, set the request body values
  const repo = { id: uuidv4(), likes: 0, url, title, techs};

  //set the values at array last position 
  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  // take the values from request 
  const { id } = request.params;
  const { title, url, techs } = request.body;

  //search in the array the position of the indicated repository
  const repoIndex = repositories.findIndex(curRepo => curRepo.id == id);

  //check the search result for invalid entry
  if (repoIndex < 0) {
    return response.status(400).json({error: 'Project not found'});
  }

  //define the values to overwrite
  const repo = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  }

  //overwrite the values
  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  // take the id from request
  const { id } = request.params;

  //search in the array the position of the indicated repository
  const repoIndex = repositories.findIndex(curRepo => curRepo.id == id);

  //check the search result for invalid entry
  if (repoIndex < 0) {
    return response.status(400).json({error: 'Project not found'});
  }

  //remove the array position
  repositories.splice(repoIndex, 1);

  //return a void message with 204 success status
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  //search in the array the position of the indicated repository
  const repoIndex = repositories.findIndex(curRepo => curRepo.id == id);

  //check the search result for invalid entry
  if (repoIndex < 0) {
    return response.status(400).json({error: 'Project not found'});
  }

  //to increase likes
  repositories[repoIndex].likes++;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
