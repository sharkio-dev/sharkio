import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Session } from '@supabase/supabase-js';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { supabaseClient } from '../../utils/supabase-auth';
import styles from './auth.module.scss';

export const AuthUI: React.FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <>
        <div className={styles.auth}>
          <Auth
            supabaseClient={supabaseClient}
            theme="light"
            appearance={{ theme: ThemeSupa }}
            providers={['github']}
            view="sign_in"
          />
        </div>
      </>
    );
  } else {
    return children;
  }
};

export default AuthUI;
