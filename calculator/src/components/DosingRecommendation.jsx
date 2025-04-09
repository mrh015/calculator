// src/components/DosingRecommendation.js
import React from 'react';

const DosingRecommendation = ({ recommendationData, calculatorType }) => {
  if (!recommendationData) return null;

  let recommendationContent = null;

  if (calculatorType === 'doac' && recommendationData.doac) {
    const { pradaxa_afib, pradaxa_vte, eliquis_afib, eliquis_vte, xarelto_afib, xarelto_vte, savaysa_afib, savaysa_vte } = recommendationData.doac;
    recommendationContent = (
      <div>
        <p>dabigatran(Pradaxa)(AFIB): {pradaxa_afib}</p>
        <p>dabigatran(Pradaxa)(VTE): {pradaxa_vte}</p>
        <p>apixaban(Eliquis)(AFIB): {eliquis_afib}</p>
        <p>apixaban(Eliquis)(VTE): {eliquis_vte}</p>
        <p>rivaroxaban(Xarelto)(AFIB): {xarelto_afib}</p>
        <p>rivaroxaban(Xarelto)(VTE): {xarelto_vte}</p>
        <p>edoxaban(Savaysa)(AFIB): {savaysa_afib}</p>
        <p>edoxaban(Savaysa)(VTE): {savaysa_vte}</p>
      </div>
    );
  } else if (calculatorType === 'lovenox' && recommendationData.lovenox) {
    const { bid_dose, qd_dose, renal_dose } = recommendationData.lovenox;
    recommendationContent = (
      <div>
        <p>Twice Daily Dosing: {bid_dose}</p>
        <p>Once Daily Dosing: {qd_dose}</p>
        <p>Renal Dosing: {renal_dose}</p>
      </div>
    );
  }
  // Add conditions for other calculator types if they generate recommendations

  if (!recommendationContent) return null; // No specific recommendations for this type or data missing

  return (
    <div className="recommendation">
      <h2>Dosing Recommendation</h2>
      <div>{recommendationContent}</div>
    </div>
  );
};

export default DosingRecommendation;
