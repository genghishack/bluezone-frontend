import React, { useState } from 'react';
import Slider from 'rc-slider';
import moment from 'moment';
import 'rc-slider/assets/index.css';

interface IYearSelectionProps {
  handleYearSelection: Function;
}
const YearSelection = (props: IYearSelectionProps) => {
  const { handleYearSelection } = props;

  const minYear = 1789;
  const maxYear = parseInt(moment().format('YYYY'), 10);
  const [selectedYear, setSelectedYear] = useState(maxYear);

  const handleSliderChange = (val: number) => {
    setSelectedYear(val);
  }

  // set marks every 10 years on the slider
  const getMarks = () => {
    const marks = {};
    let i;
    for (i=Math.ceil(minYear/10); i<=Math.floor(maxYear/10); i++) {
      marks[i*10] = '';
    }
    return marks;
  }

  return (
    <div className="YearSelection">
      <div>Year:</div>
      <div style={{ width: '400px', margin: '5px 20px'}}>
        <Slider
          min={minYear}
          max={maxYear}
          defaultValue={maxYear}
          value={selectedYear}
          // marks={getMarks()}
          onChange={handleSliderChange}
          onAfterChange={() => handleYearSelection(selectedYear)}
          railStyle={{ height: 2 }}
          handleStyle={{
            height: 25,
            width: 5,
            top: -1,
            marginBottom: '5px',
            backgroundColor: "#ccf",
            border: "1px solid #00f",
            borderRadius: '25%'
          }}
          trackStyle={{ background: "none" }}
        />
      </div>
      <div>
        <input 
          type="number" 
          value={selectedYear}
          min="1800"
          max="2020" 
          onChange={(e) => {
            setSelectedYear(parseInt(e.target.value, 10));
          }}
          onMouseUp={() => {
            handleYearSelection(selectedYear);
          }}
          style={{height: '20px', 'fontSize': '15px', marginTop: '-2px'}}
        ></input></div>
    </div>

  )
}

export default YearSelection;
