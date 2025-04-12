import React from "react";
import { ProgressBar } from "react-bootstrap";

const ProgressSteps = ({ currentStep }) => {
  return (
    <div className="mb-4">
      <ProgressBar>
        <ProgressBar 
          variant={currentStep >= 1 ? "success" : "primary"}
          now={25} 
          key={1} 
          label="Généralités" 
        />
        <ProgressBar 
          variant={currentStep >= 2 ? "success" : "info"}
          now={25} 
          key={2} 
          label="Image Dessin" 
        />
        <ProgressBar 
          variant={currentStep >= 3 ? "success" : "success"}
          now={25} 
          key={3} 
          label="Image Réelle" 
        />
        <ProgressBar 
          variant={currentStep >= 4 ? "success" : "warning"}
          now={25} 
          key={4} 
          label="Audio" 
        />
      </ProgressBar>
      
      <div className="d-flex justify-content-between mt-1">
        <small className={`text-${currentStep === 1 ? 'primary' : 'muted'}`}>Étape 1</small>
        <small className={`text-${currentStep === 2 ? 'info' : 'muted'}`}>Étape 2</small>
        <small className={`text-${currentStep === 3 ? 'success' : 'muted'}`}>Étape 3</small>
        <small className={`text-${currentStep === 4 ? 'warning' : 'muted'}`}>Étape 4</small>
      </div>
    </div>
  );
};

export default ProgressSteps;