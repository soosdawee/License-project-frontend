import './App.css';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Protector } from './data-access/Protector';
import { AdminProtector } from './data-access/AdminProtector';
import { FactcheckerProtector } from './data-access/FactcheckerProtector';

const LoginForm = lazy(() => import('./common/component/LoginForm'));
const LoginPage = lazy(() => import('./common/page/LoginPage'));
const ResetPasswordPage = lazy(() => import('./common/page/ResetPasswordPage'));
const RegisterPage = lazy(() => import('./common/page/RegisterPage'));
const TemplatePage = lazy(() => import('./design/page/TemplatePage'));
const StudioPage = lazy(() => import('./design/page/StudioPage'));
const AdminDashboard = lazy(()=> import('./admin/page/AdminDashboard'));
const FactCheckerDashboard = lazy(()=> import('./fact-checker/page/FactCkeckerDashboard'));
const EmbeddedPage = lazy(() => import('./embed/page/EmbeddedPage'));
const SharedPage = lazy(() => import('./embed/page/SharedPage'));
const VisualizationPage = lazy(() => import('./embed/page/VisualizationPage'));
const SocialPage = lazy(() => import("./social/page/SocialPage"));
const ProfilePage = lazy(() => import("./common/page/ProfilePage"));
const SettingsPage = lazy(() => import("./common/page/SettingsPage"));
const VisualizationsPage = lazy(() => import("./common/page/VisualizationsPage"));

function App() {
  return (
    <div className="App" style={{ height:"100%", width: "100%" }}>
      <Router>
        <Suspense>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/charts" element={<Protector Component={TemplatePage} />} />
            <Route path="/studio/:id" element={<Protector Component={StudioPage} />} />
            <Route path="/admin-dashboard" element={<AdminProtector Component={AdminDashboard} />} />
            <Route path="/factchecker-dashboard" element={<FactcheckerProtector Component={FactCheckerDashboard} />} />
            <Route path="/visualization/:id/embed" element={<EmbeddedPage />} />
            <Route path="/visualization/:id/shared" element={<Protector Component={SharedPage} />} />
            <Route path="/visualization/:id/created" element={<Protector Component={VisualizationPage} />} />
            <Route path="/social" element={<Protector Component={SocialPage} />} />
            <Route path="/profile/:id" element={<Protector Component={ProfilePage} />} />
            <Route path="/settings/" element={<Protector Component={SettingsPage} />} />
            <Route path="/my-visualizations/:id" element={<Protector Component={VisualizationsPage} />} />
            <Route path="/studio/:id/:visualizationId" element={<Protector Component={StudioPage} />} />
          </Routes>
        </Suspense>
    </Router>
    </div>
  );
}

export default App;
