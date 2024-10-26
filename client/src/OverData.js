import React, { useEffect } from 'react';
import './OverData.css';

function OverData({ fetchOverData, overData }) {
  useEffect(() => {
    fetchOverData();
  }, [fetchOverData]);

  return (
    <div>
      <h2>Over Data</h2>
      <ul>
        {overData.map((data, index) => (
          <li key={index}>{data.value}</li>
        ))}
      </ul>
    </div>
  );
}

export default OverData;
