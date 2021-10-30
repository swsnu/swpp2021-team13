import ProfileDropdown from './ProfileDropdown';
import Footer from './Footer';

const Layout = ({ username, footer, children }) => {
  return (
    <div className="layout">
      {username && <ProfileDropdown username={username} />}
      {children}
      {footer && <Footer />}
    </div>
  );
};

export default Layout;
