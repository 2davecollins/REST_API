const express = require("express");
const path = require("path");
const mysql = require("sqlite3");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./database");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

require("dotenv").config();
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res, next) => {
  const sql = "select * from user";
  const params = [];

  db.all(sql, params, function (err, rows) {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    callback(rows);
  });
  function callback(rows) {
    res.json({ message: "success", data: rows });
  }
});

app.use("/books", require("./routes/books"));
app.use("/users", require("./routes/user"));
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:4000/",
      },
      {
        url: "https://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(specs, { explorer: true })
);

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
