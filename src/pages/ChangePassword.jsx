import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function ChangePassword() {
  const [form, setForm] = useState({});
  const [accessToken, setAccessToken] = useState("");
  const { isLoading, user } = useAuth0();
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
  const updatePassword = async () => {
    const id = user.sub;
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
    return response.ok;
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const { password, confirm_password } = form;
    if (password !== confirm_password) {
      return toast.error("Mật khẩu nhập lại không khớp");
    }
    const status = await updatePassword();
    if (status) {
      toast.success("Thay đổi mật khẩu thành công");
    } else {
      toast.error("Thay đổi mật khẩu thất bại");
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    (async () => {
      const response = await getAccessToken();
      setAccessToken(response.access_token);
    })();
  }, []);

  return (
    <div className="w-50 mx-auto py-3">
      <h1>Change Password</h1>
      <form
        action=""
        onSubmit={handleSubmitForm}
        style={{ position: "relative" }}
      >
        <fieldset>
          <div className="mb-3">
            <label htmlFor="">Mật khẩu</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Mật khẩu..."
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
