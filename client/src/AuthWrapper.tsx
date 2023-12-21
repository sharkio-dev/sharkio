import React, { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import { supabaseClient } from "./utils/supabase-auth";
import { BackendAxios } from "./api/backendAxios";
import { useNavigate } from "react-router-dom";
import { routes } from "./constants/routes";

type AuthContextProviderProps = {
  children: React.ReactNode;
};
export const AuthWrapper = ({ children }: AuthContextProviderProps) => {
  const { signIn } = useAuthStore();
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  // When getting back to the page - make sure the data is kepy synched
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
          email: session?.user.id ?? userDetails?.email,
          profileImg: userDetails?.avatar_url,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // When logging in - make sure the handler is connected well
  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((authEvent, session) => {
      switch (authEvent) {
        case "SIGNED_IN": {
          BackendAxios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${session?.access_token}`;
          setLoading(false);

          const userDetails = session?.user.user_metadata;
          signIn({
            id: session?.user.id ?? "",
            fullName: userDetails?.full_name,
            email: session?.user?.email ?? userDetails?.email,
            profileImg: userDetails?.avatar_url,
          });

          // Create a guard against renavigation when returning to the session
          if (window.location.pathname === "/login") {
            navigate(routes.LIVE_INVOCATIONS);
          }
          break;
        }
        default: {
          break;
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
