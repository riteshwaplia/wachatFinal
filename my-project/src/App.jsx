import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import "./index.css";

import { TenantProvider, useTenant } from "./context/TenantContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage"; // For logged-in users
import Loader from "./components/Loader";
import WhatsappNumberRegistrationPage from "./pages/WhatsappNumberRegistrationPage";
import ProjectManagementPage from "./pages/ProjectManagementPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import TenantUsersPage from "./pages/admin/TenantUsersPage";
import TenantSettingsPage from "./pages/admin/TenantSettingsPage";
import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";
import ProjectDashboard from "./components/ProjectDashboard/ProjectDashboard";
import ContactPage from "./pages/ContactPage";
import { ProjectProvider } from "./context/ProjectProvider";
import ProjectDetail from "./components/ProjectDashboard/ProjectDetail";
import GroupPage from "./pages/GroupPage";
import TemplatePage from "./pages/TemplatePage";
import CreateTemplate from "./components/template/CreateTemplate";
import LiveChatPage from "./pages/LiveChatPage";
import BulkMessagingDashboard from "./pages/BroadCasting";
import SendMessagePage from "./components/broadcasting/SendBulkMessage";
import AllComponents from "./components/AllComponets";
import { Toaster } from "react-hot-toast";
import TemplateDetail from "./components/template/TemplateDetail";
import Flow from "./components/chatFlow/Flow";
import FlowsPage from "./pages/FlowsPage";
import ProfilePage from "./pages/ProfilePage";
import UserSetting from "./pages/UserSetting";
import UpdatePassword from "./components/UpdatePassword";
import TeamMembers from "./pages/TeamMember";
import LandingPage from "./pages/LandingPage";
import AddTeamMembers from "./components/AddTeamMembers";
import UserProfileLayout from "./layout/userProfileLayout";
import CreateCarouselTemplate from "./components/template/CreateCarouselTemplate";
import SendCarosualTemplate from "./components/broadcasting/SendCarosualTemplate";
import NotFoundPage from "./pages/NotFoundPage";
import TemplateManage from "./admin/template/TemplateManage";
import AdminCreateTemplate from "./admin/template/AdminCreateTemplate";
import TemplateGroupPage from "./pages/TemplateGroupPage";
import SendTemplateMessage from "./components/template/SendTemplateMessage";
import Catalogue from "./pages/CataloguePage";
import InvestmentPlatform from "./pages/InvestmentPlatform";
import AdminDashboard from "./pages/AdminDashboard";
import CataloguePage from "./pages/CataloguePage";
import ProductPage from "./components/catalogue/ProductPage";
import AddProductPage from "./components/catalogue/AddProductPage";
import PaymentPage from "./components/order/PaymentPage";
import SuccessPage from "./components/order/SuccessPage";

const AdminRoute = ({ children }) => (
  <ProtectedRoute roles={["super_admin", "tenant_admin"]}>
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
);

const SuperAdminRoute = ({ children }) => (
  <ProtectedRoute roles={["super_admin"]}>
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
);

const UserRoute = ({ sidebar, children }) => {
  return (
    <ProtectedRoute roles={["user"]}>
      <UserLayout sidebar={sidebar}>{children}</UserLayout>
    </ProtectedRoute>
  );
};
const TeamMemberRoute = ({ sidebar, children }) => (
  <ProtectedRoute roles={["team-member"]}>
    <UserLayout sidebar={sidebar}>{children}</UserLayout>
  </ProtectedRoute>
);

