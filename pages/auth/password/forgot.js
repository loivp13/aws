import { withRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { API } from "../../../config";
import Layout from "../../../components/Layout";

const ForgotPassword = () => {
  const [state, setState] = useState({
    email: "",
    buttonText: "Forgot Password",
    success: "",
    error: "",
  });
  const { email, buttonText, success, error } = state;
  const handleChange = (e) => {
    setState({ ...state, email: e.target.value, error: "", success: "" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API}/forgot-password`, { email });
      setState({
        ...state,
        email: "",
        buttonText: "Done",
        success: response.data.message,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Forgot Password",
        error: error.response.data.error,
      });
    }
  };
  const passwordForgotForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            onChange={handleChange}
            value={email}
            placeholder="Type your email"
            required
          />
        </div>
        <div className="">
          <button className="btn btn-outline-warning">{buttonText}</button>
        </div>
      </form>
    );
  };
  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Forgot Password</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordForgotForm()}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
