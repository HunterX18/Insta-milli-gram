import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";

const Signin = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  // const filter = /^([w-]+(?:.[w-]+)*)@((?:[w-]+.)*w[w-]{0,66}).([com net org]{3}(?:.[a-z]{6})?)$/i;
  const PostData = () => {
    // if (!filter.test(email)) {
    //   M.toast({ html: "Enter valid email", classes: "#b71c1c red darken-4" });
    //   return;
    // }
    fetch("/Signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.error)
          M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
        else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "successfully signed in",
            classes: "#43a047 green darken-1",
          });
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>IIIT BBSR</h2>
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
        <button
          className="btn waves-effect waves-light #1e88e5 blue darken-1"
          onClick={PostData}
        >
          Signin
        </button>
        <h5>
          <Link to="/Signup">Don't have an account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signin;
