import React from 'react';
import NavItem from './NavItem';

const Nav = () => {
  return (
    <div className="Nav">
      <NavItem label="Congressional Districts" pathname="/" />
      <NavItem label="About" pathname="/about" />
    </div>
  )
}

export default Nav;
