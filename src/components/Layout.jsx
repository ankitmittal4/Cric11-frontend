// Layout.jsx
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar'; // Your existing NavBar
import Footer from './Footer';
const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />

            <main className="flex-grow pb-8">
                {' '}
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default Layout;
