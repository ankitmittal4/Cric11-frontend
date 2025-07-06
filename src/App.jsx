import React from 'react';
import {
    BrowserRouter as Router,
    // HashRouter as Router,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom';
import SignIn from './components/Authentication/SignIn';
import SignUp from './components/Authentication/SignUp';
import NavBar from './components/Navbar/NavBar';
import Home from './components/Contest/Home';
import ContestDetails from './components/Contest/ContestDetails';
import ContestsInMatches from './components/Contest/ContestsInMatches';
import MyContests from './components/MyContetsts/MyContests';
import MyContestDetails from './components/MyContetsts/MyContestsDetails';
import Transactions from './components/Transactions';
import Layout from './components/Layout';

// import AdminSignIn from "./components/Admin/components/SignIn";
// import DashboardRoutes from './components/Admin/components/DashboardRoutes';

import Terms from './components/Footer/Terms';
import Privacy from './components/Footer/Privacy';
import Contact from './components/Footer/Contact';

import Admin from './Admin/Admin';

const AppContent = () => {
    const location = useLocation();
    // const hideNavBar =
    //     location.pathname.startsWith('/admin') ||
    //     location.pathname.startsWith('/signin') ||
    //     location.pathname.startsWith('/signup');

    //     {!hideNavBar && <NavBar />}
    //         <div
    //             className={` ${
    //                 !hideNavBar ? 'pt-20 container mx-auto p-4' : ''
    //             }`}
    //         ></div>

    return (
        <div>
            <div>
                <Routes>
                    <Route
                        path="/signin"
                        element={<SignIn />}
                    />
                    <Route
                        path="/signup"
                        element={<SignUp />}
                    />
                    <Route
                        path="/terms"
                        element={<Terms />}
                    />
                    <Route
                        path="/privacy"
                        element={<Privacy />}
                    />
                    <Route
                        path="/contact"
                        element={<Contact />}
                    />
                    <Route
                        path="/"
                        element={<Layout />}
                    >
                        <Route
                            path="/"
                            element={<Home />}
                        />
                        <Route
                            path="/match/:id"
                            element={<ContestsInMatches />}
                        />
                        <Route
                            path="/match/:id/contest/:id"
                            element={<ContestDetails />}
                        />
                        <Route
                            path="/my-contests"
                            element={<MyContests />}
                        />
                        <Route
                            path="/my-contests/:id"
                            element={<MyContestDetails />}
                        />
                        <Route
                            path="/transactions"
                            element={<Transactions />}
                        />
                    </Route>
                    <Route
                        path="/admin/*"
                        element={<Admin />}
                    />

                </Routes>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
