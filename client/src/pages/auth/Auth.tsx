import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import React, { PropsWithChildren } from "react";
import { useAuthStore } from "../../stores/authStore";
import { supabaseClient } from "../../utils/supabase-auth";

export const AuthUI: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuthStore();

  if (user?.email == null || user?.id == null) {
    return (
      <div className="flex flex-1 flex-col bg-tertiary justify-center p-4">
        <div className="flex flex-col w-3/4 mx-auto md:w-1/2">
          <div className="text-4xl font-bold text-center mb-16 font-mono">
            <div>Login to Sharkio</div>
          </div>
          <Auth
            supabaseClient={supabaseClient}
            theme="dark"
            appearance={{ theme: ThemeSupa }}
            providers={["github", "google"]}
            view="sign_up"
            redirectTo={window.location.pathname}
          />
        </div>
      </div>
    );
  } else {
    return <>{children}</>;
  }
};

export default AuthUI;
