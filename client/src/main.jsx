import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Documents from './pages/Documents.jsx'
import Profile from './pages/Profile.jsx'
import AuthLayout from './layouts/AuthLayouts.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import FlashCard from './pages/FlashCard.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Landing />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      }
    ],
  },
  {
    path: "/",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <AuthLayout />
        </ProtectedRoute>
      </AuthProvider>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "documents", element: <Documents /> },
      { path: "documents/:docId", element: <Documents /> },
      { path: "flashcards", element: <FlashCard /> },
      { path: "profile", element: <Profile /> },
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid #334155",
          },
        }}
      />
    </GoogleOAuthProvider>
  </StrictMode>
);