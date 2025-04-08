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

            {/* Non-Fixed Footer (appears after content) */}
            <footer className="bg-red-600 p-4 border-t-2 border-gray-400 text-white text-center">
                <div className="container mx-auto">
                    <p>
                        © {new Date().getFullYear()} Cric11 - All Rights
                        Reserved
                    </p>
                    <div className="flex justify-center space-x-4 mt-2">
                        <a
                            href="/terms"
                            className="hover:underline"
                        >
                            Terms
                        </a>
                        <a
                            href="/privacy"
                            className="hover:underline"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="/contact"
                            className="hover:underline"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
