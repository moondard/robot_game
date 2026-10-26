import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthScreen } from './screens/AuthScreen';
import { MainMenu } from './screens/MainMenu';
import { getUser } from './store/session';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return getUser() ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthScreen />} />
        <Route path="/menu" element={<ProtectedRoute><MainMenu /></ProtectedRoute>} />
        <Route path="/shop" element={
          <ProtectedRoute>
            <div style={{ padding: 40 }}>Магазин (в разработке)</div>
          </ProtectedRoute>
        } />
        <Route path="/achievements" element={
          <ProtectedRoute>
            <div style={{ padding: 40 }}>Достижения (в разработке)</div>
          </ProtectedRoute>
        } />
        <Route path="/map" element={
          <ProtectedRoute>
            <div style={{ padding: 40 }}>Карта уровней (в разработке)</div>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;