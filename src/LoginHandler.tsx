import { useNavigate } from "react-router-dom";

const useLoginHandler = () => {
  const navigate = useNavigate();

  return (userType: "anonymous" | "user" | "manager") => {
    switch (userType) {
      case "user":
        navigate("/user");
        break;
      case "manager":
        navigate("/manager");
        break;
      default:
        navigate("/");
        break;
    }
  };
};

export default useLoginHandler;
