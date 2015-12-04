
var assert = require('assert');
var expect  = require("chai").expect;
var request = require("request");

var url = "http://localhost:3000";
var postId = "56616c9bf31b248011221072";
var post = "{\"_id\":\""+postId+"\",\"__v\":1,\"comments\":[\"56620936c0b8773069d5c92c\"],\"upvotes\":0}]";
var posts = "[" + post + "]";


describe("Flapper News API", function() {

  describe("Get All Posts Route", function() {

    it("returns status 200", function() {
      request(url + "/posts", function(error, response, body) {
        expect( response.statusCode).to.equal(200);
      });
    });

    it("returns all posts", function() {
      request(url + "/posts", function(error, response, body) {
        expect(body).to.equal(posts);
      });    
    })

  });

  describe("Get One Wrong Post Route", function() {

    it("returns status 200", function() {
      request(url + "/posts", function(error, response, body) {
        expect(response.statusCode).to.equal(200);
      });
    });

    it("returns the post", function() {
      request(url + "/posts/" + postId, function(error, response, body) {
        expect(body).to.equal(posts);
      });
    });
  });

});