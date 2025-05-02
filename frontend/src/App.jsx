import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'; // Import useLocation and Navigate
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import WishlistPage from './pages/WishlistPage';
import Header from './components/Header';
import GlobalStyles from './components/GlobalStyles';

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }


  if (!currentUser) {
      return <Navigate to="/login" state={{ from: location }} replace />;
  }


  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyles />
        <Header />
        <Routes>
          {/*  */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* */}
          <Route element={<ProtectedRoute />}>
             {/*  */}
            <Route path="/" element={<HomePage />} />
            <Route path="/wishlists/:wishlistId" element={<WishlistPage />} />
             {/*  */}
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
