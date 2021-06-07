import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";
const Followers = () => {
	const { state, dispatch } = useContext(UserContext);
	const { id } = useParams();
	const [followers, setFollowers] = useState([]);

	useEffect(() => {
		fetch(`/getFollowers/${id}`)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setFollowers(data);
			})
			.catch((err) => console.log(err));
	}, []);

	const removeFollower = (removeId) => {
		fetch(`/removeFollower/${id}`, {
			method: "put",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ removeId }),
		})
			.then((res) => res.json())
			.then((data) => {
				const newFollowers = followers.filter(
					(follower) => follower._id != data
				);
				setFollowers(newFollowers);
				dispatch({
					type: "UPDATE",
					payload: {
						following: state.following,
						followers: newFollowers,
					},
				});
			})
			.catch((err) => console.log(err));
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{followers &&
				followers.map((follower) => {
					return (
						<div
							style={{
								width: "500px",
								display: "flex",
								padding: "5px",
								border: "solid grey",
								justifyContent: "center",
							}}
						>
							<img
								src={follower.pic}
								style={{ width: "180px", borderRadius: "50%", padding: "20px" }}
							/>
							<div style={{ padding: "20px" }}>
								<h4>{follower.name}</h4>
								<h6>{follower.email}</h6>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										width: "108%",
									}}
								></div>
								<button
									className="btn waves-effect waves-light #1e88e5 red darken-1"
									style={{ marginLeft: "10px", fontSize: "15px" }}
									onClick={() => removeFollower(follower._id)}
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

export default Followers;
