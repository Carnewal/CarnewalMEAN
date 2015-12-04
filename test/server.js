var express = require("express");
var app = express();

var assert = require('assert');

var converter = require("./converter");


app.get("/posts", function(req, res) {

	 var resp = "[{\"_id\":\"56616c9bf31b248011221072\",\"__v\":1,\"comments\":[\"56620936c0b8773069d5c92c\"],\"upvotes\":0}]";

  res.send(resp);
});

app.get("/posts/{id}", function(req, res) {

  var resp = "{\"_id\":\"56616c9bf31b248011221072\",\"__v\":1,\"comments\":[\"56620936c0b8773069d5c92c\"],\"upvotes\":0}]";

  res.send(resp);
});

app.listen(3000);