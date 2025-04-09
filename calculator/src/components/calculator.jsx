// src/components/CreatinineClearanceCalculator.js
import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

// Import the new calculator components
import DoacCalculator from './calculators/doac';
import LovenoxCalculator from './calculators/lovenox';
import PediatricCalculator from './calculators/pediatric';
import OthersCalculator from './calculators/others';

// DosingRecommendation is now used *within* DoacCalculator and LovenoxCalculator,
// so it doesn't need to be imported or used directly here.

const CreatinineClearanceCalculator = ({ onCrClCalculated }) => {
  const [calculatorType, setCalculatorType] = useState('doac'); // Default to DOAC

  // Removed inputValues and crClResults state - managed by child components now
  // Removed calculateCrCl, handleInputChange, renderInputFields, renderResults,
  // renderDisclaimer, renderCriteria, renderWarning - logic moved to child components

  const handleTabChange = (event, newValue) => {
    setCalculatorType(newValue);
  };

  // Function to render the correct calculator component based on the selected tab
  const renderCalculator = () => {
    switch (calculatorType) {
      case 'doac':
        return <DoacCalculator onCrClCalculated={onCrClCalculated} />;
      case 'lovenox':
        return <LovenoxCalculator onCrClCalculated={onCrClCalculated} />;
      case 'pediatric':
        return <PediatricCalculator onCrClCalculated={onCrClCalculated} />;
      case 'others':
        return <OthersCalculator onCrClCalculated={onCrClCalculated} />;
      default:
        return <div>Select a calculator type</div>;
    }
  };

  return (
    <div className="calculator">
      <h2>Creatinine Clearance & Anticoagulant Dosing</h2> {/* Updated Title */}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}> {/* Added margin */}
        <Tabs value={calculatorType} onChange={handleTabChange} aria-label="Calculator Type Tabs">
          <Tab value="doac" label="DOAC and Dofetilide" />
          <Tab value="lovenox" label="Lovenox" />
          <Tab value="pediatric" label="Pediatric" />
          <Tab value="others" label="Others" /> {/* Renamed for clarity */}
        </Tabs>
      </Box>

      {/* Render the selected calculator component */}
      {renderCalculator()}

      {/*
        Disclaimers, Criteria, Warnings, Input Fields, and Results
        are now rendered *inside* the specific calculator components.
      */}
    </div>
  );
};

export default CreatinineClearanceCalculator;
