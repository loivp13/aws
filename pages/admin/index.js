import Layout from "../../components/Layout";
import withAdmin from "../withAdmin";
import Link from "next/link";

const Admin = ({ user }) => {
  return (
    <Layout>
      <h1>Admin Dashboard</h1>
      <br />
      <div className="row">
        <div className="col-md-4">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="admin/category/create" className="nav link">
                Create category
              </Link>
            </li>
            <li className="nav-item">
              <Link href="admin/category/read">
                <a href="" className="nav link">
                  List all categories
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="admin/link/read">
                <a href="" className="nav link">
                  List all links
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
        <div className="col-md-8"></div>
      </div>
    </Layout>
  );
};

export default withAdmin(Admin);
