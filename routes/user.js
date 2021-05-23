const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/user/:id", requireLogin, (req, res) => {
	User.findOne({ _id: req.params.id })
		.select("-password")
		.then((user) => {
			Post.find({ postedBy: req.params.id })
				.populate("postedBy", "_id name")
				.populate("comments.postedBy", "_id name")
				.sort("-createdAt")
				.exec((err, posts) => {
					if (err) return res.status(422).json({ error: err });
					res.json({ user, posts });
				});
		})
		.catch((err) => res.status(404).json({ error: "User not found" }));
});

router.put("/follow", requireLogin, (req, res) => {
	User.findByIdAndUpdate(
		req.body.followid,
		{
			$push: { followers: req.user._id },
		},
		{
			new: true,
		},
		(err, result) => {
			if (err) res.status(422).json({ error: err });
			User.findByIdAndUpdate(
				req.user._id,
				{
					$push: { following: req.body.followid },
				},
				{
					new: true,
				}
			)
				.select("-password")
				.then((result) => res.json(result))
				.catch((err) => res.status(422).json(err));
		}
	);
});

router.put("/unfollow", requireLogin, (req, res) => {
	User.findByIdAndUpdate(
		req.body.unfollowid,
		{
			$pull: { followers: req.user._id },
		},
		{
			new: true,
		},
		(err, result) => {
			if (err) res.status(422).json({ error: err });
			User.findByIdAndUpdate(
				req.user._id,
				{
					$pull: { following: req.body.unfollowid },
				},
				{
					new: true,
				}
			)
				.select("-password")
				.then((result) => res.json(result))
				.catch((err) => res.status(422).json(err));
		}
	);
});

router.put("/updatepic", requireLogin, (req, res) => {
	User.findByIdAndUpdate(
		req.user._id,
		{ $set: { pic: req.body.pic } },
		{ new: true },
		(err, result) => {
			if (err) res.status(422).json({ error: "pic cannot be posted" });
			res.json(result);
		}
	);
});

router.put("/EditProfile", requireLogin, (req, res) => {
	const { name, email, password } = req.body;
	console.log(name, email, password);
	if (!email || !password || !name)
		return res.status(422).json({
			error: "please add all the fields",
		});
	User.findOne({ email: email })
		.then((savedUser) => {
			if (savedUser) return res.json({ error: "user already exists" });
			bcrypt
				.hash(password, 12)
				.then((hashedpassword) => {
					User.findByIdAndUpdate(
						req.user._id,
						{
							$set: {
								name: req.body.name,
								email: req.body.email,
								password: hashedpassword,
							},
						},
						{ new: true },
						(err, result) => {
							if (err) res.status(422).json({ error: "cannot update profile" });
							res.json(result);
						}
					);
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
});

router.delete("/deleteprofile/:profileId", requireLogin, (req, res) => {

	User.findOne({ _id: req.params.profileId }).exec((err, user) => {
		if (err || !user) {
			return res.status(422).json({ error: err });
		}
		if (user._id.toString() === req.user._id.toString()) {
			User.findByIdAndDelete(user._id)
				.then((result) => {
					Post.deleteMany({ postedBy: result._id }, (err) => {
						if (err) console.log(err);
						else res.json({ message: "success" });
					});
				})
				.catch((err) => console.log(err));
		}
	});
});

router.post("/search-users", (req, res) => {
	let userPattern = new RegExp("^" + req.body.query);
	User.find({ name: { $regex: userPattern } })
		.select(" _id name")
		.then((user) => {
			res.json({ user });
		})
		.catch((err) => console.log(err));
});


module.exports = router;
