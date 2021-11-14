import mongoose from "mongoose";

const instance = mongoose.Schema({
    postCaption: String,
    username: String,
    postImage: String,
    comments: [],
});

export default mongoose.model("posts", instance);
