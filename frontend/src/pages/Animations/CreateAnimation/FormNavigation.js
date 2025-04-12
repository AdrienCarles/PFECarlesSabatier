import React from "react";
import { Button } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";

const FormNavigation = ({ currentStep, prevStep, nextStep, handleSubmit, loading }) => {
  return (
    <div className="d-flex justify-content-between">
      {currentStep > 1 && (
        <Button variant="outline-secondary" onClick={prevStep}>
          <FaArrowLeft className="me-2" /> Précédent
        </Button>
      )}
      
      <div className="ms-auto">
        {currentStep < 4 ? (
          <Button variant="primary" onClick={nextStep}>
            Suivant <FaArrowRight className="ms-2" />
          </Button>
        ) : (
          <Button 
            variant="success" 
            type="submit" 
            disabled={loading}
            onClick={handleSubmit}
          >
            <FaCheck className="me-2" /> Finaliser
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormNavigation;