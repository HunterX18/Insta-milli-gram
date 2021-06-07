import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";
const Following = () => {
	const { state, dispatch } = useContext(UserContext);

	// console.log(state);

	const { id } = useParams();
	const [followings, setFollowings] = useState([]);
	useEffect(() => {
		fetch(`/getFollowing/${id}`)
			.then((res) => res.json())
			.then((data) => setFollowings(data))
			.catch((err) => console.log(err));
	}, []);

	const removeFollowing = (removeId) => {
		fetch(`/removeFollowing/${id}`, {
			method: "put",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ removeId }),
		})
			.then((res) => res.json())
			.then((data) => {
				// console.log(data);
				const newFollowing = followings.filter(
					(following) => following._id != data
				);
				// console.log(newFollowing);
				setFollowings(newFollowing);
				dispatch({
					type: "UPDATE",
					payload: {
						following: newFollowing,
						followers: state.followers,
					},
				});
			})
			.catch((err) => console.log(err));
	};

	console.log(state);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{followings &&
				followings.map((following) => {
					return (
						<div
							style={{
								width: "500px",
								display: "flex",
								padding: "5px",
								border: "solid grey",
								justifyContent: "center",
							}}
							key={following._id}
						>
							<img
								src={following.pic}
								style={{ width: "180px", borderRadius: "50%", padding: "20px" }}
							/>
							<div style={{ padding: "20px" }}>
								<h4>{following.name}</h4>
								<h6>{following.email}</h6>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										width: "108%",
									}}
								>
									{/* <h6>{following!=='undefined' ? following.followings.length : 0} followings</h6>
								<h6>{following!=='undefined' ? following.following.length : 0} following</h6> */}
								</div>
								<button
									className="btn waves-effect waves-light #1e88e5 red darken-1"
									style={{ marginLeft: "10px", fontSize: "15px" }}
									onClick={() => removeFollowing(following._id)}
								>
									Remove
								</button>
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default Following;
