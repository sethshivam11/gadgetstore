import "./App.css";
import LoadingBar from "react-top-loading-bar";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Component Imports for client pages
import Login from "./components/client/Login";
import Signup from "./components/client/Signup";
import NotFound from "./components/client/NotFound";
import Home from "./components/client/Home";
import ProductLists from "./components/client/ProductLists";
import ProductPage from "./components/client/ProductPage";

// Component Imports for seller pages
import SellerLogin from "./components/seller/SellerLogin";
import SellerSignup from "./components/seller/SellerSignup";
import SellerPage from "./components/seller/SellerPage";
import CreateProduct from "./components/seller/CreateProduct";
import UpdateProduct from "./components/seller/UpdateProduct";

// Component Imports for user pages
import Accounts from "./components/user/Accounts";
import Cart from "./components/user/Cart";


const App = () => {
  const [progress, setProgress] = useState(0);
  return (
    <div>
      <LoadingBar color="red" progress={progress} />
      <Routes>


        {/* Client Pages */}
        <Route element={<Login />} exact path="/login" />
        <Route element={<Signup />} exact path="/signup" />
        <Route element={<Home />} exact path="/" />
        <Route element={<NotFound />} path="/*" />
        <Route
          element={
            <ProductLists
              setProgress={setProgress}
              category="mobiles"
              key="mobiles"
            />
          }
          exact
          path="/mobiles"
        />
        <Route
          element={
            <ProductLists setProgress={setProgress} category="pc" key="pc" />
          }
          exact
          path="/pc"
        />
        <Route
          element={
            <ProductLists
              setProgress={setProgress}
              category="electronics"
              key="electronics"
            />
          }
          exact
          path="/electronics"
        />
        <Route
          element={
            <ProductLists
              setProgress={setProgress}
              category="accessories"
              key="accessories"
            />
          }
          exact
          path="/accessories"
        />
        <Route
          element={<ProductPage />}
          key="productpage"
          exact
          path="/product/:id"
        />

        {/* Seller Pages */}
        <Route element={<SellerLogin />} exact path="/seller/login" />
        <Route element={<SellerSignup />} exact path="/seller/signup" />
        <Route element={<SellerPage />} exact path="/seller" />
        <Route element={<CreateProduct />} exact path="/seller/product" />
        <Route
          element={<UpdateProduct />}
          exact
          path="/seller/product/update/:productId"
        />

        {/* User Pages */}
        <Route element={<Accounts />} exact path="/account" />
        <Route element={<Cart />} exact path="/cart" />
      </Routes>
    </div>
  );
};
export default App;
