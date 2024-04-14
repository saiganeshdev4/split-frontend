import { Outlet, Link } from "react-router-dom";

import "./Layout.css";

const Layout = () => {
  return (
    <div>
    <div className="navigation">
      <nav>
        <ul>
          <li>
            <Link to="/" className="button">Home</Link>
          </li>
          <li>
            <Link to="/groups" className="button">Groups</Link>
          </li>
          <li>
            <Link to="/friends" className="button">Friends</Link>
          </li>
          <li>
            <Link to="/activities" className="button">Activities</Link>
          </li>
          <li>
            <Link to="/addSplit" className="button"> Add Split</Link>
          </li>
          <li>
            <Link to="/addGroup" className="button"> Add Group</Link>
          </li>
          <li>
            <Link to="/account" className="button"> Account</Link>
          </li>
        </ul>
      </nav>
    </div>

    <Outlet />
    </div>
  )
};

export default Layout;