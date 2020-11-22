import React from 'react';
import { useHistory, useLocation } from "react-router-dom";

interface INavItemProps {
  label: string;
  pathname: string;
}

const NavItem = (props: INavItemProps) => {
  const { label, pathname } = props;
  const history = useHistory();
  const location = useLocation();

  return (
    <div
      className={`nav-item ${location.pathname === pathname ? 'active' : 'inactive'}`}
      onClick={() => { history.push(pathname) }}
    >{label}</div>
  )
}

export default NavItem;
