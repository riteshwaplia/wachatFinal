
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
import { Toaster } from 'react-hot-toast';
import TemplateDetail from './components/template/TemplateDetail';
import Flow from './components/chatFlow/Flow';
import FlowsPage from './pages/FlowsPage';
import ProfilePage from './pages/ProfilePage';
import UserSetting from './pages/UserSetting';
import UpdatePassword from './components/UpdatePassword';
import TeamMembers from './pages/TeamMembers';
import LandingPage from './pages/LandingPage';
import AddTeamMembers from './components/AddTeamMembers';
import UserProfileLayout from './layout/userProfileLayout';
import GroupViseSendTem from './components/GroupViseSendTem';

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
 <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
  <div className="p-10 bg-white rounded-2xl shadow-2xl max-w-md w-full transition-all duration-300">
    <div className="flex flex-col items-center space-y-4">
      <div className="text-red-500 bg-red-100 p-3 rounded-full">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
        </svg>
      </div>
      <h2 className="text-3xl font-extrabold text-gray-800">Error Loading Site</h2>
      <p className="text-gray-600 text-center">We couldn’t fetch the site configuration. Please try again shortly.</p>
      <p className="text-gray-400 text-sm">({tenantError.message || 'Unknown error'})</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
      >
        Retry
      </button>
    </div>
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
          path="/project/:id/templates"
          element={<ProjectRouteWrapper component={TemplatePage} />}
        />
        <Route
          path="/project/:id/templates/create"
          element={<ProjectRouteWrapper component={CreateTemplate} />}
        />
        <Route
          path="/project/:id/templates/:id"
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
          path="/project/:id/broadcasting/groupvise"
          element={<ProjectRouteWrapper component={GroupViseSendTem} />}
        />
        <Route
          path="/project/:id/chat"
          element={<ProjectRouteWrapper component={LiveChatPage} />}
        />
        <Route
          path="/project/:id/flow-builder"


          element={<UserRoute sidebar={false}>
            <Flow />
          </UserRoute>}

        />
        <Route path="/project/:projectId/flow-builder/:flowId" element={<Flow />} /> For editing existing flow

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
          path="/user/reset-password"
          element={
            <UserProfileLayout>
              <UpdatePassword />
            </UserProfileLayout>
          }
        />

        <Route
          // path="/project/:id/broadcasting"
          path="/project/:id/setting"
          element={
            <UserRoute>
              <UserSetting />
            </UserRoute>

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