import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import axios from "axios";
import { API } from "../../../config";
import Resizer from "react-image-file-resizer";
// import dynamic from "next/dynamic";
// import "react-quill/dist/quill.bubble.css";

//enable Serverside rendering only
// const ReactQuill = dynamic(() => import("react-quill"), { srr: false });

const Update = ({ oldCategory, token }) => {
  const [state, setState] = useState({
    name: oldCategory.name,
    error: "",
    success: "",
    buttonText: "Update",
    formData: process.browser && new FormData(),
    imagePreview: oldCategory.image.url,
    image: "",
  });
  const [content, setContent] = useState(oldCategory.content);

  const [imageUploadButtonName, setImageUploadButton] = useState(
    "Update image"
  );

  const {
    name,
    success,
    error,
    formData,
    buttonText,
    imageUploadText,
    image,
    imagePreview,
  } = state;
  const handleContent = (e) => {
    setContent(e.target.value);
    console.log(content);
    setState({ ...state, success: "", error: "" });
  };
  const handleChange = (name) => (e) => {
    //USED WHEN SENDING FILES USING FORM DATA
    // const value = name === "image" ? e.target.files[0] : e.target.value;
    // const imageName =
    //   name === "image" ? event.target.files[0].name : "Upload image";
    // formData.set(name, value);
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Update",
    });
    setImageUploadButton("Update image");
  };

  const handleImage = (e) => {
    let fileInput = false;
    if (e.target.files[0]) {
      fileInput = true;
      setImageUploadButton(e.target.files[0].name);
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        e.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          setState({
            ...state,
            image: uri,
            success: "",
            error: "",
            image: uri,
          });
        },
        "base64"
      );
    }
  };

  const handleSubmit = async (e) => {
    console.table({ name, content, image });

    e.preventDefault();

    setState({ ...state, buttonText: "Updating" });
    try {
      const response = await axios.put(
        `${API}/category/${oldCategory.slug}`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("create category", response);
      setState({
        ...state,
        name: response.data.name,
        content: response.data.content,
        buttonText: "Updated",
        imageUploadText: "Update image",
        success: `${response.data.name} is updated`,
        imagePreview: response.data.image.url,
      });
      setImageUploadButton("Update Image");
    } catch (err) {
      console.log("category create error", err);
      setImageUploadButton("Update image");
      setState({
        ...state,
        name: "",
        buttonText: "Created",
        error: "Error occured creating category",
      });
    }
  };

  const updateCategoryForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="text-muted">
            Name
          </label>
          <input
            id="name"
            type="text"
            onChange={handleChange("name")}
            value={name}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="" className="text-muted">
            Content
          </label>
          <textarea
            type="text"
            className="pb-5 mb-3"
            onChange={handleContent}
            value={content}
            className="form-control"
            required
            placeholder="Minimum 20 characters."
            style={{ border: "1px solid #666" }}
          />
          {/* <ReactQuill
            value={content}
            onChange={handleContent}
            theme="bubble"
          ></ReactQuill> */}
        </div>
        <div className="form-group">
          <label htmlFor="image" className="btn btn-outline-secondary">
            {imageUploadButtonName}{" "}
            <span>
              <img src={imagePreview} alt="image" height="20" />
            </span>
            <input
              id="image"
              onChange={handleImage}
              type="file"
              accept="image/*"
              className="form-control"
              hidden
            />
          </label>
        </div>
        <button className="btn btn-outline-warning">{buttonText}</button>
      </form>
    );
  };
  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Update category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {updateCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};
Update.getInitialProps = async ({ req, query, token }) => {
  const response = await axios.post(`${API}/category/${query.slug}`);
  return { oldCategory: response.data.category, token };
};

export default withAdmin(Update);
