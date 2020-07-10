import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import axios from "axios";
import { API } from "../../../config";
import Link from "next/link";

const Read = ({ user, token }) => {
  const [state, setState] = useState({
    error: "",
    success: "",
    image: "",
    categories: [],
  });
  const { error: success, categories } = state;
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, categories: response.data });
  };
  const confirmDelete = (e, slug) => {
    e.preventDefault();
    console.log("delete", slug);
    let answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      handleDelete(slug);
    }
  };
  const handleDelete = async (slug) => {
    try {
      const response = await axios.delete(`${API}/category/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("category delete success", response);
      loadCategories();
    } catch (error) {
      console.log("category delete", error);
    }
  };

  const listCategories = () => {
    return categories.map((c, i) => {
      return (
        <div className="bg-light p-3 col-md-6">
          <Link href={`/links/${c.slug}`} key={c._id}>
            <div className="">
              <div className="row">
                <div className="col-md-3">
                  <img
                    src={c.image && c.image.url}
                    alt={c.name}
                    style={{ width: "100px", height: "auto" }}
                    className="pr-3"
                  />
                </div>
                <div className="col-md-6">
                  <h3>{c.name}</h3>
                </div>
                <div className="col-md-3">
                  <div className="btn btn-sm btn-outline-success btn-block mb-1">
                    <Link href={`/admin/category/${c.slug}`}>Update</Link>
                  </div>
                  <button
                    onClick={(e) => confirmDelete(e, c.slug)}
                    className="btn btn-sm btn-outline-danger btn-block"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      );
    });
  };

  return (
    <Layout>
      <div className="row">
        <div className="col">
          <h1>List of categories</h1>
          <br />
        </div>
      </div>
      <div className="row">{listCategories()}</div>
    </Layout>
  );
};
export default withAdmin(Read);
