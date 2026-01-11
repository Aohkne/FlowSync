import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { RegisterForm } from "../components/auth/RegisterForm";

export const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon
              icon="mdi:view-dashboard"
              width={40}
              className="text-blue-600"
            />
            <h1 className="text-3xl font-bold text-gray-900">FlowSync</h1>
          </div>
          <p className="text-gray-600">Create your account</p>
        </div>
        <RegisterForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
