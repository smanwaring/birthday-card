import React from 'react';
import clientInstructions from './client-instructions';
import './client-guide.scss';

const ClientGuide = () => (
  <div className="tab-wrapper z-depth-3">
    <h2 className="center-text">Code Challenge Client Directions</h2>
    <a href="https://github.com/smanwaring/codeChallengeFellowship"><div className="center-text">Click here to learn more about my API</div></a>
    <div className="text-bold center-text">To mimic the code challenge guidelines in order please follow these steps</div>
    <hr />
    {clientInstructions.map( (step, i) => (
      <div key={`step-${i}`} className="step">{step}</div>
    ))}
    </div>
  );

  export default ClientGuide;


