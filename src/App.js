import './App.css';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const LoginForm = lazy(() => import('./common/component/LoginForm'));
const TemplatePage = lazy(() => import('./design/page/TemplatePage'));
const StudioPage = lazy(() => import('./design/page/StudioPage'));
const AdminDashboard = lazy(()=> import('./admin/page/AdminDashboard'));
const EmbeddedPage = lazy(() => import('./embed/page/EmbeddedPage'))
const SocialPage = lazy(() => import("./social/page/SocialPage"))

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
            <Route path="/social" element={<SocialPage />} />
          </Routes>
        </Suspense>
    </Router>
    </div>
  );
}

export default App;
