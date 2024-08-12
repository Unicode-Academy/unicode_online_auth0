import { useAuth0 } from "@auth0/auth0-react";
export default function App() {
  const { loginWithPopup, user, isLoading, isAuthenticated, logout } =
    useAuth0();
  console.log(user);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}
    >
      {isLoading ? (
        <p>Loading...</p>
      ) : isAuthenticated ? (
        <>
          <p>{user.nickname}</p>
          <button
            onClick={() =>
              logout({
                logoutParams: { returnTo: import.meta.env.VITE_APP_URL },
              })
            }
          >
            Logout
          </button>
        </>
      ) : (
        <button
          // onClick={() =>
          //   loginWithRedirect({
          //     authorizationParams: {
          //       ui_locales: "vi",
          //     },
          //   })
          // }
          onClick={() =>
            loginWithPopup({
              authorizationParams: {
                ui_locales: "vi",
              },
            })
          }
        >
          Login
        </button>
      )}
    </div>
  );
}
