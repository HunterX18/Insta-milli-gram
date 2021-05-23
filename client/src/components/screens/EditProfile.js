import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  const EditFields = () => {
    fetch("EditProfile", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          M.toast({ html: result.error, classes: "#b71c1c red darken-4" });
        } else {
          M.toast({
            html: "Edited successfully ",
            classes: "#43a047 green darken-1",
          });
          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, name, email, password })
          );
          dispatch({
            type: "UPDATEPROFILE",
            payload: { name, email, password },
          });
          history.push("/Profile");
        }
      })
      .catch((err) => console.log(err));
  };

  const updatePhoto = (file) => {
    setImage(file);
  };
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "instahunterx");
      fetch("https://api.cloudinary.com/v1_1/instahunterx/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              // window.location.reload();
            });
        })
        .catch((err) => console.log(err));
    }
  }, [image]);

  const DeleteFields = (profileId) => {
    // console.log(profileid);
    fetch(`/deleteprofile/${profileId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="mycard" style={{display:"flex", flexDirection:"column"}}>
      <div className="card auth-card input-field">
        <h2>EDIT PROFILE</h2>
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
        <div
          className="update-pic"
          style={{
            marginTop: "5px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h6>Update Pic:</h6>
          <input
            type="file"
            style={{ marginTop: "5px" }}
            onChange={(e) => updatePhoto(e.target.files[0])}
          />
        </div>
        <button
          className="btn waves-effect waves-light #1e88e5 blue darken-1"
          style={{ marginTop: "10px" }}
          onClick={EditFields}
        >
          Edit Profile
        </button>
      </div>
        <Link to="/Signup">
          <button
            className="btn waves-effect waves-light #1e88e5 red darken-1"
            style={{ marginTop: "50px", marginLeft: "10px" }}
            onClick={() => DeleteFields(state._id)}
          >
            Delete Profile
          </button>
        </Link>
    </div>
  );
};

export default EditProfile;
