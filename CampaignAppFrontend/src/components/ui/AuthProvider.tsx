import { api } from "@/api";
import { User } from "@/types/user";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useLayoutEffect,
  PropsWithChildren,
} from "react";
import { toast } from "sonner";

type AuthContext = {
  token?: string | null;
  currentUser?: User | null;
  handleRegister: (data: any) => Promise<boolean>;
  handleLogin: (data: any) => Promise<boolean>;
  handleLogout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

type AuthProviderProps = PropsWithChildren;

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within a AuthContext provider");
  }

  return authContext;
};

type RegisterPayload = {
  email: string;
  password: string;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken]: any = useState<string | null>();
  const [currentUser, setCurrentUser] = useState<User | null>();

  async function handleRegister(data: any) {
    try {
      let payload: RegisterPayload = {
        email: data.email,
        password: data.password,
      };

      await api.post("/user/register", payload);

      return true;
    } catch (e: any) {
      toast.error(e.response.data);
    }

    return false;
  }
  async function refreshUser() {
    try {
      const res = await api.get("/user/me");
      setCurrentUser(res.data);
    } catch (e: any) {
      setToken(null);
      setCurrentUser(null);
      toast.error(e.response.data);
    }
  }
  async function handleLogin(data: any) {
    try {
      const response = await api.post("/user/login", {
        email: data.email,
        password: data.password,
      });

      setToken(response.data);

      localStorage.setItem("accessToken", response.data);

      const res = await api.get("/user/me");
      setCurrentUser(res.data);
      return true;
    } catch (e: any) {
      setToken(null);
      setCurrentUser(null);
      toast.error(e.response.data);
      return false;
    }
  }

  async function handleLogout() {
    try {
      localStorage.removeItem("accessToken");

      setToken(null);
      setCurrentUser(null);
    } catch {
      setToken(null);
      setCurrentUser(null);
    }
  }

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get("/user/me");

        setCurrentUser(response.data);
      } catch {
        setCurrentUser(null);
        setToken(null);
      }
    };

    fetchMe();
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config: any) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response.status === 401 &&
          error.response.data === "Authorization header is missing"
        ) {
          try {
            setToken(localStorage.getItem("accessToken"));
            originalRequest.headers.Authorization = `Bearer ${localStorage.getItem(
              "accessToken"
            )}`;
            originalRequest._retry = true;

            return api(originalRequest);
          } catch {
            setToken(null);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        handleRegister,
        handleLogin,
        handleLogout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
