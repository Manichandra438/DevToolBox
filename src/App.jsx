import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Base64Tool from './pages/Base64Tool';
import UrlTool from './pages/UrlTool';
import JsonTool from './pages/JsonTool';
import JwtTool from './pages/JwtTool';
import HtmlEntityTool from './pages/HtmlEntityTool';

function App() {
  return (
    <Router basename="/DevToolBox">
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/base64" replace />} />
          <Route path="/base64" element={<Base64Tool />} />
          <Route path="/url" element={<UrlTool />} />
          <Route path="/json" element={<JsonTool />} />
          <Route path="/jwt" element={<JwtTool />} />
          <Route path="/html" element={<HtmlEntityTool />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
