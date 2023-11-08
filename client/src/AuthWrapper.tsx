import React, { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import { supabaseClient } from "./utils/supabase-auth";
import { BackendAxios } from "./api/backendAxios";

type AuthContextProviderProps = {
  children: React.ReactNode;
};
export const AuthWrapper = ({ children }: AuthContextProviderProps) => {
  const { signIn } = useAuthStore();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    supabaseClient.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session === null) {
          return;
        }
        const userDetails = session?.user.user_metadata;
        BackendAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${session?.access_token}`;

        signIn({
          id: session?.user.id ?? "",
          fullName: userDetails?.full_name,
          email: userDetails?.email,
          profileImg: userDetails?.avatar_url,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_, session) => {
      BackendAxios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${session?.access_token}`;
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
};
