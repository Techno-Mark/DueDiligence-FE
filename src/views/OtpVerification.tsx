// File: components/views/OtpVerification.tsx
"use client";
// File: components/views/OtpVerification.tsx

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type FormData = {
  otp: string;
};

const OtpVerification: React.FC<{ mode: string }> = ({ mode }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const tempEmail = sessionStorage.getItem("tempEmail");
    if (!tempEmail) {
      toast.error("No email found. Please login again.");
      router.push("/login");
    } else {
      setEmail(tempEmail);
    }
  }, [router]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const email = sessionStorage.getItem("tempEmail"); // Retrieve the email from sessionStorage
      if (!email) {
        throw new Error("Email not found. Please try logging in again.");
      }

      const res = await signIn("credentials", {
        email: email,
        otp: data.otp,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else if (res?.ok) {
        sessionStorage.removeItem("tempEmail"); // Clear the temporary email
        toast.success("Login successful");
        router.push("/home");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Enter OTP</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="otp">
                OTP
              </label>
              <input
                type="text"
                placeholder="Enter your OTP"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                {...register("otp", {
                  required: "OTP is required",
                  minLength: {
                    value: 6,
                    message: "OTP must be 6 characters long",
                  },
                  maxLength: {
                    value: 6,
                    message: "OTP must be 6 characters long",
                  },
                })}
              />
            </div>
            {errors.otp && (
              <span className="text-xs text-red-500">{errors.otp.message}</span>
            )}
          </div>
          <div className="flex items-baseline justify-between">
            <button
              type="submit"
              className={`px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
