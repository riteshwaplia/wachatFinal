import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import './index.css';

import { TenantProvider, useTenant } from './context/TenantContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; // For logged-in users
import Loader from './components/Loader';
import WhatsappNumberRegistrationPage from './pages/WhatsappNumberRegistrationPage';
import ProjectManagementPage from './pages/ProjectManagementPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProtectedRoute from './routes/ProtectedRoute';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import TenantUsersPage from './pages/admin/TenantUsersPage';
import TenantSettingsPage from './pages/admin/TenantSettingsPage';
import UserLayout from './layout/UserLayout';
import AdminLayout from './layout/AdminLayout';
import ProjectDashboard from './components/ProjectDashboard/ProjectDashboard';
import ContactPage from './pages/ContactPage';
import { ProjectProvider } from './context/ProjectProvider';
import ProjectDetail from './components/ProjectDashboard/ProjectDetail';
import GroupPage from './pages/GroupPage';
import TemplatePage from './pages/TemplatePage';
import CreateTemplate from './components/template/CreateTemplate';
import LiveChatPage from './pages/LiveChatPage';
import BulkMessagingDashboard from './pages/BroadCasting';
import SendMessagePage from './components/broadcasting/SendBulkMessage';
import AllComponents from './components/AllComponets';
<<<<<<< HEAD
import Flow from './components/chatFlow/Flow';
import FlowsPage from './pages/FlowsPage';
import { Toaster } from 'react-hot-toast';
=======
import { Toaster } from 'react-hot-toast';
import TemplateDetail from './components/template/TemplateDetail';
import Flow from './components/chatFlow/Flow';
import FlowsPage from './pages/FlowsPage';
import ProfilePage from './pages/ProfilePage';
import UserSetting from './pages/UserSetting';
import UpdatePassword from './components/UpdatePassword';
import TeamMembers from './pages/TeamMember';
import LandingPage from './pages/LandingPage';
import AddTeamMembers from './components/AddTeamMembers';
import UserProfileLayout from './layout/userProfileLayout';
import CreateCarouselTemplate from './components/template/CreateCarouselTemplate';
import SendCarosualTemplate from './components/broadcasting/SendCarosualTemplate';
import NotFoundPage from './pages/NotFoundPage';
import FlowLayout from './layout/FlowLayout';
import CataLog from './components/catalogs/AddCatalogue';
import { Provider } from 'react-redux';
import { store } from './store/store';
import CataLogPage from './components/catalogs/CataLogPage';

>>>>>>> main

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

const FlowRoute = ({ children }) => (
  <ProtectedRoute roles={["user"]}>
    <FlowLayout>{children}</FlowLayout>
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
          <h2 className="text-2xl font-bold text-error mb-4">Error Loading Site</h2>
          <p className="text-gray-700">Failed to fetch site configuration. Please try again later.</p>
          <p className="text-gray-500 text-sm mt-2">({tenantError.message || 'Unknown error'})</p>
        </div>
      </div>
    );
  }

  return (
    <>
<<<<<<< HEAD
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <HomePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/add-tenant-admin"
          element={
            <SuperAdminRoute>
              <SuperAdminDashboard />
            </SuperAdminRoute>
          }
        />

        <Route
          path="/users"
          element={
            <AdminRoute>
              <TenantUsersPage />
            </AdminRoute>
          }
        />

        <Route
          path="/tenant-settings"
          element={
            <AdminRoute>
              <TenantSettingsPage />
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
=======


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
>>>>>>> main
          path="/project/:id/group"
          element={<ProjectRouteWrapper component={GroupPage} />}
        />
        <Route
          path="/project/:id/contacts"
          element={<ProjectRouteWrapper component={ContactPage} />}
        />
        <Route
          path="/project/:id/templates"
          element={<ProjectRouteWrapper component={TemplatePage} />}
        />
        <Route
          path="/project/:id/templates/create"
          element={<ProjectRouteWrapper component={CreateTemplate} />}
        />
        <Route
<<<<<<< HEAD
=======
          path="/project/:id/templates/create/carousel-templates"
          element={<ProjectRouteWrapper component={CreateCarouselTemplate} />}
        />
        <Route
          path="/project/:id/templates/:templateId"
          element={<ProjectRouteWrapper component={TemplateDetail} />}
        />
        <Route
>>>>>>> main
          path="/project/:id/broadcasting"
          element={<ProjectRouteWrapper component={BulkMessagingDashboard} />}
        />
        <Route
          path="/project/:id/broadcasting/send-bulk"
          element={<ProjectRouteWrapper component={SendMessagePage} />}
        />
        <Route
<<<<<<< HEAD
=======
          path="/project/:id/broadcasting/send-bulk/carosual-template"
          element={<ProjectRouteWrapper component={SendCarosualTemplate} />}
        />
        <Route
>>>>>>> main
          path="/project/:id/chat"
          element={<ProjectRouteWrapper component={LiveChatPage} />}
        />
        <Route
          path="/project/:id/flow-builder"


<<<<<<< HEAD
          element={<UserRoute sidebar={false}>
            <Flow />
          </UserRoute>}

        />
        <Route path="/project/:projectId/flow-builder/:flowId" element={<Flow />} /> For editing existing flow
=======
          element={<FlowRoute sidebar={false}>
            <Flow />
          </FlowRoute>}

        />
        <Route path="/project/:projectId/flow-builder/:flowId"
          element={
            <FlowRoute sidebar={false}>
              <Flow />
            </FlowRoute>} /> For editing existing flow
>>>>>>> main

        <Route
          path="/project/:id/flows"
          element={<ProjectRouteWrapper component={FlowsPage} />}
        />
<<<<<<< HEAD
        {/* <Route path="/projects/:projectId/flow-builder" element={<FlowBuilder />} /> */}
=======

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


        {/* catalogue mangement here */}
        <Route
          path="/project/:id/catalogues"
          element={
            <UserLayout>
              <CataLogPage />
            </UserLayout>
          }
        />

        <Route
          path="/project/:id/catalogues/:id"
          element={
            <UserLayout>
              <CataLogPage />
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

            <UserRoute >
              <TeamMembers />
            </UserRoute>

          }
        />
        <Route
          path="/add/teammembers"
          element={

            <UserRoute >
              <AddTeamMembers />
            </UserRoute>

          }
        />




>>>>>>> main
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} // ✅ safe now
        />
        <Route
          path="/allcomponents"
          element={<AllComponents />} // ✅ safe now
        />
        <Route
          path="*"
          element={
<<<<<<< HEAD
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
              <div className="p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
                <p className="text-gray-700">The page you're looking for doesn't exist.</p>
                <a href="/" className="text-primary-500 hover:underline mt-4 inline-block">Go to Home</a>
              </div>
            </div>
          }
        />
      </Routes>

      <Toaster
        position="top-right"
=======
            <NotFoundPage />
          }
        />
      </Routes>
      <Toaster
        position="bottom-right"
>>>>>>> main
        reverseOrder={false}
        toastOptions={{

          duration: 4000,
        }}
      />
<<<<<<< HEAD
=======
    </>
>>>>>>> main

    </>
  );
}


function App() {
  return (

    <Router>
      <TenantProvider>
        <Provider store={store}>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </Provider>
      </TenantProvider>
    </Router>

  );
}

export default App;