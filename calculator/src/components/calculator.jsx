// src/components/CreatinineClearanceCalculator.js
import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container'; // Import Container for responsive padding/width
import Typography from '@mui/material/Typography'; // Import Typography for responsive text

// Import the calculator components
import DoacCalculator from './calculators/doac';
import LovenoxCalculator from './calculators/lovenox';
import PediatricCalculator from './calculators/pediatric';
import OthersCalculator from './calculators/others';

const CreatinineClearanceCalculator = ({ onCrClCalculated }) => {
  const [calculatorType, setCalculatorType] = useState('doac'); // Default to DOAC

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
        // Added some basic styling for the default message
        return <Typography sx={{ mt: 3, textAlign: 'center' }}>Select a calculator type</Typography>;
    }
  };

  return (
    // Use MUI Container for responsive max-width and padding
    // maxWidth="md" can be adjusted (xs, sm, md, lg, xl, false)
    <Container maxWidth="md" sx={{ py: 3 }}> {/* Added vertical padding */}
      {/* Use Typography for better control over text styling and responsiveness */}
      <Typography
        variant="h4" // Adjust variant (h1-h6) as needed for semantic structure
        component="h2" // Keep the underlying HTML element as h2
        gutterBottom // Adds standard bottom margin
        sx={{
          textAlign: 'center', // Center the title
          mb: 3, // Add some margin below the title
          // Example of responsive font size (optional):
          // fontSize: { xs: '1.8rem', sm: '2.125rem' }
        }}
      >
        Creatinine Clearance & Anticoagulant Dosing
      </Typography>

      {/* The Box containing Tabs remains largely the same */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
        <Tabs
          value={calculatorType}
          onChange={handleTabChange}
          aria-label="Calculator Type Tabs"
          variant="scrollable" // Ensures tabs scroll horizontally if they overflow
          scrollButtons="auto" // Shows scroll buttons on desktop if needed
          allowScrollButtonsMobile // Ensures scroll buttons appear on mobile if needed
          centered // Center the tabs if they don't fill the full width
        >
          <Tab value="doac" label="DOAC and Dofetilide" />
          <Tab value="lovenox" label="Lovenox" />
          <Tab value="pediatric" label="Pediatric" />
          <Tab value="others" label="Others" />
        </Tabs>
      </Box>

      {/* Render the selected calculator component */}
      {/* Ensure the child components are also responsive */}
      {renderCalculator()}

    </Container> // Close the Container
    // Removed the outer <div className="calculator"> as Container handles layout
  );
};

export default CreatinineClearanceCalculator;
