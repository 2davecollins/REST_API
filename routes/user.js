/**
 * v1 of api
 */
const express = require("express");
const router = express.Router();
const db = require("../database");
const md5 = require("md5");

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the author *
 *       example:
 *         id: 1
 *         name: Dave
 *         email: sample@gmail.com
 *
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users managing API
 * /users:
 *    get:
 *     summary: Lists all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *    post:
 *     summary: Create a new User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * /users/{id}:
 *    get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The User was not found
 *
 *    put:
 *      summary: Update of user by id
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *
 *
 *    delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */

router.get("/", (req, res, next) => {
  const sql = "select * from user";
  const params = [];

  db.all(sql, params, function (err, rows) {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    callback(rows);
  });
  function callback(rows) {
    res.status(200).json({ message: "success", data: rows });
  }
});

router.get("/:id", (req, res, next) => {
  const sql = "select * from user where id = ?";
  const params = [req.params.id];

  db.get(sql, params, function (err, row) {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    if (row) {
      res.status(200).json({ message: "success", data: row });
    } else {
      res.status(400).json({ message: "info", data: "No User" });
    }
  });
});

router.post("/", (req, res, next) => {
  let errors = [];
  console.log(req.body);
  const { name, email, password } = req.body;
  let data = {
    name: name,
    email: email,
    password: md5(password),
  };

  const sql = "INSERT INTO user (name, email, password) VALUES (?,?,?)";
  let params = [data.name, data.email, data.password];

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(201).json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
});

router.put("/:id", function (req, res) {
  const sql = "select * from user where id = ?";
  const params = [req.params.id];

  const data = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password),
  };
  const sqlPatch = `UPDATE user set 
  name = COALESCE(?,name), 
  email = COALESCE(?,email), 
  password = COALESCE(?,password) 
  WHERE id = ?`;

  const paramsPatch = [data.name, data.email, data.password];

  db.run(sql, paramsPatch, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(201).json({
      message: "success",
      data: data,
      id: this.changes,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  db.run(
    `DELETE FROM user WHERE id = ?`,
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({ deletedID: this.changes });
    }
  );
});
module.exports = router;
