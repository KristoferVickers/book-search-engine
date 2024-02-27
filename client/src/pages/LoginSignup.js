import React from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

const LoginSignup = () => {
  return (
    <div>
      <h2>Login/Signup</h2>
      <LoginForm />
      <SignupForm />
    </div>
  );
}

export default LoginSignup;