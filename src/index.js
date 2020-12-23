const express = require('express');
const cors = require('cors');
const { v4: uuidv4, validate: isUuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const movies = [];

function idValidate(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) return res.status(400).json({ error: "Invalid movie ID!" });

  return next();
}

app.use('/movies/:id', idValidate);

app.get("/movies", (req, res) => {
  return res.json(movies);
});

app.post("/movies", (req, res) => {
  const { title, year } = req.body;

  const movie = { id: uuidv4(), title, year };

  movies.push(movie);

  return res.json(movie);
});

app.put("/movies/:id", (req, res) => {
  const { id } = req.params;
  const { title, year } = req.body;

  const index = movies.findIndex(movie => movie.id === id);

  if (index < 0) return res.status(400).json({ error: "Movie not found!" });

  const movie = { id, title, year };

  movies[index] = movie;

  return res.json(movie);
});

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;

  const index = movies.findIndex(movie => movie.id === id);

  if (index < 0) return res.status(400).json({ error: "Movie not found!" });

  movies.splice(index, 1);

  return res.status(204).send();
});

app.listen(3333, () => console.log("Server is running..."));