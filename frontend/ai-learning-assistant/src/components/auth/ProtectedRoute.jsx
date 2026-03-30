import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';

const ProtectedRoute = () => {
    const isAuthenticated = true;
    const loading = false;

    if(loading){
        return <div style={{backgroundColor: "#000000", color: "white"}}>Loading...</div>
    }

    return isAuthenticated ? (
        <AppLayout>
            <Outlet />
        </AppLayout>
    ) : (
        <Navigate to="/login" replace />
    )
}

export default ProtectedRoute