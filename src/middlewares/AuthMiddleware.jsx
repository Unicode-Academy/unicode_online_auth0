import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";

export default function AuthMiddleware() {
  const Component = withAuthenticationRequired(Outlet, {
    onRedirecting: () => <h3>Loading...</h3>,
  });
  return <Component />;
}
