import './App.css';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const LoginForm = lazy(() => import('./common/component/LoginForm'));
const TemplatePage = lazy(() => import('./design/page/TemplatePage'));
const StudioPage = lazy(() => import('./design/page/StudioPage'));
const AdminDashboard = lazy(()=> import('./admin/page/AdminDashboard'));
const EmbeddedPage = lazy(() => import('./embed/page/EmbeddedPage'));
const SharedPage = lazy(() => import('./embed/page/SharedPage'));
const VisualizationPage = lazy(() => import('./embed/page/VisualizationPage'));
const SocialPage = lazy(() => import("./social/page/SocialPage"));
const ProfilePage = lazy(() => import("./common/page/ProfilePage"));
const SettingsPage = lazy(() => import("./common/page/SettingsPage"));
const VisualizationsPage = lazy(() => import("./common/page/VisualizationsPage"));

function App() {
  return (
    <div className="App" style={{ height:"100%" }}>
      <Router>
        <Suspense>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/charts" element={<TemplatePage />} />
            <Route path="/studio/:id" element={<StudioPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/visualization/:id/embed" element={<EmbeddedPage />} />
            <Route path="/visualization/:id/shared" element={<SharedPage />} />
            <Route path="/visualization/:id/created" element={<VisualizationPage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/settings/" element={<SettingsPage />} />
            <Route path="/my-visualizations/:id" element={<VisualizationsPage />} />
            <Route path="/studio/:id/:visualizationId" element={<StudioPage />} />
          </Routes>
        </Suspense>
    </Router>
    </div>
  );
}

export default App;
