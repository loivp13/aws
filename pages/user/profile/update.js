import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import Router from "next/router";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { API } from "../../../config";
import { isAuth, updateUser } from "../../../helpers/auth";
import withUser from "../../withUser";
import { update } from "../../../../server/models/user";

const Profile = ({ user, token }) => {
  const [state, setState] = useState({
    name: user.name,
    email: user.email,
    password: "",
    error: "",
    success: "",
    buttonText: "Update",
    loadedCategories: [],
    categories: user.categories,
  });
  const {
    name,
    email,
    password,
    error,
    success,
    buttonText,
    loadedCategories,
    categories,
  } = state;
  console.log(token);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };
  const handleToggled = (c) => () => {
    // show categories > checkbox
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    setState({ ...state, categories: all, success: "", error: "" });
  };

  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => {
        return (
          <li className="list-unstyled" key={i}>
            <input
              type="checkbox"
              checked={categories.includes(c._id)}
              onChange={handleToggled(c._id)}
              className="mr-2"
            />
            <label htmlFor="" className="from-check-label">
              {c.name}
            </label>
          </li>
        );
      })
    );
  };

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Update",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Updating" });
    try {
      const response = await axios.put(
        `${API}/user`,
        {
          name,
          password,
          categories,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      updateUser(response.data, () => {
        setState({
          ...state,
          buttonText: "Updated",
          success: "Profile updated succesfully",
        });
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        buttonText: "Update",
        error: error.response.data.error,
      });
    }
  };

  const updateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          value={name}
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          placeholder="Type your name"
          required
        />
      </div>
      <div className="form-group">
        <input
          disabled
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
        />
      </div>
      <div className="form-group">
        <label htmlFor="" className="text-muted ml-4">
          Category
        </label>
        <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
          {showCategories()}
        </ul>
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
        <h1>Update Profile</h1>
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        <br />
        {updateForm()}
      </div>
    </Layout>
  );
};

export default withUser(Profile);
