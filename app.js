const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikiDB",{useNewUrlParser: true,useUnifiedTopology: true},(err) => {
    if(!err) {
        console.log("Database connect sucessfully!");
    }
});

const WikiSchema = mongoose.Schema({
    title: String,
    content: String
})

const WikiModel = mongoose.model("articles",WikiSchema);


app.get("/",(req,res) => {
    res.send("Hello,World!");
})

app.route("/articles")
.get((req,res) => {
    WikiModel.find({},(err,articles) => {
        if(!err) {
            res.json(articles);
        }
        else {
            res.send("You have some errors---->",err);
        }
    })
})
.post((req,res) => {
    const PostData = new WikiModel({
        title: req.body.title,
        content: req.body.content
    })

    PostData.save((err,product) => {
        if(!err) {
            // res.sendStatus(200);
            res.send("product is saved in database")
        }
        else {
            // res.sendStatus(404);
            res.send("We face some kind of error Please try again",404);
        }
    })
})
.delete((req,res) => {
    WikiModel.deleteMany({},(err) => {
        if(!err) {
            // res.sendStatus(200);
            res.send("Data deleted sucessfully");
        }
        else {
            // res.sendStatus(404);
            res.send("We face some kind of error Please try again");
        }
    })
});

app.route("/articles/:query")
.get((req,res) => {
    // console.log(req.params.query);
    const singleArtile = req.params.query;
    WikiModel.findOne({title: singleArtile},(err,getDocument) => {
        if(!err) {
            res.json(getDocument);
        }
        else {
            res.send("404 and error occur");
        }
    })
})
.put(async (req,res) => {

    // Both ways are work fine

    // const UpdatedData = await WikiModel.update({title: req.params.query},{title: "Hello,World!",content: "Let's see What the heck is going here."},{overwrite: true},(err,updatedValue) => {
    //     if(!err) {
    //         res.send("Data update sucessfully now you can take a break if you want!");
    //     }
    //     else {
    //         res.send("An unexpected error occur please do some work");
    //     }
    // })

   const UpdatedData = await WikiModel.findOneAndUpdate({title: req.params.query},{title: req.body.title,content: req.body.content},(err,updatedValue) => {
       if(!err) {
           res.send("Data update sucessfully now you can take a break if you want!");
       }
       else {
           res.send("An unexpected error occur please do some work");
       }
   })
})
.patch( (req,res) => {
    console.log(req.body.title)
    WikiModel.updateOne({title: req.params.query},{$set: {title: req.body.title}},(err,docs) => {
        if(!err) {
            res.send("field update sucessfully now you can take a break if you want!");
        }
        else {
            res.send(err);
        }
    })
})

.delete(async (req,res) => {
    await WikiModel.deleteOne({title: req.params.query},(err) => {
        if(!err) {
            res.send("document deleted sucessfully!");
        }
        else {
            res.send("Go fuck and debugg yourself!");
        }
    })
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});