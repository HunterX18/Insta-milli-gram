import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
const Profile = () => {
	const [mypics, setPics] = useState([]);
	const { state, dispatch } = useContext(UserContext);
	console.log(state);
	const [image, setImage] = useState("");
	useEffect(() => {
		fetch("/myposts", {
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwt"),
			},
		})
			.then((res) => res.json())
			.then((result) => setPics(result.myposts));
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
				const newData = mypics.map((item) => {
					if (item._id == result._id)
						// return { ...item, likes: result.likes, comments: result.comments };
						return result;
					else return item;
				});
				setPics(newData);
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
				const newData = mypics.map((item) => {
					if (item._id == result._id)
						// return { ...item, likes: result.likes, comments: result.comments };
						return result;
					else return item;
				});
				setPics(newData);
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
				const newData = mypics.map((item) => {
					if (item._id == result._id)
						// return { ...item, likes: result.likes, comments: result.comments };
						return result;
					else return item;
				});
				setPics(newData);
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
				const newData = mypics.filter((item) => {
					return item._id != result._id;
				});
				setPics(newData);
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
				const newData = mypics.map((item) => {
					if (item._id == result._id)
						// return { ...item, likes: result.likes, comments: result.comments };
						return result;
					else return item;
				});
				setPics(newData);
			})
			.catch((err) => console.log(err));
	};
	return (
		<div style={{ maxWidth: "50%", margin: "0px auto" }}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					margin: "18px 0px",
					// background: "green",
					borderBottom: "1px solid grey",
				}}
			>
				<div style={{ display: "flex", justifyContent: "center" }}>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							marginRight: "40px",
						}}
					>
						<img
							style={{
								width: "160px",
								height: "160px",
								borderRadius: "80px",
								marginBottom: "10px",
							}}
							src={state ? state.pic : "loading"}
						/>
					</div>
					<div>
						<h4>{state ? state.name : "loading"}</h4>
						<h5>{state ? state.email : "loading"}</h5>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								width: "108%",
							}}
						>
							<h6>{mypics.length} posts</h6>
							{state && (
								<>
									{state.followers.length ? (
										<Link to={`/Followers/${state._id}`}>
											<h6>{state.followers.length} followers</h6>
										</Link>
									) : (
										<h6>0 followers</h6>
									)}
									{/* <Link to={`/Followers/${state._id}`}>
										<h6>{state ? state.followers.length : "0 "} followers</h6>
									</Link> */}
									{state.following.length ? (
										<Link to={`Following/${state._id}`}>
											<h6>{state.following.length} following</h6>
										</Link>
									) : (
										<h6>0 following</h6>
									)}
									{/* <Link to={`Following/${state._id}`}>
										<h6>{state ? state.following.length : "0 "} following</h6>
									</Link> */}
								</>
							)}
						</div>
					</div>
				</div>
				<Link to="/EditProfile">
					<button
						style={{ marginBottom: "10px", marginLeft: "190px" }}
						className="btn waves-effect waves-light #1e88e5 blue darken-1"
					>
						Edit Profile
					</button>
				</Link>
			</div>

			<div className="home">
				{mypics.map((item) => {
					return (
						<div className="card home-card" key={item._id}>
							<img
								src={item.postedBy.pic}
								style={{
									width: "40px",
									height: "40px",
									borderRadius: "50%",
									float: "left",
									margin: "5px",
								}}
							></img>
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
												marginLeft: "-5px",
												// background:"grey",
												width: "100%",
												display: "flex",
												justifyContent: "left",
												alignItems: "center",
											}}
										>
											<i
												className="material-icons"
												style={{ marginRight: "10px" }}
												onClick={() => {
													unlikePost(item._id);
												}}
											>
												thumb_down
											</i>
											<h6>{item.likes.length} likes</h6>
											<i
												className="material-icons"
												style={{ marginLeft: "20px", marginRight: "10px" }}
											>
												message
											</i>
											<h6>{item.comments.length} comments</h6>
										</div>
									) : (
										<div
											className="likes"
											style={{
												marginLeft: "-5px",
												// background:"grey",
												width: "100%",
												display: "flex",
												justifyContent: "left",
												alignItems: "center",
											}}
										>
											<i
												className="material-icons"
												style={{ marginRight: "10px" }}
												onClick={() => {
													likePost(item._id);
												}}
											>
												thumb_up
											</i>
											<h6>{item.likes.length} likes</h6>
											<i
												className="material-icons"
												style={{ marginLeft: "20px", marginRight: "10px" }}
											>
												message
											</i>
											<h6>{item.comments.length} comments</h6>
										</div>
									)}

									<h6>{item.title}</h6>
									<p>{item.body}</p>
									{item.comments.map((record) => {
										return (
											<h6 key={record._id}>
												<div style={{ display: "flex", marginBottom: "5px" }}>
													<img
														src={record.postedBy.pic}
														style={{
															width: "20px",
															borderRadius: "50%",
															marginRight: "5px",
														}}
													></img>
													<span
														style={{ fontWeight: "500", fontSize: "large" }}
													>
														{record.postedBy.name}
													</span>
												</div>
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
		</div>
	);
};

export default Profile;
