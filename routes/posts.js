const router = require("express").Router();


const users = require("../models/user");

const Post = require("../models/post");


//create
router.post("/", async (req, res) => {

    const newpost = new Post(req.body);
    try {
        const savedpost = await newpost.save();
        res.status(200).json(savedpost);
    } catch (err) {
        res.status(500).json(err)
    }

});

//update
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.username === req.body.username) {
            try {
                const updatedpost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                }, { new: true })

                res.status(200).json(updatedpost)
            } catch (err) {
                res.status(500).json(err)
            }

        } else {
            res.status(401).json("You can update only your post")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//delete
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.username === req.body.username) {
            try {
                await post.delete();

                res.status(200).json("post has been deleted")
            } catch (err) {
                res.status(500).json(err)
            }

        } else {
            res.status(401).json("You can delete only your post")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
})

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.param.id);

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err)
    }
});

router.get("/", async (req, res) => {

    const username = req.query.users;
    const catname = req.query.cat;
    try {
        let posts;

        if (username) {
            posts = await Post.find({ username })
        } else if (catname) {
            posts = await Post.find({
                categories:
                {
                    $in: [catname]
                }
            });
        } else {
            posts = await Post.find();
        }
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router