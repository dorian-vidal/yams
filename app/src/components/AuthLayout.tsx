import { ReactElement } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

export const AuthLayout = (props: {
  should_be_auth: boolean;
}): ReactElement => {
  const location = useLocation();
  const isLogged = (): boolean => {
    return !!localStorage.getItem("token") == props.should_be_auth;
  };
  const getRouteToRedirect = (): string => {
    return props.should_be_auth ? "/connexion" : "/yams";
  };

  return (
    <>
      <Header />

      {isLogged() ? (
        <Outlet />
      ) : (
        <Navigate
          to={getRouteToRedirect()}
          replace
          state={{ from: location }}
        />
      )}
    </>
  );
};
