"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Heart, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    // Validasi sederhana
    if (!email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    if (!password) {
      setError("Password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Login berhasil
      router.push("/admin/dashboard");
    } catch (error: unknown) {
      console.error("Login error:", error);

      if (
        error &&
        typeof error === "object" &&
        "code" in error
      ) {
        const firebaseError = error as { code: string };

        switch (firebaseError.code) {
          case "auth/invalid-credential":
            setError("Email atau password salah.");
            break;

          case "auth/invalid-email":
            setError("Format email tidak valid.");
            break;

          case "auth/user-disabled":
            setError("Akun ini telah dinonaktifkan.");
            break;

          case "auth/too-many-requests":
            setError(
              "Terlalu banyak percobaan login. Silakan coba lagi nanti."
            );
            break;

          default:
            setError("Login gagal. Silakan coba lagi.");
        }
      } else {
        setError("Login gagal. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex flex-col items-center justify-center px-4 py-8 sm:p-6">
      {/* Logo & Header */}
      <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
        <Heart
          className="w-5 h-5 sm:w-6 sm:h-6 fill-[#B87A5E] text-[#B87A5E] mb-2 sm:mb-3"
        />

        <h1 className="font-serif text-2xl sm:text-3xl tracking-wide text-[#3D2E24] mb-1">
          TBN Wedding Organizer
        </h1>

        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#8C7361] font-medium">
          ADMIN LOGIN
        </p>
      </div>

      {/* Card Form */}
      <div className="w-full max-w-md bg-[#FAF8F5] p-5 sm:p-8 md:p-10 shadow-sm border border-[#EFEBE4] rounded-sm">
        <form
          onSubmit={handleLogin}
          className="space-y-4 sm:space-y-6"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] sm:text-xs uppercase tracking-wider text-[#6E5544] font-semibold mb-1.5 sm:mb-2"
            >
              EMAIL
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tbnwedding.com"
              autoComplete="email"
              disabled={loading}
              className="w-full px-3.5 py-2.5 sm:py-3 bg-[#F5F0E8] border border-[#E8DFD1] text-[#6E5544] text-base sm:text-sm focus:outline-none focus:border-[#B87A5E] transition-colors disabled:opacity-60"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-[11px] sm:text-xs uppercase tracking-wider text-[#6E5544] font-semibold mb-1.5 sm:mb-2"
            >
              PASSWORD
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="current-password"
                disabled={loading}
                className="w-full px-3.5 py-2.5 sm:py-3 bg-[#F5F0E8] border border-[#E8DFD1] text-[#6E5544] text-base sm:text-sm focus:outline-none focus:border-[#B87A5E] transition-colors pr-11 disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7361] hover:text-[#B87A5E] p-1 disabled:opacity-50"
                aria-label={
                  showPassword
                    ? "Sembunyikan password"
                    : "Tampilkan password"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B87A5E] hover:bg-[#A3694E] active:bg-[#965A40] disabled:bg-[#C7A493] disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-3.5 tracking-wider text-xs sm:text-sm transition-colors uppercase mt-2 rounded-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                LOGIN...
              </>
            ) : (
              "LOGIN"
            )}
          </button>
        </form>
      </div>

      {/* Navigation Link */}
      <div className="mt-6 sm:mt-8">
        <Link
          href="/"
          className="text-[11px] sm:text-xs tracking-widest text-[#8C7361] hover:text-[#B87A5E] uppercase transition-colors flex items-center gap-1 font-medium py-2"
        >
          ← KEMBALI KE WEBSITE
        </Link>
      </div>
    </div>
  );
}