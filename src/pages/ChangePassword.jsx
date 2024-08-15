import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function ChangePassword() {
  const [form, setForm] = useState({});
  const { user, isLoading, logout } = useAuth0();
  const [accessToken, setAccessToken] = useState("");
  const [updateStatus, setUpdateStatus] = useState("idle");
  const getAccessToken = async () => {
    const response = await fetch(
      `https://${import.meta.env.VITE_AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: import.meta.env.VITE_AUTH0_API_CLIENT_ID,
          client_secret: import.meta.env.VITE_AUTH0_API_CLIENT_SECRET,
          audience: import.meta.env.VITE_AUTH0_API_AUDIENCE,
          grant_type: "client_credentials",
        }),
      }
    );
    return response.json();
  };
  const verifyPassword = async () => {
    const response = await fetch(
      `https://${import.meta.env.VITE_AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: import.meta.env.VITE_AUTH0_API_CLIENT_ID,
          client_secret: import.meta.env.VITE_AUTH0_API_CLIENT_SECRET,
          audience: import.meta.env.VITE_AUTH0_API_AUDIENCE,
          grant_type: "password",
          username: user.email,
          password: form.old_password,
        }),
      }
    );
    return response.ok;
  };
  const updatePassword = async () => {
    const id = user.sub;
    setUpdateStatus("pending");
    const response = await fetch(
      `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          password: form.password,
          connection: "Username-Password-Authentication",
        }),
      }
    );
    setUpdateStatus("idle");
    return response.ok;
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const { password, confirm_password } = form;
    const verifyPasswordStatus = await verifyPassword();
    if (!verifyPasswordStatus) {
      return toast.error("Mật khẩu cũ không chính xác");
    }
    if (password !== confirm_password) {
      return toast.error("Mật khẩu nhập lại không khớp");
    }
    const status = await updatePassword();
    if (status) {
      toast.success(
        "Thay đổi mật khẩu thành công. Hệ thống sẽ tự động đăng xuất sau 2 giây"
      );
      setTimeout(() => {
        logout({ logoutParams: { returnTo: import.meta.env.VITE_APP_URL } });
      }, 2000);
    } else {
      toast.error("Thay đổi mật khẩu thất bại");
    }
    setForm({});
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    (async () => {
      const { access_token } = await getAccessToken();
      setAccessToken(access_token);
    })();
  }, [isLoading]);
  return (
    <div className="w-50 mx-auto py-3">
      <h1>Change Password</h1>
      <form
        action=""
        onSubmit={handleSubmitForm}
        style={{ position: "relative" }}
      >
        {updateStatus === "pending" && (
          <div
            className="overlay"
            id="loading"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              opacity: "0.5",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status"></div>
            </div>
          </div>
        )}
        <fieldset disabled={updateStatus === "pending"}>
          <div className="mb-3">
            <label htmlFor="">Mật khẩu cũ</label>
            <input
              type="password"
              name="old_password"
              className="form-control"
              placeholder="Mật khẩu cũ..."
              value={form.old_password ?? ""}
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="">Mật khẩu</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Mật khẩu..."
              value={form.password ?? ""}
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="">Nhập lại mật khẩu</label>
            <input
              type="password"
              name="confirm_password"
              className="form-control"
              placeholder="Nhập lại mật khẩu..."
              value={form.confirm_password ?? ""}
              required
              onChange={handleChange}
            />
          </div>

          <div className="d-grid">
            <button className="btn btn-primary">Cập nhật</button>
          </div>
        </fieldset>
      </form>
      <ToastContainer />
    </div>
  );
}
