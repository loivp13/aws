import axios from "axios";
import { API } from "../config";
import { getCookie } from "../helpers/auth";
import { isAuth } from "../helpers/auth";

const WithAdmin = (Page) => {
  const WithAdminUser = (props) => <Page {...props} />;

  WithAdminUser.getInitialProps = async (context) => {
    const token = getCookie("token", context.req);
    let user = null;
    let userLinks = [];
    if (token) {
      try {
        const res = await axios.get(`${API}/admin`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: "application/json",
          },
        });
        userLinks = res.data.links;

        user = res.data;
      } catch (error) {
        if (error.response.status === 401) {
          return (user = null);
        }
      }
    }
    console.log(user);
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

  return WithAdminUser;
};

export default WithAdmin;
