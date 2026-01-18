import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { LoginForm } from "../components/auth/LoginForm";

export const LoginPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-pastel">
        <div className="absolute inset-0 bg-mesh-gradient opacity-60" />
        
        {/*  Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float"
             style={{ backgroundColor: 'rgba(134, 239, 172, 0.3)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-float"
             style={{ 
               backgroundColor: 'rgba(152, 245, 225, 0.2)',
               animationDelay: '1s'
             }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl animate-float"
             style={{ 
               backgroundColor: 'rgba(168, 230, 207, 0.2)',
               animationDelay: '2s'
             }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Glass Card */}
          <div className="glass-card rounded-3xl p-8 shadow-glass">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-lg blur-lg opacity-60 animate-glow transition-all duration-500 group-hover:opacity-80 group-hover:blur-3xl"
                      style={{ backgroundColor: '#4ade80' }} />
                  
                  <div className="absolute -inset-1 rounded-2xl blur-md opacity-30 animate-pulse"
                      style={{ backgroundColor: '#22c55e' }} />
                  
                  {/* Logo */}
                  <div className="relative p-4 rounded-2xl shadow-2xl backdrop-blur-sm transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                      style={{ 
                        background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)',
                        boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                      }}>
                    <img 
                      src={"/logo.png"} 
                      alt="FlowSync Logo" 
                      className="w-14 h-14 object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110" 
                    />
                    
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold mb-2"
                  style={{ 
                    background: 'linear-gradient(to right, #16a34a, #22c55e, #15803d)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm">
                Sign in to continue your productivity journey
              </p>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 px-3 py-1 rounded-full text-gray-500 font-medium">
                  New to FlowSync?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/60 hover:bg-white/90 border text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-sm hover:shadow-md"
                style={{ 
                  borderColor: 'rgba(187, 247, 208, 0.5)',
                  color: '#15803d'
                }}
              >
                <Icon icon="mdi:account-plus-outline" width={20} />
                Create New Account
              </Link>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center mt-6 text-sm text-gray-600/80">
            © 2026 FlowSync. Streamline your workflow.
          </p>
        </div>
      </div>
    </div>
  );
};