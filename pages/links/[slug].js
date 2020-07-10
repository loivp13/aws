import moment from "moment";
import Layout from "../../components/Layout";
import Link from "next/link";
import axios from "axios";
import { API, APP_NAME } from "../../config";
import renderHTML from "react-render-html";
import { useState, useEffect, Fragment } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Head from "next/head";

const Links = ({
  query,
  category,
  links,
  totalLinks,
  linksSkip,
  linksLimit,
}) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(linksSkip);
  const [size, setSize] = useState(totalLinks);
  const [popular, setPopular] = useState([]);

  const head = () => {
    return (
      <Head>
        <title>
          {category.name} | {APP_NAME}
        </title>
        <meta name="description" content={category.content.substring(0, 160)} />
        {/* used to allow use for fb, issue why??? */}
        <meta property="og:title" content={category.name} />
        <meta
          property="og:description"
          content={category.content.substring(0, 160)}
        />
        <meta property="og:image:secure_url" content={category.image.url} />
      </Head>
    );
  };

  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular/${category.slug}`);
    setPopular(response.data);
  };

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadPopular();
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.post(`${API}/category/${query.slug}`);
    setAllLinks(response.data.links);
  };
  const listOfPopularLinks = () => {
    return popular.map((l, i) => {
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
            <span className="badge text-secondary pull-right">
              {l.clicks} clicks
            </span>
          </div>
        </div>
      );
    });
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
    const response = await axios.post(`${API}/category/${query.slug}`, {
      skip: toSkip,
      limit,
    });
    setAllLinks([...allLinks, ...response.data.links]);
    setSize(response.data.links.length);
    setSkip(toSkip);
  };
  //  REPLACED THE LOAD MORE BUTTON WITH INFITNITE SCROLL
  // const loadMoreButton = () => {
  //   return (
  //     size > 0 &&
  //     size >= limit && (
  //       <button onClick={loadMore} className="btn btn-outline-primary btn-lg">
  //         Load more
  //       </button>
  //     )
  //   );
  // };

  return (
    <Fragment>
      {head()}
      <Layout>
        <div className="row">
          <div className="col-md-8">
            <h1 className="display-4 font-weight-bold">
              {category.name} - URL/Links
            </h1>
            <div className="lead alert alert-secondary pt-4">
              {renderHTML(category.content || "")}
            </div>
          </div>
          <div className="col-md-4">
            <img
              src={category.image.url}
              alt={category.name}
              style={{ width: "auto", maxHeight: "200px" }}
            />
          </div>
        </div>

        <br />

        {/* <div className="text-center pt-4 pb-5">{loadMoreButton()}</div> */}

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
            <div className="col-md-8">{listOfLinks()}</div>
            <div className="col-md-4">
              <h2 className="lead">Most popular in {category.name}</h2>
              <div className="p-3">{listOfPopularLinks()}</div>
            </div>
          </div>
        </InfiniteScroll>
      </Layout>
    </Fragment>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 1;
  const response = await axios.post(`${API}/category/${query.slug}`, {
    skip,
    limit,
  });
  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    linksLimit: limit,
    linksSkip: skip,
  };
};

export default Links;
