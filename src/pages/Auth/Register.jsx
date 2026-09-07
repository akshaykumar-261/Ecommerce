import React from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { Link } from "react-router-dom";
function Register() {
  return (
    <AuthLayout>
      <div className="flex border-b mb-8">
        <Link
          to="/login"
          className="w-1/2 text-center pb-4 mt-3 text-1xl font-medium text-gray-500"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="w-1/2 text-center pb-4 mt-3 text-1xl  text-violet-600 border-b-2 border-violet-600"
        >
          Register
        </Link>
      </div>
      <h1>Register</h1>
    </AuthLayout>
  );
}

export default Register;
