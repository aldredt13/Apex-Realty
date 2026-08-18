import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import ForSellers from "./pages/ForSellers";
import ForAgents from "./pages/ForAgents";
import Areas from "./pages/Areas";
import Contact from "./pages/Contact";
import Properties from "./pages/Properties";
import Listing from "./pages/Listing";
import NotFound from "./pages/NotFound";

// Dashboard
import Login from "./pages/dashboard/Login";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashListings from "./pages/dashboard/DashListings";
import DashListingForm from "./pages/dashboard/DashListingForm";
import DashSubmissions from "./pages/dashboard/DashSubmissions";
import DashSettings from "./pages/dashboard/DashSettings";
import DashTeam from "./pages/dashboard/DashTeam";
import DashProfile from "./pages/dashboard/DashProfile";
import DashSecurity from "./pages/dashboard/DashSecurity";

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public marketing site */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:slug" element={<Listing />} />
              <Route path="/about" element={<About />} />
              <Route path="/for-sellers" element={<ForSellers />} />
              <Route path="/for-agents" element={<ForAgents />} />
              <Route path="/areas" element={<Areas />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin dashboard */}
            <Route path="/dashboard/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<DashListings />} />
                <Route path="listings/new" element={<DashListingForm />} />
                <Route path="listings/:id/edit" element={<DashListingForm />} />
                <Route path="submissions" element={<DashSubmissions />} />
                <Route path="team" element={<DashTeam />} />
                <Route path="profile" element={<DashProfile />} />
                <Route path="security" element={<DashSecurity />} />
                <Route path="settings" element={<DashSettings />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SettingsProvider>
  );
}
