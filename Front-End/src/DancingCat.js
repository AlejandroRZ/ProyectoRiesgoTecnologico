import React from 'react';
import './DancingCat.css'; 

const DancingCat = () => {
  return (
    <div className="DancingCat">
    <div className="container">
      <div className="face">
        <div className="ear-l"></div>
        <div className="ear-r"></div>
      </div>
      <div className="hand-l"></div>
      <div className="hand-r"></div>
      <div className="leg-l"></div>
      <div className="leg-r"></div>
      <div className="music-note"></div>
    </div>
    </div>
  );
};

export default DancingCat;