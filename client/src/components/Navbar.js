import React, { useContext, useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
const Navbar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState([]);
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        <li key="2">
          <Link to="/Profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/Create">Create Post</Link>
        </li>,
        <li key="4">
          <Link to="/Myfollowedposts">Explore</Link>
        </li>,
        <li key="5">
          <Link to="/Signin">
            <button
              className="btn waves-effect waves-light #1e88e5 blue darken-1"
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                // history.push("/Singin");
                // window.location.reload();
              }}
            >
              SignOUT
            </button>
          </Link>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/Signin">SignIn</Link>
        </li>,
        <li key="7">
          <Link to="/Signup">SignUp</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserDetails(result.user);
      });
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          IIIT BBSR
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul className="collection">
            {userDetails.map((item) => {
              return (
                <Link
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/Profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("");
                  }}
                >
                  <li className="collection-item" style={{ color: "black" }}>
                    {item.name}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
