import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const Home = () => {
	const [data, setData] = useState([]);
	const { state } = useContext(UserContext);
	useEffect(() => {
		fetch("/getfollowedposts", {
			headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
		})
			.then((res) => res.json())
			.then((result) => {
				// console.log(result);
				setData(result.posts);
			});
	}, []);

	const likePost = (id) => {
		fetch("/like", {
			method: "put",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwt"),
			},
			body: JSON.stringify({
				postId: id,
			}),
		})
			.then((res) => res.json())
			.then((result) => {
				const newData = data.map((item) => {
					if (item._id == result._id)
						// return { ...item, likes: result.likes, comments: result.comments };
						return result;
					else return item;
				});
				setData(newData);
			})
			.catch((err) => console.log(err));
	};
	const unlikePost = (id) => {
		fetch("/unlike", {
			method: "put",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwt"),
			},
			body: JSON.stringify({
				postId: id,
			}),
		})
			.then((res) => res.json())
			.then((result) => {
				const newData = data.map((item) => {
					if (item._id == result._id)
						// return { ...item, likes: result.likes, comments: result.comments };
						return result;
					else return item;
				});
				setData(newData);
			})
			.catch((err) => console.log(err));
	};

	const makeComment = (text, postId) => {
		fetch("/comment", {
			method: "put",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwt"),
			},
			body: JSON.stringify({
				postId,
				text,
			}),
		})
			.then((res) => res.json())
			.then((result) => {
				const newData = data.map((item) => {
					if (item._id == result._id)
						// return { ...item, likes: result.likes, comments: result.comments };
						return result;
					else return item;
				});
				setData(newData);
				// console.log(result);
			})
			.catch((err) => console.log(err));
	};

	const deletePost = (postid) => {
		fetch(`/deletepost/${postid}`, {
			method: "delete",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwt"),
			},
		})
			.then((res) => res.json())
			.then((result) => {
				// console.log(result);
				const newData = data.filter((item) => {
					return item._id != result._id;
				});
				setData(newData);
			})
			.catch((err) => console.log(err));
	};

	const deleteComment = (postid, commentid) => {
		fetch(`/deletecomment/${postid}/${commentid}`, {
			method: "delete",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwt"),
			},
		})
			.then((res) => res.json())
			.then((result) => {
				const newData = data.map((item) => {
					if (item._id == result._id)
						// return { ...item, likes: result.likes, comments: result.comments };
						return result;
					else return item;
				});
				setData(newData);
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="home">
			{data.map((item) => {
				return (
					<div className="card home-card" key={item._id}>
						<h5 style={{ padding: "6px" }}>
							<Link
								to={
									item.postedBy._id !== state._id
										? "Profile/" + item.postedBy._id
										: "Profile/" + state._id
								}
							>
								{item.postedBy.name}
							</Link>
							{item.postedBy._id == state._id && (
								<i
									className="material-icons"
									style={{ float: "right" }}
									onClick={() => deletePost(item._id)}
								>
									delete
								</i>
							)}
						</h5>
						<div className="card-image">
							<img src={item.photo} alt="image" />
							<div className="card-content">
								{item.likes.includes(state._id) ? (
									<div
										className="likes"
										style={{
											marginLeft: "-20px",
											// background:"grey",
											width: "100px",
											display: "flex",
											justifyContent: "space-evenly",
											alignItems: "center",
										}}
									>
										<i
											className="material-icons"
											onClick={() => {
												unlikePost(item._id);
											}}
										>
											thumb_down
										</i>
										<h6>{item.likes.length} likes</h6>
									</div>
								) : (
									<div
										className="likes"
										style={{
											marginLeft: "-20px",
											// background:"grey",
											width: "100px",
											display: "flex",
											justifyContent: "space-evenly",
											alignItems: "center",
										}}
									>
										<i
											className="material-icons"
											onClick={() => {
												likePost(item._id);
											}}
										>
											thumb_up
										</i>
										<h6>{item.likes.length} likes</h6>
									</div>
								)}

								<h6>{item.title}</h6>
								<p>{item.body}</p>
								{item.comments.map((record) => {
									return (
										<h6 key={record._id}>
											<span style={{ fontWeight: "500", fontSize: "large" }}>
												{record.postedBy.name}
											</span>
											<br />
											{record.text}
											{(item.postedBy._id == state._id ||
												record.postedBy._id == state._id) && (
												<i
													className="material-icons"
													style={{ float: "right" }}
													onClick={() => {
														deleteComment(item._id, record._id);
													}}
												>
													delete
												</i>
											)}
										</h6>
									);
								})}
								<form
									onSubmit={(e) => {
										e.preventDefault();
										makeComment(e.target[0].value, item._id);
										e.target[0].value = "";
									}}
								>
									<input type="text" placeholder="add a comment" />
								</form>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Home;
