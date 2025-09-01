"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function AuthPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [supabase, router]);

  const signInWithGoogle = async () => {
    if (!captchaToken) {
      setError("Captcha verification required.");
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setCaptchaToken(null);
  };

  const handleSignup = async () => {
    setError(null);
    if (!captchaToken) {
      setError("Captcha verification required.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert({
          id: data.user.id,
          username,
        });

      if (profileError) {
        setError("Signup succeeded but username failed: " + profileError.message);
      } else {
        alert("Signup successful. Please verify your email before logging in.");
      }
    }
    setCaptchaToken(null);
  };

  const handleLogin = async () => {
    setError(null);
    if (!captchaToken) {
      setError("Captcha verification required.");
      return;
    }

    try {
      let userEmail = email;

      if (username && !email) {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("username", username)
          .single();

        if (error || !data) {
          setError("Invalid username.");
          return;
        }

        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
          data.id
        );

        if (userError || !userData.user?.email) {
          setError("Could not resolve username to email.");
          return;
        }

        userEmail = userData.user.email;
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password,
      });

      if (loginError) {
        setError(loginError.message);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setCaptchaToken(null);
  };

  const handleAuth = async () => {
    if (isLogin) {
      await handleLogin();
    } else {
      await handleSignup();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="Zenardy Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {isLogin ? "Login to Zenardy" : "Sign up for Zenardy"}
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-500 bg-red-100 dark:bg-red-900 p-2 rounded">
            {error}
          </p>
        )}

        {/* Username (only on signup OR optional for login) */}
        {!isLogin && (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            className="w-full mb-3 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        )}

        {isLogin && (
          <input
            type="text"
            value={username || email}
            onChange={(e) =>
              e.target.value.includes("@")
                ? setEmail(e.target.value)
                : setUsername(e.target.value)
            }
            placeholder="Email or Username"
            className="w-full mb-3 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        )}

        {/* Password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
        />

        {/* hCaptcha */}
        <div className="mb-4">
          <HCaptcha
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken(null)}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleAuth}
          disabled={!captchaToken}
          className={`w-full mb-4 font-medium py-2 px-4 rounded-lg transition 
            ${captchaToken ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        {/* Google OAuth */}
        <button
          onClick={signInWithGoogle}
          disabled={!captchaToken}
          className={`w-full flex items-center justify-center gap-3 font-medium py-2 px-4 rounded-lg transition mb-4
            ${captchaToken ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google logo"
            className="h-5 w-5"
          />
          {isLogin ? "Login with Google" : "Sign up with Google"}
        </button>

        {/* Toggle */}
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
