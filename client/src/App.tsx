import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { TranslationProvider } from "@/components/TranslationProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import ChatWidget from "@/components/ChatWidget";
import CookieConsent from "@/components/CookieConsent";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import Categories from "@/pages/Categories";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import LegalNotice from "@/pages/LegalNotice";
import NotFound from "@/pages/not-found";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminSuccess from "@/pages/admin/AdminSuccess";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/Products";
import AddProduct from "@/pages/admin/AddProduct";
import EditProduct from "@/pages/admin/EditProduct";
import AdminOrders from "@/pages/admin/Orders";
import AllOrders from "@/pages/admin/AllOrders";
import OrderDetail from "@/pages/admin/OrderDetail";
import OrderInvoice from "@/pages/admin/OrderInvoice";
import AdminCustomers from "@/pages/admin/Customers";
import AdminMessages from "@/pages/admin/Messages";
import AdminCategories from "@/pages/admin/Categories";
import AdminTestimonials from "@/pages/admin/Testimonials";
import AdminHeroSlides from "@/pages/admin/HeroSlides";

function Router() {
  return (
    <Switch>
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/success" component={AdminSuccess} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/products/add" component={AddProduct} />
      <Route path="/admin/products/:id/edit" component={EditProduct} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/orders/all" component={AllOrders} />
      <Route path="/admin/orders/:id/invoice" component={OrderInvoice} />
      <Route path="/admin/orders/:id" component={OrderDetail} />
      <Route path="/admin/customers" component={AdminCustomers} />
      <Route path="/admin/messages" component={AdminMessages} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/testimonials" component={AdminTestimonials} />
      <Route path="/admin/hero-slides" component={AdminHeroSlides} />
      
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/categories" component={Categories} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/legal-notice" component={LegalNotice} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TranslationProvider>
          <AuthProvider>
            <TooltipProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Router />
                </main>
                <Footer />
                <CartSidebar />
                <ChatWidget />
                <CookieConsent />
              </div>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </TranslationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
