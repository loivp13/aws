import axios from "axios";
import { API } from "../config";
import { getCookie } from "../helpers/auth";
import { Children } from "react";

const WithUser = (Page) => {
  const WithAuthUser = (props) => <Page {...props} />;

  WithAuthUser.getInitialProps = async (context) => {
    const token = getCookie("token", context.req);
    let user = null;
    let userLinks = [];
    if (token) {
      try {
        const res = await axios.get(`${API}/user`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: "application/json",
          },
        });
        user = res.data.user;
        userLinks = res.data.links;
      } catch (error) {
        console.log("error with Auth User");
        if (error.response.status === 401) {
          return (user = null);
        }
      }
    }
    if (user === null) {
      //redirect
      context.res.writeHead(302, {
        Location: "/",
      });
      context.res.end();
    } else {
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        user,
        token,
        userLinks,
      };
    }
  };

  return WithAuthUser;
};

export default WithUser;
