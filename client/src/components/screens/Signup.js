import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [image, setImage] = useState("");
	const [url, setUrl] = useState(undefined);
	const history = useHistory();
	// const filter = /^([w-]+(?:.[w-]+)*)@((?:[w-]+.)*w[w-]{0,66}).([com net org]{3}(?:.[a-z]{6})?)$/i;
	useEffect(() => {
		if (url) uploadFields();
	}, [url]);

	const uploadPic = () => {
		const data = new FormData();
		data.append("file", image);
		data.append("upload_preset", "insta-clone");
		data.append("cloud_name", "instahunterx");
		fetch("https://api.cloudinary.com/v1_1/instahunterx/image/upload", {
			method: "post",
			body: data,
		})
			.then((res) => res.json())
			.then((data) => setUrl(data.url))
			.catch((err) => console.log(err));
	};

	const uploadFields = () => {
		fetch("/Signup", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				email,
				password,
				pic: url,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error)
					M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
				else {
					M.toast({ html: data.message, classes: "#43a047 green darken-1" });
					history.push("/Signin");
				}
			})
			.catch((err) => console.log(err));
	};

	const PostData = () => {
		// if (!filter.test(email)) {
		//   M.toast({ html: "Enter valid email", classes: "#b71c1c red darken-4" });
		//   return;
		// }
		if (image) uploadPic();
		else uploadFields();
	};

	return (
		<div className="mycard">
			<div className="card auth-card input-field">
				<h2>IIIT BBSR</h2>
				<input
					type="text"
					placeholder="Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<input
					type="text"
					placeholder="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<div className="file-field input-field">
					<div className="btn #1e88e5 blue darken-1">
						<span>Upload Pic</span>
						<input type="file" onChange={(e) => setImage(e.target.files[0])} />
					</div>
					<div className="file-path-wrapper">
						<input className="file-path validate" type="text" />
					</div>
				</div>
				<button
					className="btn waves-effect waves-light #1e88e5 blue darken-1"
					onClick={PostData}
				>
					SignUP
				</button>
				<h5>
					<Link to="/Signin">Already have an account?</Link>
				</h5>
			</div>
		</div>
	);
};

export default Signup;
