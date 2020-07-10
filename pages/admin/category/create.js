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

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: "",
    error: "",
    success: "",
    formData: process.browser && new FormData(),
    buttonText: "Create",
    image: "",
  });
  const [content, setContent] = useState("");

  const [imageUploadButtonName, setImageUploadButton] = useState(
    "Upload image"
  );

  const handleContent = (e) => {
    setContent(e.target.value);
    setState({ ...state, success: "", error: "" });
  };

  const {
    name,
    success,
    error,
    formData,
    buttonText,
    imageUploadText,
    image,
  } = state;

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
      buttonText: "Create",
    });
    setImageUploadButton("Upload image");
  };

  const handleImage = (e) => {
    let fileInput = false;
    if (e.target.files[0]) {
      fileInput = true;
    }
    setImageUploadButton(e.target.files[0].name);
    if (fileInput) {
      Resizer.imageFileResizer(
        e.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          setState({ ...state, image: uri, success: "", error: "" });
        },
        "base64"
      );
    }
  };

  const handleSubmit = async (e) => {
    console.table({ name, content, image });

    e.preventDefault();
    setState({ ...state, buttonText: "Creating" });
    try {
      const response = await axios.post(
        `${API}/category`,
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
        name: "",
        content: "",
        formData: "",
        buttonText: "Created",
        imageUploadText: "Upload image",
        success: `${response.data.name} is created`,
        image: "",
      });
      setContent("");
      setImageUploadButton("Upload Image");
    } catch (err) {
      console.log("category create error", err);
      setImageUploadButton("Upload image");
      setState({
        ...state,
        name: "",
        buttonText: "Created",
        error: "Error occured creating category",
      });
    }
  };

  const createCategoryForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="" className="text-muted">
            Name
          </label>
          <input
            type="text"
            onChange={handleChange("name")}
            value={name}
            className="form-control"
            required
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
            {imageUploadButtonName}
            <input
              id="image"
              onChange={handleImage}
              type="file"
              accept="image/*"
              className="form-control"
              hidden
              required
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
          <h1>Create category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {createCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};
export default withAdmin(Create);
