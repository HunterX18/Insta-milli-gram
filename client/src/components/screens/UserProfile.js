import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams, Link } from "react-router-dom";
const Profile = () => {
	const [userProfile, setProfile] = useState(null);
	const [data, setData] = useState([]);
	const { state, dispatch } = useContext(UserContext);
	const { userid } = useParams();
	const [showFollow, setShowFollow] = useState(
		state ? !state.following.includes(userid) : true
	);
	useEffect(() => {
		fetch(`/user/${userid}`, {
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwt"),
			},
		})
			.then((res) => res.json())
			.then((result) => {
				// console.log(result);
				setProfile(result);
			});
	}, []);

	useEffect(() => {
		fetch(`/profileposts/${userid}`, {
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwt"),
			},
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
						return result;
					else return item;
				});
				setData(newData);
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
						return result;
					else return item;
				});
				setData(newData);
			})
			.catch((err) => console.log(err));
	};

	const followUser = () => {
		fetch("/follow", {
			method: "put",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwt"),
			},
			body: JSON.stringify({
				followid: userid,
			}),
		})
			.then((res) => res.json())
			.then((userProfile) => {
				// console.log(userProfile);
				dispatch({
					type: "UPDATE",
					payload: {
						following: userProfile.following,
						followers: userProfile.followers,
					},
				});
				localStorage.setItem("user", JSON.stringify(userProfile));
				setProfile((prevState) => {
					return {
						...prevState,
						user: {
							...prevState.user,
							followers: [...prevState.user.followers, userProfile._id],
						},
					};
				});
				setShowFollow(false);
			});
	};
	const unfollowUser = () => {
		fetch("/unfollow", {
			method: "put",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwt"),
			},
			body: JSON.stringify({
				unfollowid: userid,
			}),
		})
			.then((res) => res.json())
			.then((userProfile) => {
				console.log(userProfile);
				dispatch({
					type: "UPDATE",
					payload: {
						following: userProfile.following,
						followers: userProfile.followers,
					},
				});
				localStorage.setItem("user", JSON.stringify(userProfile));
				setProfile((prevState) => {
					const newFollowers = prevState.user.followers.filter(
						(item) => item != userProfile._id
					);
					return {
						...prevState,
						user: {
							...prevState.user,
							followers: newFollowers,
						},
					};
				});
				setShowFollow(true);
			});
	};

	return (
		<>
			{userProfile ? (
				<div style={{ maxWidth: "70%", margin: "0px auto" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							margin: "18px 0px",
							// background: "green",
							borderBottom: "1px solid grey",
						}}
					>
						<div>
							<img
								style={{
									width: "160px",
									height: "160px",
									borderRadius: "80px",
									marginRight: "40px",
								}}
								src={userProfile.user.pic}
							/>
						</div>
						<div>
							<h4>{userProfile.user.name}</h4>
							<h5>{userProfile.user.email}</h5>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									width: "108%",
								}}
							>
								<h6>{userProfile.posts.length} posts</h6>
								<h6>{userProfile.user.followers.length} followers</h6>
								<h6>{userProfile.user.following.length} following</h6>
							</div>
							{showFollow ? (
								<button
									style={{ margin: "10px" }}
									className="btn waves-effect waves-light #1e88e5 blue darken-1"
									onClick={followUser}
								>
									follow
								</button>
							) : (
								<button
									style={{ margin: "10px" }}
									className="btn waves-effect waves-light #1e88e5 blue darken-1"
									onClick={unfollowUser}
								>
									unfollow
								</button>
							)}
						</div>
					</div>
					<div className="home">
						{data.map((item) => {
							return (
								<div className="card home-card" key={item._id}>
									<img
										src={item.postedBy.pic}
										style={{
											width: "40px",
											height:"40px",
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
											<h6>{item.title}</h6>
											<p>{item.body}</p>
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

											{item.comments.map((record) => {
												// console.log(record);
												return (
													<h6 key={record._id}>
														<div
															style={{ display: "flex", marginBottom: "5px" }}
														>
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
			) : (
				<h2>loading</h2>
			)}
		</>
	);
};

export default Profile;
