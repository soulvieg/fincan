import React, { useEffect } from "react";
import MainHeader from "../components/MainHeader";
import Carousel from "../components/Carousel";
import Bestseller from "../components/BestSeller";

const MainPage = () => {
  useEffect(() => {
    document.body.style.background =
      "url('/img/background1.jpg') no-repeat center center fixed";
    document.body.style.backgroundSize = "cover";
    document.body.style.height = "100vh";

    return () => {
      document.body.style.background = "";
      document.body.style.backgroundSize = "";
      document.body.style.height = "";
    };
  }, []);

  return (
    <>
      <MainHeader />
      <Carousel />
      <Bestseller />
    </>
  );
};

export default MainPage;
