import React from "react";
import "../../style/client/home.css";
import Navbar from "./Navbar";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Accessories from "./Accessories";
import Footer from "./Footer";

const Home = (props) => {
  return (
    <section>
      <Navbar setQuery={props.setQuery}/>
      <Section1 />
      <Section2 heading="Finest Gaming PCs" category="pc" />
      <Section2 heading="New Launches" category="mobiles" />
      <Accessories heading="Accessories" category="accessories" />
      <Accessories heading="Headphones" subCategory="headphones" />
      <Section2 heading="Best of Electronics" category="electronics" />
      <Footer setProgress={props.setProgress} toast={props.toast} />
    </section>
  );
};

export default Home;
