// File: app/(blank-layout-pages)/login/page.tsx

import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/libs/auth";
import { getServerMode } from "@core/utils/serverHelpers";
import Login from "@views/Login";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const LoginPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.requiresOtp) {
      redirect("/otp");
    } else {
      redirect("/dashboard");
    }
  }

  const mode = getServerMode();

  return <Login mode={mode} />;
};

export default LoginPage;
