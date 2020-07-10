import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";
import { getCookie, isAuth } from "../../../helpers/auth";

const Create = ({ token }) => {
  const [state, setState] = useState({
    title: "",
    url: "",
    categories: [],
    loadedCategories: [],
    success: "",
    error: "",
    type: "",
    medium: "",
  });
  const {
    title,
    url,
    categories,
    loadedCategories,
    success,
    error,
    type,
    medium,
  } = state;

  useEffect(() => {
    loadCategories();
  }, [success]);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    console.log(response);
    setState({ ...state, loadedCategories: response.data });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(token);
    try {
      const response = await axios.post(
        `${API}/link`,
        { title, url, categories, type, medium },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        ...state,
        title: "",
        url: "",
        success: "Link is created",
        error: "",
        loadedCategories: [],
        categories: [],
        type: "",
        medium: "",
      });
    } catch (error) {
      console.log("link submit error", error);
      setState({ ...state, error: error.response.data.error });
    }
  };

  const handleTypeClick = (e) => {
    setState({ ...state, type: e.target.value, success: "", error: "" });
  };
  const handleMediumClick = (e) => {
    setState({ ...state, medium: e.target.value, success: "", error: "" });
  };

  const showMediums = () => {
    return (
      <React.Fragment>
        <div className="form-check ml-4">
          <label htmlFor="video" className="form-check-label">
            <input
              id="video"
              type="radio"
              onChange={handleMediumClick}
              check={(medium === "video").toString()}
              name="medium"
              value="video"
              className="form-check-input"
            />
            Video
          </label>
        </div>
        <div className="form-check ml-4">
          <label htmlFor="" className="form-check-label">
            <input
              type="radio"
              onChange={handleMediumClick}
              check={(medium === "book").toString()}
              name="medium"
              value="book"
              className="form-check-input"
            />
            Book
          </label>
        </div>
        <div className="form-check ml-4">
          <label htmlFor="" className="form-check-label">
            <input
              type="radio"
              onChange={handleMediumClick}
              check={(medium === "article").toString()}
              name="medium"
              value="article"
              className="form-check-input"
            />
            Article
          </label>
        </div>
      </React.Fragment>
    );
  };
  const showTypes = () => {
    return (
      <React.Fragment>
        <div className="form-check ml-4">
          <label htmlFor="" className="form-check-label">
            <input
              type="radio"
              onClick={handleTypeClick}
              check={(type === "free").toString()}
              name="type"
              value="free"
              className="form-check-input"
            />
            Free
          </label>
        </div>
        <div className="form-check ml-4">
          <label htmlFor="" className="form-check-label">
            <input
              type="radio"
              onClick={handleTypeClick}
              check={(type === "paid").toString()}
              name="type"
              value="paid"
              className="form-check-input"
            />
            Paid
          </label>
        </div>
      </React.Fragment>
    );
  };

  const handleTitleChange = (e) => {
    setState({ ...state, title: e.target.value, error: "", success: "" });
  };
  const handleURLChange = (e) => {
    setState({ ...state, url: e.target.value, error: "", success: "" });
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

  //link create form
  const submitLinkForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="" className="text-muted">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            onChange={handleTitleChange}
            value={title}
          />
        </div>
        <div className="form-group">
          <label htmlFor="" className="text-muted">
            URL
          </label>
          <input
            type="text"
            className="form-control"
            onChange={handleURLChange}
            value={url}
          />
        </div>
        <div className="">
          <button
            disabled={!token}
            className="btn btn-outline-warning"
            type="submit"
          >
            {isAuth() || token ? "Post" : "Login to Post"}
          </button>
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1>Submit Link/URL </h1>
          <br />
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="" className="text-muted ml-4">
              Category
            </label>
            <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div className="form-group">
            <label htmlFor="" className="text-muted ml-4">
              Type
            </label>
            {showTypes()}
          </div>
          <div className="form-group">
            <label htmlFor="" className="text-muted ml-4">
              Medium
            </label>
            {showMediums()}
          </div>
        </div>
        <div className="col-md-8">
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {submitLinkForm()}
        </div>
      </div>
    </Layout>
  );
};

Create.getInitialProps = ({ req }) => {
  const token = getCookie("token", req);
  console.log(token);
  return { token };
};

export default Create;
