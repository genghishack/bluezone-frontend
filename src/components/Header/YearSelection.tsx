import React from 'react';

interface IYearSelectionProps {
  handleYearSelection: Function;
}
const YearSelection = (props: IYearSelectionProps) => {
  const { handleYearSelection } = props;

  return (
    <div className="YearSelection">
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

  )
}

export default YearSelection;
