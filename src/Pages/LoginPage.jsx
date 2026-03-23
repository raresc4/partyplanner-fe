import { useNavigate } from "react-router-dom";
import { login } from "../Actions/user";
import { toast } from "react-toastify";
import AuthenticationComponent from "../Components/AuthenticationComponent";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (username, password) => {
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    login({ username, password })
      .then(() => {
        toast.success("Login successful!");
        navigate("/profile");
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <AuthenticationComponent
      title="Sign in"
      subtitle="Sign in to access your account"
      buttonText="Login"
      onSubmit={handleLogin}
      footerText="Don't have an account? "
      footerLinkText="Sign up"
      footerLinkTo="/register"
    />
  );
}
