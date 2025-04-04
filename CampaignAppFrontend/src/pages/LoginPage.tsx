import { useAuth } from "@/components/ui/AuthProvider";
import { LoginForm } from "@/components/ui/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function LoginPage() {
  const { token }: any = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate, token]);

  return (
    <div className="flex justify-center align-center w-full h-full">
      <div className="w-[600px] self-center">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
