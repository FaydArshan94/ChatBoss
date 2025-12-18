import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Mainroutes from "./routes/Mainroutes";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./lib/store";
import useThemeStore from "./lib/themeStore";

const App = () => {
  const { checkAuth, isCheckinAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  


  

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <div data-theme={theme}>
      <Navbar />
      <Mainroutes />
      <Toaster />
    </div>
  );
};

export default App;
