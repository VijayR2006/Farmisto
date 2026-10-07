import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Farmer register is now handled by the unified /form page with role=farmer
const FarmerRegister = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/form?role=farmer", { replace: true });
  }, [navigate]);
  return null;
};

export default FarmerRegister;
