import { Button, Input } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../../api/api";
import { BackendAxios } from "../../api/backendAxios";
import { routes } from "../../constants/routes";
import { useAuthStore } from "../../stores/authStore";

export const AuthUI: React.FC<PropsWithChildren> = ({ children }) => {
  const { user, signIn } = useAuthStore();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  if (user?.email == null) {
    return (
      <div className="h-full flex flex-1 flex-col bg-tertiary justify-center p-4">
        <div className="flex flex-col w-3/4 mx-auto md:w-1/2">
          <div className="text-4xl font-bold text-center mb-16 font-mono">
            <div>Login to Sharkio</div>
          </div>
          <Input
            type="email"
            placeholder="Email"
            className="mb-4"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            type="password"
            placeholder="Password"
            className="mb-4"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            className="mb-4"
            onClick={() => {
              loginAPI(email, password).then((res) => {
                BackendAxios.defaults.headers.common["Authorization"] =
                  res;
                signIn({ "id": "", "email": email, "fullName": "Test User", "profileImg": "" });
                navigate(routes.LIVE_INVOCATIONS);
              });
            }}
          >
            Login
          </Button>
        </div>
      </div>
    );
  } else {
    return <>{children}</>;
  }
};

export default AuthUI;
