import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import Layout from "../components/Layout";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
import { API } from "../config";
import { authenticate, isAuth } from "../helpers/auth";

const Login = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: "",
    buttonText: "Login",
  });

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  const { name, email, password, error, success, buttonText } = state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Login",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Login" });
    try {
      const response = await axios.post(`${API}/login`, {
        email,
        password,
      });
      console.log(response);
      authenticate(response, () => {
        isAuth() && isAuth().role === "admin"
          ? Router.push("/admin")
          : Router.push("/user");
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        buttonText: "Login",
        error: error.response.data.error,
      });
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          value={email}
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          placeholder="Type your email"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={password}
          onChange={handleChange("password")}
          type="password"
          className="form-control"
          placeholder="Type your password"
          required
        />
      </div>
      <div className="form-group">
        <button className="btn btn-outline-warning">{buttonText}</button>
      </div>
    </form>
  );
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <br />
        <h1>Login</h1>
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        <br />
        {loginForm()}
        <Link href="/auth/password/forgot">
          <a className="text-danger float-right">Forgot Password</a>
        </Link>
      </div>
    </Layout>
  );
};

export default Login;
