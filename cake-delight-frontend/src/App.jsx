import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CakeDetails from "./pages/CakeDetails";
import Basket from "./pages/Basket";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import Notifications from "./pages/Notifications";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCakes from "./pages/admin/AdminCakes";
import AdminOrders from "./pages/admin/AdminOrders";
import AddCake from "./pages/admin/AddCake";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import EditCake from "./pages/admin/EditCake";

import ApiDocs from "./pages/ApiDocs";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ========================= */}
        {/* CUSTOMER ROUTES           */}
        {/* ========================= */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        <Route
          path="/cakes/:id"
          element={
            <>
              <Navbar />
              <CakeDetails />
            </>
          }
        />

        <Route
          path="/basket/:basketId"
          element={
            <>
              <Navbar />
              <Basket />
            </>
          }
        />

        <Route
          path="/checkout/:basketId"
          element={
            <>
              <Navbar />
              <Checkout />
            </>
          }
        />

        <Route
          path="/order/:orderId"
          element={
            <>
              <Navbar />
              <OrderDetails />
            </>
          }
        />

        <Route
          path="/orders"
          element={
            <>
              <Navbar />
              <Orders />
            </>
          }
        />

        <Route
          path="/notifications"
          element={
            <>
              <Navbar />
              <Notifications />
            </>
          }
        />


        {/* ========================= */}
        {/* ADMIN ROUTES              */}
        {/* ========================= */}

        <Route
          path="/admin"
          element={
            <>
              <AdminNavbar />
              <AdminDashboard />
            </>
          }
        />

        <Route
          path="/admin/cakes"
          element={
            <>
              <AdminNavbar />
              <AdminCakes />
            </>
          }
        />

        <Route
          path="/admin/cakes/add"
          element={
            <>
              <AdminNavbar />
              <AddCake />
            </>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <>
              <AdminNavbar />
              <AdminOrders />
            </>
          }
        />
        <Route
  path="/admin/cakes/:id/edit"
  element={
    <>
      <AdminNavbar />
      <EditCake />
    </>
  }
/>
<Route
  path="/api-docs"
  element={<ApiDocs />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;