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
        <Route path="/game/:id" element={
          <ProtectedRoute>
            <div style={{ padding: 40 }}>Экран игры (в разработке)</div>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;