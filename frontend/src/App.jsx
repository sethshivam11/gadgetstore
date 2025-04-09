import "./App.css";
import LoadingBar from "react-top-loading-bar";
import { useState, lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

// Component Imports for client pages
const Login = lazy(() => import("./components/client/Login"));
const Signup = lazy(() => import("./components/client/Signup"));
const NotFound = lazy(() => import("./components/client/NotFound"));
const Home = lazy(() => import("./components/client/Home"));
const ProductLists = lazy(() => import("./components/client/ProductLists"));
const ProductPage = lazy(() => import("./components/client/ProductPage"));

// Component Imports for seller pages
const SellerLogin = lazy(() => import("./components/seller/SellerLogin"));
const SellerSignup = lazy(() => import("./components/seller/SellerSignup"));
const SellerPage = lazy(() => import("./components/seller/SellerPage"));
const CreateProduct = lazy(() => import("./components/seller/CreateProduct"));
const UpdateProduct = lazy(() => import("./components/seller/UpdateProduct"));

// Component Imports for user pages
const Cart = lazy(() => import("./components/user/Cart"));
const Accounts = lazy(() => import("./components/user/Accounts"));
const OrderSuccess = lazy(() => import("./components/user/OrderSuccess"));

const App = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [progress, setProgress] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [serviceAvailable, setServiceAvailable] = useState(false);

  useEffect(() => {
    const SERVER_HEALTH_KEY = "serviceAvailable";
    const SERVER_HEALTH_EXPIRY = 15 * 60 * 1000;

    const isBackendHealthy = () => {
      const item = localStorage.getItem(SERVER_HEALTH_KEY);
      if (!item) return false;

      const data = JSON.parse(item);
      if (Date.now() > data.expiry) {
        localStorage.removeItem(SERVER_HEALTH_KEY);
        return false;
      }

      return data.healthy;
    };

    const checkBackendHealth = async () => {
      setLoading(true);
      if (isBackendHealthy()) {
        setServiceAvailable(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/health`);

        if (res.ok) {
          setServiceAvailable(true);
          localStorage.setItem(
            SERVER_HEALTH_KEY,
            JSON.stringify({
              healthy: true,
              expiry: Date.now() + SERVER_HEALTH_EXPIRY,
            })
          );
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    checkBackendHealth();
  }, []);

  return serviceAvailable ? (
    <div>
      <LoadingBar color="red" progress={progress} height={"3px"} />
      <Toaster position="bottom-center" />
      <Suspense
        fallback={
          <div className="center-loader">
            <TailSpin
              height="80"
              width="80"
              color="red"
              ariaLabel="tail-spin-loading"
              radius="1"
              visible={true}
            />
            <h3>Loading...</h3>
          </div>
        }
      >
        <Routes>
          {/* Client Pages */}
          <Route
            element={<Login setProgress={setProgress} toast={toast} />}
            exact
            path="/login"
          />
          <Route
            element={<Signup setProgress={setProgress} toast={toast} />}
            exact
            path="/signup"
          />
          <Route
            element={
              <Home
                setProgress={setProgress}
                toast={toast}
                setQuery={setQuery}
              />
            }
            exact
            path="/"
          />
          <Route element={<NotFound />} path="/*" />
          <Route
            element={
              <ProductLists
                setProgress={setProgress}
                toast={toast}
                category="mobiles"
                key="search"
                setQuery={setQuery}
                query={query}
              />
            }
            exact
            path="/search"
          />
          <Route
            element={
              <ProductLists
                setProgress={setProgress}
                toast={toast}
                category="mobiles"
                key="mobiles"
                setQuery={setQuery}
              />
            }
            exact
            path="/mobiles"
          />
          <Route
            element={
              <ProductLists
                setProgress={setProgress}
                toast={toast}
                category="pc"
                key="pc"
                setQuery={setQuery}
              />
            }
            exact
            path="/pc"
          />
          <Route
            element={
              <ProductLists
                setProgress={setProgress}
                toast={toast}
                category="electronics"
                key="electronics"
                setQuery={setQuery}
              />
            }
            exact
            path="/electronics"
          />
          <Route
            element={
              <ProductLists
                setProgress={setProgress}
                toast={toast}
                category="accessories"
                key="accessories"
                setQuery={setQuery}
              />
            }
            exact
            path="/accessories"
          />
          <Route
            element={<ProductPage setProgress={setProgress} toast={toast} />}
            key="productpage"
            exact
            path="/product/:id"
            setQuery={setQuery}
          />

          {/* Seller Pages */}
          <Route
            element={<SellerLogin setProgress={setProgress} toast={toast} />}
            exact
            path="/seller/login"
          />
          <Route
            element={<SellerSignup setProgress={setProgress} toast={toast} />}
            exact
            path="/seller/signup"
          />
          <Route
            element={<SellerPage setProgress={setProgress} toast={toast} />}
            exact
            path="/seller"
          />
          <Route
            element={<CreateProduct setProgress={setProgress} toast={toast} />}
            exact
            path="/seller/product"
          />
          <Route
            element={<UpdateProduct setProgress={setProgress} toast={toast} />}
            exact
            path="/seller/product/update/:productId"
          />

          {/* User Pages */}
          <Route
            element={<Accounts setProgress={setProgress} toast={toast} />}
            exact
            path="/account"
          />
          <Route
            element={<Cart setProgress={setProgress} toast={toast} />}
            exact
            path="/cart"
            setQuery={setQuery}
          />
          <Route element={<OrderSuccess />} exact path="/ordersuccess" />
        </Routes>
      </Suspense>
    </div>
  ) : loading ? (
    <div className="center-loader">
      <TailSpin
        height="80"
        width="80"
        color="red"
        ariaLabel="tail-spin-loading"
        radius="1"
        visible={true}
      />
      <h3>Loading...</h3>
    </div>
  ) : (
    <div className="service-unavailable">
      <h1>Service Unavailable</h1>
      <p>We are working hard to get back to normal.</p>
      <img src="/error-image.avif" alt="Error image" draggable={false} />
    </div>
  );
};
export default App;
