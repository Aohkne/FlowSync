import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Icon } from "@iconify/react";

import { authApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.register(data);
      setAuth(response.user, response.token);
      navigate("/boards");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Full Name Input */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Full Name
        </label>
        <div className="relative">
          <input
            {...register("fullName")}
            type="text"
            id="fullName"
            className="input pl-11"
            placeholder="John Doe"
            autoComplete="name"
          />
          <Icon 
            icon="mdi:account-outline" 
            width={20} 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <Icon icon="mdi:alert-circle" width={16} />
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email Input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            {...register("email")}
            type="email"
            id="email"
            className="input pl-11"
            placeholder="john@example.com"
            autoComplete="email"
          />
          <Icon 
            icon="mdi:email-outline" 
            width={20} 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <Icon icon="mdi:alert-circle" width={16} />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Password
        </label>
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            className="input pl-11 pr-11"
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <Icon 
            icon="mdi:lock-outline" 
            width={20} 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon 
              icon={showPassword ? "mdi:eye-off" : "mdi:eye"} 
              width={20}
            />
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <Icon icon="mdi:alert-circle" width={16} />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div 
          className="p-4 rounded-xl flex items-start gap-3"
          style={{ background: 'rgba(254, 226, 226, 0.8)' }}
        >
          <Icon icon="mdi:alert-circle" width={20} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 text-sm">Registration Failed</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-3"
      >
        {isLoading ? (
          <>
            <Icon icon="mdi:loading" width={22} className="animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <Icon icon="mdi:account-plus-outline" width={22} />
            <span>Create Account</span>
          </>
        )}
      </button>
    </form>
  );
};