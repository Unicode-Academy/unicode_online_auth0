import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Account() {
  const { user, isLoading, getAccessTokenSilently, getAccessTokenWithPopup } =
    useAuth0();
  const [form, setForm] = useState({});
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
  const updateUser = async (form) => {
    const id = user.sub;
    const { access_token: accessToken } = await getAccessToken();
    const response = await fetch(
      `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
      }
    );
    return response.ok;
  };
  const updateAccessToken = async () => {
    try {
      await getAccessTokenSilently({
        cacheMode: "off",
      });
    } catch (error) {
      getAccessTokenWithPopup();
    }
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    let isUpdateEmail = false;
    if (user.email === form.email) {
      delete form.email;
    } else {
      isUpdateEmail = true;
    }
    const status = await updateUser(form);
    if (status) {
      if (isUpdateEmail) {
        toast.success("Cập nhật tài khoản thành công. Vui lòng đăng nhập lại.");
      } else {
        toast.success("Cập nhật tài khoản thành công");
      }
      updateAccessToken();
      return;
    }

    toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau");
  };
  const handleChangeValue = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setForm({ name: user?.name, email: user?.email });
  }, [isLoading, user]);
  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  return (
    <div className="w-50 mx-auto">
      <h1>Account</h1>
      <form action="" onSubmit={handleSubmitForm}>
        <div className="mb-3">
          <label htmlFor="">Tên</label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Tên..."
            defaultValue={user?.name}
            // value={form.name ?? ""}
            onChange={handleChangeValue}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email..."
            defaultValue={user?.email}
            // value={form.email ?? ""}
            onChange={handleChangeValue}
            required
          />
        </div>
        <div className="d-grid">
          <button className="btn btn-primary">Cập nhật</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
