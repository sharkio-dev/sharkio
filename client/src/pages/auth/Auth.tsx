import { Typography } from "@mui/material";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";
import React, { PropsWithChildren, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { supabaseClient } from "../../utils/supabase-auth";
import styles from "./auth.module.scss";

export const AuthUI: React.FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>();
  const { signIn, user } = useAuthStore();

  if (user?.email == null || user?.id == null) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <img className={styles.sharkioLogo} src="shark-logo.png" alt="Logo" />
          <Typography variant="h3">Welcome to sharkio!</Typography>
        </div>
        <div className={styles.auth}>
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
