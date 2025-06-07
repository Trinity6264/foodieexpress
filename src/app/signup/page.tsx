// src/app/signup/page.tsx
import AuthForm from '@/components/AuthForm';
import React from 'react';

const SignUpPage = () => {
    return <AuthForm isSignUp={true} />;
};

export default SignUpPage;