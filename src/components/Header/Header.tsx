import React from 'react';
import YearSelection from './YearSelection';

import './Header.scss';
import Nav from './Nav';

interface IHeaderProps {
  handleYearSelection?: Function;
}

const Header = (props: IHeaderProps) => {
  const { handleYearSelection } = props;

  return (
    <header id="Header">
      <a href="/" className="home-link">

        <div className="main-logo">
          <i className="fas fa-globe"></i>
        </div>

        <div className="main-title">
          <span className="light">Project </span>
          <span className="normal">Bluezone</span>
        </div>

      </a>

      <Nav/>

      <div className="controls">
        {handleYearSelection ? (
          <YearSelection handleYearSelection={handleYearSelection} />
        ) : null}
      </div>
    </header>
  )
}

export default Header;
