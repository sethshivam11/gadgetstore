import React from "react";
import "../../style/client/home.css";
import Navbar from "./Navbar";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Accessories from "./Accessories";
import Footer from "./Footer";

const Home = () => {
  return (
    <section>
      <Navbar />
      <Section1 />
      <Section2 heading="Finest Gaming PCs" category="pc" />
      <Section2 heading="New Launches" category="mobiles" />
      <Accessories
        heading="Headphones"
        category="headphones"
      />
      <Accessories
        heading="Accessories"
        category="accessories"
      />
      <Section2 heading="Best of Electronics" category="electronics" />
      <Footer />
    </section>
  );
};

export default Home;
