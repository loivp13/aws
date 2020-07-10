import moment from "moment";
import Layout from "../../../components/Layout";
import Link from "next/link";
import axios from "axios";
import { API } from "../../../config";
import renderHTML from "react-render-html";
import { useState, Children } from "react";
import InfiniteScroll from "react-infinite-scroller";
import withAdmin from "../../withAdmin";
import { getCookie } from "../../../helpers/auth";

const Links = ({ token, links, totalLinks, linksSkip, linksLimit }) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(linksSkip);
  const [size, setSize] = useState(totalLinks);

  const confirmDelete = (e, id) => {
    e.preventDefault();
    let answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      handleDelete(id);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API}/link/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("link delete success", response);
      process.browser && window.location.reload();
    } catch (error) {
      console.log("category delete", error);
    }
  };
  const listOfLinks = () => {
    return allLinks.map((l, i) => {
      return (
        <div className="row alert alert-primary p-2" key={l._id}>
          <div onClick={(e) => handleClick(l._id)} className="col-md-8">
            <a href={l.url} target="_blank">
              <h5 className="pt-2">{l.title}</h5>
              <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
                {l.url}
              </h6>
            </a>
          </div>
          <div className="col-md-4 pt-2">
            <span className="pull-right">
              {moment(l.createdAt).fromNow()} by{" "}
              {l.postedBy ? l.postedBy.name : "unknown"}
            </span>
          </div>

          <div className="col-md-12">
            <span className="badge text-dark">
              {l.type} /{l.medium}
            </span>
            {l.categories.map((c, i) => {
              return (
                <span key={c._id} className="badge text-success">
                  {c.name}
                </span>
              );
            })}

            <span
              onClick={(e) => {
                confirmDelete(e, l._id);
              }}
              className="badge text-danger pull-right"
            >
              Delete
            </span>
            <Link href={`/user/link/${l._id}`}>
              <a href="">
                <span className="badge text-success pull-right">Update</span>
              </a>
            </Link>
            <span className="badge text-secondary pull-right">
              {l.clicks} clicks
            </span>
          </div>
        </div>
      );
    });
  };

  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(
      `${API}/links`,
      {
        skip: toSkip,
        limit,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setAllLinks([...allLinks, ...response.data]);
    setSize(response.data.length);
    setSkip(toSkip);
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1 className="display-4 font-weight-bold">All links</h1>
        </div>
      </div>

      <br />

      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={size > 0 && size >= limit}
        loader={
          <img
            key={0}
            style={{ height: "40px", width: "auto" }}
            src="/static/images/loading.gif"
            alt=" "
          />
        }
      >
        {" "}
        <div className="row">
          <div className="col-md-12">{listOfLinks()}</div>
        </div>
      </InfiniteScroll>
    </Layout>
  );
};

Links.getInitialProps = async ({ req }) => {
  let skip = 0;
  let limit = 1;

  const token = getCookie("token", req);
  const response = await axios.post(
    `${API}/links`,
    {
      skip,
      limit,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return {
    links: response.data,
    totalLinks: response.data.length,
    linksLimit: limit,
    linksSkip: skip,
    token,
  };
};

export default withAdmin(Links);
