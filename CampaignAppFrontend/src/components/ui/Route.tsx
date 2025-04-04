import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/components/ui/AuthProvider";

type RouteProps = PropsWithChildren & {
  isProtected?: boolean;
};

const Route = ({ children, isProtected }: RouteProps) => {
  const navigate = useNavigate();
  const { token, currentUser } = useAuth();

  useEffect(() => {
    if (isProtected && token === null) {
      navigate("/login", { replace: true });
    }
  }, [isProtected, navigate, token]);

  if (token === undefined || currentUser === undefined) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  return children;
};

export default Route;
