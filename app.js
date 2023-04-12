const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////////// Requests targeting all articles

app.route("/articles")

.get(function(req,res){
  async function find(){
    let result = await Article.find({});
    if(result.length != 0){
      res.send(result);
    }
    else{
      res.send("Database of articles is currently empty.");
    }
  }
  find();
})

.post(function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save();
  res.send("Successfully added a new article.");
})

.delete(function(req,res){
  async function deleteAll(){
    await Article.deleteMany({});
    res.send("All articles were successfully deleted.");
  }
  deleteAll();
});

/////////////////////////// Requests targeting a specific article

app.route("/articles/:articleTitle")

.get(function(req,res){
    async function find(){
      let result = await Article.findOne({title: req.params.articleTitle});
      if (result){
        res.send(result);
      }
      else{
        res.send("No articles was found.");
      }
    }
    find();
})

.post(function(req,res){
  async function replace(){
    await Article.replaceOne({title: req.params.articleTitle},{title: req.body.title, content: req.body.content});
    res.send("Successfully updated the article");
  }
  replace();
})

.patch(function(req,res){
  async function update(){
    await Article.updateOne({title: req.params.articleTitle}, {$set: req.body});
    res.send("Successfully updated the article");
  }
  update();
})

.delete(function(req,res){
  async function deleteArticle(){
    let result = await Article.deleteOne({title: req.params.articleTitle});
    if (result.deletedCount === 1){
      res.send("The article was successfully deleted.");
    }
    else{
      res.send("Something went wrong");
    }
  }
  deleteArticle();
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
})
