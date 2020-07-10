import Layout from "../../components/Layout";
import axios from "axios";
import { API } from "../../config";
import { getCookie } from "../../helpers/auth";
import withUser from "../withUser";
import withAdmin from "../withAdmin";
import Link from "next/link";
import moment from "moment";
import Router from "next/router";

const User = ({ user, token, userLinks }) => {
  const confirmDelete = (e, id) => {
    e.preventDefault();
    console.log("delete", id);
    let answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      handleDelete(id);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("link delete success", response);
      Router.replace("/user");
    } catch (error) {
      console.log("link delete error", error);
    }
  };

  const listOfLinks = () => {
    return userLinks.map((l, i) => {
      return (
        <div className="row alert alert-primary p-2" key={i}>
          <div className="col-md-8">
            <a href={l.url} target="_blank">
              <h5 className="pt-2">{l.title}</h5>
              <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
                {l.url}
              </h6>
            </a>
          </div>
          <div className="col-md-4 pt-2">
            <span className="pull-right">
              {`${moment(l.createdAt).fromNow()} by ${l.postedBy.name}`}
            </span>
          </div>
          <div className="col-md-12">
            <span className="badge text-dark">
              {l.type} / {l.medium}
            </span>
            {l.categories.map((c, i) => {
              return <span className="badge text-dark">{c.name}</span>;
            })}
            s <span className="badge text-secondary">{l.clicks} clicks</span>
            <Link href={`/user/link/${l._id}`}>
              <span className="badge text-success pull-right">Update</span>
            </Link>
            <span
              onClick={(e) => {
                confirmDelete(e, l._id);
              }}
              className="badge text-danger pull-right"
            >
              Delete
            </span>
          </div>
        </div>
      );
    });
  };

  return (
    <Layout>
      <h1>
        {user.name}'s dashboard{" "}
        <span className="text-danger">/{user.role}</span>
      </h1>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="/user/link/create">
                <a className="nav link" href="">
                  Update links
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/user/link/update">
                <a className="nav link" href="">
                  Update profile
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="user/profile/update">
                <a href="" className="nav link">
                  Update profile
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-8">
          <h2>Your links</h2>
          <br />
          {listOfLinks()}
        </div>
      </div>
    </Layout>
  );
};

export default withUser(User);
