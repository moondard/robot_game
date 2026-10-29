import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Auth } from '../../features/Auth';
import { Shop } from '../../features/Shop';
import { Game } from '../../features/Game';
import { MainMenu } from '../../features/MainMenu';
import { LevelMap } from '../../features/LevelMap';
import { Achievements } from '../../features/Achievements';

import { getUser } from '../session';

/* 
Обёртка для защищённых маршрутов
если пользователь не авторизован — редирект на /login
replace — чтобы не засорять историю браузера и не застрять в цикле "назад"
*/
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    return getUser() ? <>{children}</> : <Navigate to="/login" replace />;
}

/* 
Централизованный роутер приложения
Все защищённые экраны оборачиваются в ProtectedRoute
*/
export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Auth />} />
                <Route path="/menu" element={<ProtectedRoute><MainMenu /></ProtectedRoute>} />
                <Route path="/game/:id" element={
                    <ProtectedRoute>
                        <Game />
                    </ProtectedRoute>
                } />
                <Route path="/map" element={
                    <ProtectedRoute>
                        <LevelMap />
                    </ProtectedRoute>
                } />
                <Route path="/shop" element={
                    <ProtectedRoute>
                        <Shop />
                    </ProtectedRoute>
                } />
                <Route path="/achievements" element={
                    <ProtectedRoute>
                        <Achievements />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}