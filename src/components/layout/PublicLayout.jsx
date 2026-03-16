import TopNav from '../common/TopNav';
import Footer from '../common/Footer';
import { Outlet } from 'react-router-dom';
import PageLoader from '../common/PageLoader';
import { usePageLoader } from '../../hooks/usePageLoader';
import SocialMediaFloating from '../common/SocialMediaFloating';

const PublicLayout = () => {
  const { isLoading } = usePageLoader();

  return (
    <div className="flex flex-col min-h-screen">
      <PageLoader isVisible={isLoading} />
      <SocialMediaFloating />
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
