import { createBrowserRouter } from 'react-router-dom';
import { AuthPage } from '@/pages/AuthPage/AuthPage';
import { HomePage } from '@/pages/HomePage/HomePage';
import { ProfilePage } from '@/pages/ProfilePage/ProfilePage';
import { ServicesPage } from '@/pages/ServicesPage/ServicesPage';
import { SpecialistDetailPage } from '@/pages/SpecialistPage/SpecialistDetailPage';
import { SpecialistsListPage } from '@/pages/SpecialistPage/SpecialistsListPage';
import { Layout } from '@/shared/components/Layout/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'specialists', element: <SpecialistsListPage /> },
      { path: 'specialists/:id', element: <SpecialistDetailPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'login', element: <AuthPage mode="login" /> },
      { path: 'register', element: <AuthPage mode="register" /> },
    ],
  },
]);
