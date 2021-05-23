import React, { useEffect, createContext, useReducer, useContext } from "react";
import NavBar from "./components/Navbar";
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "../src/components/screens/Home";
import Profile from "../src/components/screens/Profile";
import Signin from "../src/components/screens/Signin";
import Signup from "../src/components/screens/Signup";
import CreatePost from "../src/components/screens/CreatePost";
import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from './components/screens/UserProfile'
import FollowedPosts from './components/screens/FollowedPosts'
import EditProfile from './components/screens/EditProfile'

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else history.push("/Signin");
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/Signin">
        <Signin />
      </Route>
      <Route path="/Signup">
        <Signup />
      </Route>
      <Route exact path="/Profile">
        <Profile />
      </Route>
      <Route path="/Create">
        <CreatePost />
      </Route>
      <Route path="/Profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/Myfollowedposts">
        <FollowedPosts />
      </Route>
      <Route path="/EditProfile">
        <EditProfile />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
