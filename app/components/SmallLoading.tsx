// Loading.tsx
import React from "react";
import Spinner from "react-bootstrap/Spinner";

const SmallLoading: React.FC = () => {
  return (
    <div className="d-flex h-100 justify-content-center align-items-center">
      <Spinner animation="border" role="status" variant="info">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default SmallLoading;
