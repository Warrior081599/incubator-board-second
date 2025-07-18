"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Lightbulb, Loader2 } from "lucide-react";
import { GoogleIcon } from "../ui/google-icon";
interface AuthFormProp {
  mode: "signin" | "signup";
}

export function AuthForm({ mode }: AuthFormProp) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "signin") {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid Credentials");
        } else {
          router.push("/dashboard");
        }
      } else {
        // Validate passwords match for signup
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long");
          setIsLoading(false);
          return;
        }

        // Handle signup using credentials provider
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          name: formData.name, // Add name field for signup
          isSignup: "true", // Add signup flag
          redirect: false,
        });

        if (result?.error) {
          setError("User already exists or signup failed");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      setError("Something went wrong: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  //Google oAuth Logic below:

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      setError("Google Sign-In Failed, Please try again" + error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Logo and Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Lightbulb className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Idea Incubator Board
        </h1>
        <p className="text-gray-600">
          {mode === "signin"
            ? "Welcome back! Sign in to your account"
            : "Create your account to get started"}
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="w-full h-11 text-base font-medium gap-3"
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon className="w-5 h-5" />
              )}

              {isGoogleLoading ? "Signing in...." : "Continue with Google"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    disabled={isLoading || isGoogleLoading}
                    required
                    className="h-11"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={isLoading || isGoogleLoading}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  disabled={isLoading || isGoogleLoading}
                  required
                  className="h-11"
                />
              </div>

              {/* Confirm Password Field - Only for Signup */}
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    disabled={isLoading || isGoogleLoading}
                    required
                    className="h-11"
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full h-11 text-base font-medium"
            >
              {isLoading
                ? "Loading..."
                : mode === "signin"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          {/* Demo Credentials for Sign In */}
          {mode === "signin" && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Demo Credentials:
              </p>
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  <strong>Email:</strong> user@example.com
                </p>
                <p>
                  <strong>Password:</strong> password123
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            <div className="mt-4">
              <Link href={mode === "signin" ? "/signup" : "/signin"}>
                <Button variant="outline" className="w-full">
                  {mode === "signin" ? "Create new account" : "Sign in instead"}
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
