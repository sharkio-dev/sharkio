import React, { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import { supabaseClient } from "./utils/supabase-auth";
import { setAuthCookie } from "./api/api";

type AuthContextProviderProps = {
  children: React.ReactNode;
};
export const AuthWrapper = ({ children }: AuthContextProviderProps) => {
  const { signIn } = useAuthStore();

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session === null) {
        return;
      }
      const userDetails = session?.user.user_metadata;

      signIn({
        id: session?.user.id ?? "",
        fullName: userDetails?.full_name,
        email: userDetails?.email,
        profileImg: userDetails?.avatar_url,
      });
    });
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        setAuthCookie(event, session).then((res) => {
          if (!res.ok) return;
        });
      }
    });
    return () => subscription.unsubscribe();
  });

  return children;
};
