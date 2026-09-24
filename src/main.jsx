import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/common/ AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StripeProvider } from "./components/payment/StripeProvider";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <StripeProvider>
            <App />
          </StripeProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
