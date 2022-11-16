const mongoose = require("mongoose");
const _ = require("lodash");
exports.connect =
    async function (options) {
        if (options.type === "local") {
            await mongoose.connect("mongodb://127.0.0.1:27017/blogDB")
                .then((a) => console.log("Connected to local MongoDB..."))
                .catch((err) => console.log(err));
            mongoose.connection.on("error", console.error.bind(console, "connection error:"));
        }
        else {
            await mongoose.connect(`mongodb+srv://${options.user}:${options.password}@cluster0.mvgwpdk.mongodb.net/todolistDB?retryWrites=true&w=majority`)
                .then((a) => { console.log("Connected to remote MongoDB...") });
            mongoose.connection.on("error", console.error.bind(console, "connection error:"));
        }
    }

const blogItem = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    lowerCaseTitle: {
        type: String,
        required: true
    },
    content: String
});
const BlogItem = mongoose.model("BlogItem", blogItem);
exports.addBlogItem = async function (newBlogItem) {
    const blogItem = new BlogItem(
        {
            title: newBlogItem.title,
            lowerCaseTitle: _.lowerCase(newBlogItem.title),
            content: newBlogItem.content
        }
    );
    await blogItem.save();
}

exports.getBlogItems = async function () {
    return await BlogItem.find();
}
exports.getBlogItem = async function (lctitle) {
    return await BlogItem.findOne({ lowerCaseTitle: lctitle });
}

exports.deleteBlogItem = async function (lctitle) {
    return await BlogItem.deleteOne({ lowerCaseTitle: lctitle });
}