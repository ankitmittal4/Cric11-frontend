import { Outlet } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar';
import Footer from './Footer/Footer';
const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-200">
            <NavBar />

            <main className="bg-gray-200 flex-grow pb-8 mt-16 sm:mt-20">
                {' '}
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default Layout;
