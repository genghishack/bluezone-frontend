import React from 'react';
import { useHistory, useLocation } from "react-router-dom";
import YearSelection from './YearSelection';

import './Header.scss';

interface IHeaderProps {
  handleYearSelection?: Function;
}

const Header = (props: IHeaderProps) => {
  const { handleYearSelection } = props;
  const history = useHistory();
  const location = useLocation();

  console.log(location);
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

      <div className="nav">
        <div 
          className={`nav-item congressional-districts ${location.pathname === '/' ? 'active' : 'inactive'}`}
          onClick={() => {history.push('/')}}
        >Congressional Districts</div>
        <div 
          className={`nav-item about ${location.pathname === '/about' ? 'active' : 'inactive'}`}
          onClick={() => {history.push('/about')}}
        >About</div>
      </div>

      <div className="controls">
        {handleYearSelection ? (
          <YearSelection handleYearSelection={handleYearSelection} />
        ) : null}
      </div>
    </header>
  )
}

export default Header;
