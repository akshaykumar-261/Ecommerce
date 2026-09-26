import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
      <Toaster
        position="top-left"
        toastOptions={{
          duration: 5000,
        }}
      />
    </>
  );
}
export default App;
