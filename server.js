import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import Pusher from "pusher";
import Modal from "./dbModel.js";

// app config
const app = express();
const port = process.env.PORT || 8000;
const pusher = new Pusher({
    appId: "1297045",
    key: "f3560890e5045a628894",
    secret: "ac39fcf17a68f4cab060",
    cluster: "ap2",
    useTLS: true,
});

// middlewares
app.use(express.json());
app.use(cors());

//db config
const connection_url = "YOUR MONGO DB URL";
mongoose.connect(connection_url);
mongoose.connection.once("open", () => {
    console.log("Connected to db");
    const changeStream = mongoose.connection.collection("posts").watch();
    changeStream.on("change", (change) => {
        console.log("Change triggered");
        console.log(change);
        console.log("Change ended");
        if (change.operationType === "insert") {
            const postDetail = change.fullDocument;
            pusher.trigger("posts", "inserted", {
                username: postDetail.username,
                postCaption: postDetail.postCaption,
                postImage: postDetail.postImage,
            });
        } else {
            console.log("Something else");
        }
    });
});

// end points
app.post("/post", (req, res) => {
    const dbPost = req.body;
    Modal.create(dbPost, (err, data) => {
        if (err) return res.status(500).send(err);
        res.status(201).send(data);
    });
});
app.get("/post", (req, res) => {
    Modal.find((err, data) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(data);
    });
});

// listener
app.listen(port, () => console.log(`Listening on localhost:${port}`));
