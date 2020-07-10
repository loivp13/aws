import { useState, useEffect } from "react";
import axios from "axios";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../../../helpers/alerts";
import { API } from "../../../../config";
import Router, { withRouter } from "next/router";
import jwt from "jsonwebtoken";
import Layout from "../../../../components/Layout";

const ResetPassword = ({ router }) => {
  console.log(router);
  const [state, setState] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Reset Password",
    success: "",
    error: "",
  });
  const { name, token, newPassword, buttonText, success, error } = state;
  useEffect(() => {
    const decoded = jwt.decode(router.query.id);
    if (decoded)
      setState({ ...state, name: decoded.name, token: router.query.id });
  }, [router]);

  const handleChange = (e) => {
    setState({ ...state, newPassword: e.target.value, error: "", success: "" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({
      ...state,
      newPassword: "",
      buttonText: "Sending",
      success: "",
      error: "",
    });
    try {
      const response = await axios.put(`${API}/reset-password`, {
        resetPasswordLink: token,
        newPassword,
      });
      setState({
        ...state,
        newPassword: "",
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
  const passwordResetForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            onChange={handleChange}
            value={newPassword}
            placeholder="Type new password"
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
          <h1>Hello {name}, please change your password.</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordResetForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
