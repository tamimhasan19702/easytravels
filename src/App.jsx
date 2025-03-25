/** @format */

import { ReactLenis } from "@studio-freight/react-lenis";
import { useEffect, useState } from "react";
import Preloader from "./components/Preloader";
import Home from "./pages/home/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

const App = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <ReactLenis root>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* protectedroute */}
          </Routes>
        </ReactLenis>
      )}
    </>
  );
};

export default App;
