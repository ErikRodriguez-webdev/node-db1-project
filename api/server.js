const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ message: "API IS UP" });
});

server.get("/api/accounts", (req, res) => {
  db("accounts")
    .select("*")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Error with getting accounts." });
    });
});

server.post("/api/accounts", (req, res) => {
  db("accounts")
    .insert(req.body, "id")
    .then((response) => {
      db("accounts")
        .where({ id: response[0] })
        .then((row) => {
          res.status(201).json(row);
        });
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Error with creating account." });
    });
});

server.put("/api/accounts/:id", (req, res) => {
  db("accounts")
    .where(req.params)
    .update(req.body)
    .then(() => {
      db("accounts")
        .select("*")
        .where(req.params)
        .then((row) => {
          res.status(200).json(row);
        });
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Error with updating account." });
    });
});

server.delete("/api/accounts/:id", (req, res) => {
  db("accounts")
    .where(req.params)
    .delete()
    .then(() => {
      res.status(200).json({ message: "Account deleted." });
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Error with deleting account." });
    });
});

module.exports = server;
