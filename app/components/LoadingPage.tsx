// Loading.tsx

import { BounceLoader } from "react-spinners";

const LoadingPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="d-flex align-items-center gap-2">
        <BounceLoader color="#32cd32" size={60} />
        
      </div>
    </div>
  );
};

export default LoadingPage;