const ProjectRouteWrapper = ({ component: Component }) => {
  const { id } = useParams();

  // Save the current project ID to localStorage whenever it changes
  useEffect(() => {
    if (id) {
      localStorage.setItem("currentProjectId", id);
    }
  }, [id]);

  return (
    <ProtectedRoute roles={["user", "team-member"]}>
      <ProjectProvider
        projectId={id || localStorage.getItem("currentProjectId")}
      >
        <UserLayout sidebar={true}>
          <Component />
        </UserLayout>
      </ProjectProvider>
    </ProtectedRoute>
  );
};
function AppContent() {
  const { loading: tenantLoading, error: tenantError } = useTenant();
  const { loading: authLoading, isLoggedIn } = useAuth(); // ✅ HOOK at top-level

  if (tenantLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" color="primary" />
        <p className="ml-4 text-gray-700">Loading website configuration...</p>
      </div>
    );
  }

  if (tenantError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-center">
        <div className="p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-error mb-4">
            Error Loading Site
          </h2>
          <p className="text-gray-700">
            Failed to fetch site configuration. Please try again later.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            ({tenantError.message || "Unknown error"})
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <HomePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-tenant-admin"
          element={
            <SuperAdminRoute>
              <SuperAdminDashboard />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <TenantUsersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/tenant-settings"
          element={
            <AdminRoute>
              <TenantSettingsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage-templates"
          element={
            <AdminRoute>
              <TemplateManage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage-templates/create"
          element={
            <AdminRoute>
              <AdminCreateTemplate />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage-templates/edit/:templateId"
          element={
            <AdminRoute>
              <AdminCreateTemplate />
            </AdminRoute>
          }
        />
        <Route
          path="/add-whatsapp-number"
          element={
            <UserRoute sidebar={false}>
              <WhatsappNumberRegistrationPage />
            </UserRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <UserRoute sidebar={false}>
              <ProjectManagementPage />
            </UserRoute>
          }
        />
        <Route
          path="/project/:id/dashboard"
          element={<ProjectRouteWrapper component={ProjectDashboard} />}
        />
        <Route
          path="/project/:id/project-details"
          element={<ProjectRouteWrapper component={ProjectDetail} />}
        />
        <Route
          path="/project/:id/group"
          element={<ProjectRouteWrapper component={GroupPage} />}
        />
        <Route
          path="/project/:id/contacts"
          element={<ProjectRouteWrapper component={ContactPage} />}
        />
        <Route
          path="/project/:id/contacts/:contactid"
          element={<ProjectRouteWrapper component={SendTemplateMessage} />}
        />
        <Route
          path="/project/:id/templates"
          element={<ProjectRouteWrapper component={TemplatePage} />}
        />
        <Route
          path="/project/:id/templates/template-group"
          element={<ProjectRouteWrapper component={TemplateGroupPage} />}
        />
        <Route
          path="/project/:id/templates/create"
          element={<ProjectRouteWrapper component={CreateTemplate} />}
        />
        {/* <Route
          path="/project/:id/templates/create/catelogue"
          element={<ProjectRouteWrapper component={CreateCatalogTemplate} />}
        /> */}
        {/* navigate(`project/${templateId}/${projectId}/templates/create`); */}
        <Route
          path="/project/:id/templates/create/:templateId"
          element={<ProjectRouteWrapper component={CreateTemplate} />}
        />
        <Route
          path="/project/:id/templates/create/carousel-templates"
          element={<ProjectRouteWrapper component={CreateCarouselTemplate} />}
        />
        <Route
          path="/project/:id/templates/:templateId"
          element={<ProjectRouteWrapper component={TemplateDetail} />}
        />
        <Route
          path="/project/:id/broadcasting"
          element={<ProjectRouteWrapper component={BulkMessagingDashboard} />}
        />
        <Route
          path="/project/:id/broadcasting/send-bulk"
          element={<ProjectRouteWrapper component={SendMessagePage} />}
        />
        <Route
          path="/project/:id/broadcasting/send-bulk/carosual-template"
          element={<ProjectRouteWrapper component={SendCarosualTemplate} />}
        />
        <Route
          path="/project/:id/catalogue"
          element={<ProjectRouteWrapper component={CataloguePage} />}
        />
        <Route
          path="/project/:id/catalogue/:catelogueId/products"
          element={<ProjectRouteWrapper component={ProductPage} />}
        />
        <Route
          path="/project/:id/catalogue/:catelogueId/products/add-product"
          element={<ProjectRouteWrapper component={AddProductPage} />}
        />
        <Route
          path="/project/:id/chat"
          element={<ProjectRouteWrapper component={LiveChatPage} />}
        />
        <Route
          path="/project/:id/flow-builder"
          element={
            <UserRoute sidebar={false}>
              <Flow />
            </UserRoute>
          }
        />
        <Route
          path="/project/:projectId/flow-builder/:flowId"
          element={<Flow />}
        />{" "}
        {/* For editing existing flow */}
        <Route
          path="/project/:id/flows"
          element={<ProjectRouteWrapper component={FlowsPage} />}
        />
        {/* <Route path="/projects/:projectId/flow-builder" element={<FlowBuilder />} />
            <Route path="/projects/:projectId/flow-builder/:flowId" element={<FlowBuilder />} /> For editing existing flow */}
        {/* //user profile and settings */}
        <Route
          path="/user/profile"
          element={
            <UserProfileLayout>
              <ProfilePage />
            </UserProfileLayout>
          }
        />
        <Route
          path="/user/update-password"
          element={
            <UserProfileLayout>
              <UpdatePassword />
            </UserProfileLayout>
          }
        />
        <Route
          path="/project/:id/setting"
          element={
            <UserLayout>
              <UserSetting />
            </UserLayout>
          }
        />
        {/* <Route


        {/* //user profile and settings */}
        {/* /project/688737673803284e7d52e8ea/user-profile */}
        <Route
          path="/user-profile"
          element={
            <UserProfileLayout>
              <ProfilePage />
            </UserProfileLayout>
          }
        />
        <Route
          path="/update-password"
          element={
            <UserProfileLayout>
              <UpdatePassword />
            </UserProfileLayout>
          }
        />
        <Route
          path="/project/:id/user-setting"
          element={
            <UserProfileLayout>
              <UserSetting />
            </UserProfileLayout>
          }
        />
        {/* <Route
        path="/user/setting"
        element={<ProjectRouteWrapper component={UserSetting} />}
      /> */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/team/members"
          element={
            <UserRoute>
              <TeamMembers />
            </UserRoute>
          }
        />
        <Route
          path="/add/teammembers"
          element={
            <UserRoute>
              <AddTeamMembers />
            </UserRoute>
          }
        />

         <Route path="/:projectId/:orderId" element={<PaymentPage />} />
        <Route path="/success/:projectId/:orderId" element={<SuccessPage />} />
        <Route
          path="/"
          element={
            <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
          } // ✅ safe now
        />
        <Route
          path="/allcomponents"
          element={<AllComponents />} // ✅ safe now
        />
        <Route
          path="/invest"
          element={<InvestmentPlatform />} // ✅ safe now
        />
        <Route
          path="/admin"
          element={<AdminDashboard />} // ✅ safe now
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
        }}
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <TenantProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TenantProvider>
    </Router>
  );
}

export default App;
