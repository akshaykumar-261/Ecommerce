import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
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
