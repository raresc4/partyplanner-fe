import { useNavigate } from "react-router-dom";
import { register } from "../Actions/user";
import { toast } from "react-toastify";
import AuthenticationComponent from "../Components/AuthenticationComponent";

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = (username, password) => {
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    register({ username, password })
      .then((data) => {
        toast.success("Registration successful!");
        navigate("/login");
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <AuthenticationComponent
      title="Register"
      subtitle="Create a new account"
      buttonText="Register"
      onSubmit={handleRegister}
      footerText="Already have an account? "
      footerLinkText="Log in"
      footerLinkTo="/login"
    />
  );
}
