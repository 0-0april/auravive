import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import AppHeader from "./components/AppHeader";
import Login from "./pages/Login";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerProducts from "./pages/OwnerProducts";
import OwnerOrders from "./pages/OwnerOrders";
import CustomerShop from "./pages/CustomerShop";
import CartPage from "./pages/CartPage";
import CustomerOrders from "./pages/CustomerOrders";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppHeader />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/owner/products" element={<OwnerProducts />} />
            <Route path="/owner/orders" element={<OwnerOrders />} />
            <Route path="/shop" element={<CustomerShop />} />
            <Route path="/shop/cart" element={<CartPage />} />
            <Route path="/shop/orders" element={<CustomerOrders />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
