// src/features/auth/Login.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookMarked } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  // ── Local Form State ────────────────────────────────
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ── Auth Hook ───────────────────────────────────────
  // login, isLoading, error — sab ek jagah se aa raha hai
  const { login, isLoading, error, clearAuthError } = useAuth();

  // Component unmount pe error clear karo
  useEffect(() => {
    return () => clearAuthError();
  }, []);

  // ── Input Change Handler ────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // User type karne lage to error hatao
    if (error) clearAuthError();
  };

  // ── Form Submit ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) return;

    // useAuth ka login call karo
    // Success pe automatically /dashboard pe jayega
    await login({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#7C3AED]/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#06B6D4]/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md bg-[#13131A] border border-[#1F1F2E] rounded-3xl p-8 lg:p-10 shadow-2xl"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-purple-900/20">
            <BookMarked className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to continue to BookMaster
          </p>
        </div>

        {/* ── Error Message ── */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 
              border border-red-500/20 text-red-400 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            className="py-3.5"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>


        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-10">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#06B6D4] font-bold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;