import React from "react";

type AuthContextProviderProps = {
  children: React.ReactNode;
};
export const AuthWrapper = ({ children }: AuthContextProviderProps) => {
  return <>{children}</>;
};
