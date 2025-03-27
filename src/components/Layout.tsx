import { ReactNode } from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen">
      {!isLoginPage && <Navbar />}
      <main className={isLoginPage ? '' : 'pt-16'}>
        {children}
      </main>
    </div>
  );
};

export default Layout;