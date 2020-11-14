import React, { Component } from 'react';

interface IHeaderProps {
  handleYearSelection: Function;
}

const Header = (props: IHeaderProps) => {
  const { handleYearSelection } = props;

  return (
    <header id="App-header">
      <a href="/" className="home-link">

        <div className="App-logo">
          <i className="fas fa-globe"></i>
        </div>

        <div className="App-title">
          <span className="light">Project </span>
          <span className="normal">Bluezone</span>
        </div>

      </a>

      <div className="App-menu">
        <div className="control-title normal">Year:</div>
        <div className="light">
          <span
            className="link"
            onClick={() => handleYearSelection(1957)}
          >1957</span>
        </div>
        <div className="light">
          <span
            className="link"
            onClick={() => handleYearSelection(2018)}
          >2018</span>
        </div>
        <div className="link light">
          <span
            className="label"
            onClick={() => handleYearSelection()}
          >current</span>
        </div>
      </div>
    </header>
  )
}

// export class Header1 extends Component<IHeaderProps, {}> {
//   state = {
//     selectedState: '',
//     selectedDistrict: '',
//     possibleDistricts: []
//   };

//   render() {
//     const { handleYearSelection } = this.props;
//     return (
//       <header id="App-header">
//         <a href="/" className="home-link">

//           <div className="App-logo">
//             <i className="fas fa-globe"></i>
//           </div>

//           <div className="App-title">
//             <span className="light">Project </span>
//             <span className="normal">Bluezone</span>
//           </div>

//         </a>

//         <div className="App-menu">
//           <div className="control-title normal">Year:</div>
//           <div className="light">
//             <span
//               className="link"
//               onClick={() => handleYearSelection(1957)}
//             >1957</span>
//           </div>
//           <div className="light">
//             <span
//               className="link"
//               onClick={() => handleYearSelection(2018)}
//             >2018</span>
//           </div>
//           <div className="link light">
//             <span
//               className="label"
//               onClick={() => handleYearSelection()}
//             >current</span>
//           </div>
//         </div>
//       </header>
//     )
//   }
// }

export default Header;
