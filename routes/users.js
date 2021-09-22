const router = require("express").Router();


const users = require("../models/user");

const Post = require("../models/post");

const bcrypt = require("bcrypt");



//edit
router.put("/:id", async (req, res) => {

    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)

            req.body.password = await bcrypt.hash(req.body.password, salt)
        }

        try {

            const updateduser = await users.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json(updateduser)
        } catch (err) {

            res.status(500).json(err)
        }
    } else {
        res.status(401).json("You can updated only user account");
    }
});

//delete
router.delete("/:id", async (req, res) => {

    if (req.body.userId === req.params.id) {
        try {

            const user = await users.findById(req.params.id);

            try {
                await Post.deleteMany({ username: user.username })

                await users.findByIdAndDelete(req.params.id)
                res.status(200).json("user has been deleted")
            } catch (err) {

                res.status(500).json(err)
            }
        } catch (err) {
            res.status(404).json("user not found")
        }
    } else {
        res.status(401).json("You can delete only user account");
    }
})

//get 

router.get("/:id", async (req, res) => {
    try {
        const user = await users.findById(req.param.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router