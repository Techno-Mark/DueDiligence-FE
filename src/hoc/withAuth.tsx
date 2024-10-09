"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect } from "react";

interface SessionUser {
  role: string;
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface WithAuthProps {
  [key: string]: any;
}

const withAuth = <P extends object>(
  Component: ComponentType<P>,
  allowedRoles: string[]
) => {
  return (props: WithAuthProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      // Check if session is loading
      if (status === "loading") return;

      // Ensure user and role are valid
      const user = session?.user as SessionUser | undefined;
      if (!user || !allowedRoles.includes(user.role)) {
        router.push("/login");
      }
    }, [router, session, status, allowedRoles]);

    if (status === "loading") return <div>Loading...</div>;

    // If we reach here, user has valid access
    return <Component {...(props as P)} />;
  };
};

export default withAuth;
