const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requireLogin = require("../middleware/requireLogin");

router.post("/signup", (req, res) => {
	const { name, email, password, pic } = req.body;
	if (!email || !password || !name)
		return res.status(422).json({
			error: "please add all the fields",
		});
	User.findOne({ email }).then((savedUser) => {
		if (savedUser) return res.json({ error: "user already exists" });

		User.findOne({ name })
			.then((anothersaved) => {
				if (anothersaved) return res.json({ error: "user already exists" });

				bcrypt.hash(password, 12).then((hashedpassword) => {
					const user = new User({
						name,
						email,
						password: hashedpassword,
						pic,
					});
					user
						.save()
						.then((user) => {
							res.json({ message: "saved successfully" });
						})
						.catch((err) => console.log(err));
				});
			})
			.catch((err) => console.log(err));
	});
});

router.post("/signin", (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res.status(422).json({ error: "please add email or password" });
	User.findOne({ email: email }).then((savedUser) => {
		if (!savedUser)
			return res.status(422).json({ error: "wrong email or password" });
		bcrypt
			.compare(password, savedUser.password)
			.then((doesMatch) => {
				if (doesMatch) {
					const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
					const { _id, name, email, followers, following, pic } = savedUser;
					res.json({
						token,
						user: { _id, name, email, followers, following, pic },
					});
				} else return res.json({ error: "wrong email or password" });
			})
			.catch((err) => console.log(err));
	});
});

module.exports = router;
