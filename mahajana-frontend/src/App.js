import React, { useState } from "react";

/* ================= PAGES ================= */
import WelcomePage from "./WelcomePage";
import SelectionPage from "./SelectionPage";
import LoginPage from "./LoginPage";
import CustomerLogin from "./CustomerLogin";

import SellerDashboard from "./SellerDashboard";
import CustomerDashboard from "./CustomerDashboard";

import AddProduct from "./AddProduct";
import ViewProducts from "./ViewProducts";
import Orders from "./Orders";
import Customers from "./Customers";
import Inventory from "./Inventory";
import Sales from "./Sales";


/* ================= PRODUCTS ================= */
import AllProducts from "./AllProducts";
import SpiceProducts from "./SpiceProducts";
import FlourProducts from "./FlourProducts";
import HerbalProducts from "./HerbalProducts";
import ChaiMasalaProducts from "./ChaiMasalaProducts";
import GrainsProducts from "./GrainsProducts";
import NutsProducts from "./NutsProducts";
import FacialProducts from "./FacialProducts";
import RiceFlourProducts from "./RiceFlourProducts";
import ReadyMixProducts from "./ReadyMixProducts";
import PackagingProducts from "./PackagingProducts";

function App() {
  const [page, setPage] = useState("welcome");
  // logged-in user data, set once login/register succeeds
  const [user, setUser] = useState(null);

  return (
    <div>

      {/* ================= WELCOME ================= */}
      {page === "welcome" && (
        <WelcomePage
          onShopNow={() => setPage("selection")}
          onLogin={() => setPage("selection")}
        />
      )}

      {/* ================= SELECTION ================= */}
      {page === "selection" && (
        <SelectionPage
          onSeller={() => setPage("sellerLogin")}
          onCustomer={() => setPage("customerLogin")}
          onBack={() => setPage("welcome")}
        />
      )}

      {/* ================= LOGIN ================= */}
      {page === "sellerLogin" && (
        <LoginPage
          onLogin={() => setPage("sellerDashboard")}
          onBack={() => setPage("selection")}
        />
      )}

      {page === "customerLogin" && (
        <CustomerLogin
          onLogin={(userData) => {
            setUser(userData);
            setPage("customerDashboard");
          }}
          onBack={() => setPage("selection")}
        />
      )}

      {/* ================= CUSTOMER DASHBOARD ================= */}
      {page === "customerDashboard" && (
        <CustomerDashboard
          user={user}
          onBack={() => { setUser(null); setPage("customerLogin"); }}
          onLogout={() => { setUser(null); setPage("customerLogin"); }}
          onProducts={() => setPage("allProducts")}
        />
      )}

      {/* ================= ALL PRODUCTS ================= */}
      {page === "allProducts" && (
        <AllProducts
          onBack={() => setPage("customerDashboard")}
          onSpices={() => setPage("spiceProducts")}
          onFlour={() => setPage("flourProducts")}
          onHerbal={() => setPage("herbalProducts")}
          onChaiMasala={() => setPage("chaiMasala")}
          onGrains={() => setPage("grainsProducts")}
          onNuts={() => setPage("nutsProducts")}
          onFacial={() => setPage("facialProducts")}
          onRice={() => setPage("riceFlourProducts")}
          onReadyMix={() => setPage("readymix")}
          onPackaging={() => setPage("packaging")}
        />
      )}

      {/* ================= PRODUCT PAGES ================= */}
      {/* Each page manages its own cart locally and opens PlaceOrder
          as an internal popup — no onCheckout/routing needed here. */}
      {page === "spiceProducts" && (
        <SpiceProducts onBack={() => setPage("allProducts")} />
      )}

      {page === "flourProducts" && (
        <FlourProducts onBack={() => setPage("allProducts")} />
      )}

      {page === "herbalProducts" && (
        <HerbalProducts onBack={() => setPage("allProducts")} />
      )}

      {page === "chaiMasala" && (
        <ChaiMasalaProducts onBack={() => setPage("allProducts")} />
      )}

      {page === "grainsProducts" && (
        <GrainsProducts onBack={() => setPage("allProducts")} />
      )}

      {page === "nutsProducts" && (
        <NutsProducts onBack={() => setPage("allProducts")} />
      )}

      {page === "facialProducts" && (
        <FacialProducts onBack={() => setPage("allProducts")} />
      )}

      {page === "riceFlourProducts" && (
        <RiceFlourProducts onBack={() => setPage("allProducts")} />
      )}

      {page === "readymix" && (
        <ReadyMixProducts onBack={() => setPage("allProducts")} />
      )}

      {page === "packaging" && (
        <PackagingProducts onBack={() => setPage("allProducts")} />
      )}

      {/* ================= SELLER DASHBOARD ================= */}
      {page === "sellerDashboard" && (
        <SellerDashboard
          onAddProduct={() => setPage("addProduct")}
          onViewProducts={() => setPage("viewProducts")}
          onViewOrders={() => setPage("orders")}
          onViewCustomers={() => setPage("customers")}
          onInventory={() => setPage("inventory")}
          onSales={() => setPage("sales")}
          onLogout={() => setPage("sellerLogin")}
        />
      )}

      {/* ================= ADD PRODUCT ================= */}
      {page === "addProduct" && (
        <AddProduct
          onBack={() => setPage("sellerDashboard")}
          onSave={() => setPage("viewProducts")}
        />
      )}

      {/* ================= VIEW PRODUCTS ================= */}
      {page === "viewProducts" && (
        <ViewProducts
          onBack={() => setPage("sellerDashboard")}
          onInsert={() => setPage("addProduct")}
        />
      )}

      {/* ================= OTHER PAGES ================= */}
      {page === "orders" && (
        <Orders
          onDashboard={() => setPage("sellerDashboard")}
          onCustomers={() => setPage("customers")}
          onInventory={() => setPage("inventory")}
          onSales={() => setPage("sales")}
          onLogout={() => setPage("sellerLogin")}
        />
      )}

      {page === "customers" && (
        <Customers
          onDashboard={() => setPage("sellerDashboard")}
          onOrders={() => setPage("orders")}
          onInventory={() => setPage("inventory")}
          onSales={() => setPage("sales")}
          onLogout={() => setPage("sellerLogin")}
        />
      )}

      {page === "inventory" && (
        <Inventory
          onDashboard={() => setPage("sellerDashboard")}
          onOrders={() => setPage("orders")}
          onCustomers={() => setPage("customers")}
          onsales={() => setPage("sales")}
          onAddProduct={() => setPage("addProduct")}
          onLogout={() => setPage("sellerLogin")}
        />
      )}

      {page === "sales" && (
        <Sales
          onDashboard={() => setPage("sellerDashboard")}
          onOrders={() => setPage("orders")}
          onCustomers={() => setPage("customers")}
          onInventory={() => setPage("inventory")}
          onLogout={() => setPage("sellerLogin")}
        />
      )}

    </div>
  );
}

export default App;