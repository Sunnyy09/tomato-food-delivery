import React, { useContext, useState } from "react";
import "./Login-Signup.css";
import { assets } from "../../assets/assets";
import { useStoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthContext } from "../../Context/AuthContext";
import { apiURL } from "../../../constants/backendUrl";

const AccountAccess = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Sign Up");

  const { setAuthUser } = useAuthContext();
  const { setToken, loadCartData } = useStoreContext();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();

    let newUrl = apiURL;
    currState === "Login"
      ? (newUrl += "/api/auth/login")
      : (newUrl += "/api/auth/register");

    try {
      const response = await axios.post(newUrl, data);
      if (response.data) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setAuthUser(response.data.response);
        loadCartData({ token: response.data.token });
        setShowLogin(false);
      }
      toast.success(response.data.message);
    } catch (error) {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>{" "}
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" ? (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          ) : (
            <></>
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button>{currState === "Login" ? "Login" : "Create account"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" name="" id="" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default AccountAccess;
