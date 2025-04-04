import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import Router from "@/Router.tsx";
import AuthProvider from "@/components/ui/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <AuthProvider>
      <Router />
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            marginTop: "30px",
          },
        }}
      />
    </AuthProvider>
  </>
);
