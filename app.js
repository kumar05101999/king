const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbpath = path.join(__dirname, "moviesData.db");
app.use(express.json());
let db = null;
const installandserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("server is running perfectly");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
installandserver();

const convertMovieNametoPascalCase = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

app.get("/movies/", async (request, response) => {
  const query = `select movie_name from movie;`;
  const result = await db.all(query);
  response.send(result);
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const query = `insert into movie
    (director_id,movie_name,lead_actor) values
   ( '${directorId}', '${movieName}','${leadActor}');`;
  const result = await db.run(query);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query = `select * from movie where movie_id=${movieId};`;
  const result = await db.get(query);
  console.log(movieId);
  response.send(result);
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;

  const query = `update movie set 
    director_id=${directorId},
    movie_name='${movieName}',
    lead_actor='${leadActor}'
    where movie_id=${movieId};`;
  const result = await db.run(query);
  response.send("added");
});

//delete
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query = `delete from movie where movie_id=${movieId};`;
  const result = await db.run(query);
  response.send("movie Removed");
});

//get directors
app.get("/directors/", async (request, response) => {
  const query = `select * from director;`;
  const result = await db.all(query);
  response.send(result);
});

//api7

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const query = `select movie_name from movie inner join
    director on movie.director_id=director.director_id 
    where director.director_id=${directorId};`;
  const result = await db.all(query);
  response.send(result);
});
module.exports = app;
