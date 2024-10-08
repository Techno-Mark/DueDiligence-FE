// File: app/(blank-layout-pages)/otp/page.tsx

import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/libs/auth";
import { getServerMode } from "@core/utils/serverHelpers";
import OtpVerification from "@views/OtpVerification";

export const metadata: Metadata = {
  title: "OTP Verification",
  description: "Enter your One-Time Password",
};

const OtpPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user && session.user.requiresOtp === false) {
    redirect("/home");
  }

  const mode = getServerMode();

  return <OtpVerification mode={mode} />;
};

export default OtpPage;
