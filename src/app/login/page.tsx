// src/app/login/page.tsx
import AuthForm from '@/components/AuthForm';
import React from 'react';

const LoginPage = () => {
    return <AuthForm isSignUp={false} />;
};

export default LoginPage;