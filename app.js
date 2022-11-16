const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const dbutils = require("./dbutils");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  dbutils.getBlogItems().then((blogItems) => {
    res.render("home", { homeContent: homeStartingContent, posts: blogItems });
  });
})

app.post("/del", function (req, res) {
  if (req.body.Delete == "true") {
    dbutils.deleteBlogItem(_.lowerCase(req.body.Title))
      .then((a) => res.redirect("/"));
  }
  else {
    res.redirect("/");
  }
});



app.route("/about")
  .get(function (req, res) {
    res.render("about", { aboutContent: aboutContent });
  });

app.route("/contact")
  .get(function (req, res) {
    res.render("contact", { contactContent: contactContent });
  });

app.route("/compose")
  .get(function (req, res) {
    res.render("compose");
  })
  .post(function (req, res) {
    const post = {
      title: req.body.postTitle,
      content: req.body.postBody
    };
    dbutils.addBlogItem(post);
    res.redirect("/");
  });

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);
  dbutils.getBlogItem(requestedTitle).then((post) => {
    if (post) {
      res.render("post", { post: { title: post.title, content: post.content } });
    }
    else {
      res.status(404).send("Post not found");
    }
  });
});






async function main() {
  console.log("Connecting to MongoDB...");
  if (process.argv[2] != null) {
    await dbutils.connect({ type: "remote", user: process.argv[2], password: process.argv[3] });
  }
  else { await dbutils.connect({ type: "local" }); }
  app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port " + (process.env.PORT || 3000));
  });
}

main().then((a) => console.log("Done!")).catch((err) => console.log(err));

