/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Account() {
  const { user, isLoading, getAccessTokenSilently, getAccessTokenWithPopup } =
    useAuth0();
  const [currentUser, setCurrentUser] = useState({});
  const [form, setForm] = useState({});
  const [userStatus, setUserStatus] = useState("pending");
  const [updateStatus, setUpdateStatus] = useState("idle");
  const [accessToken, setAccessToken] = useState("");
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
  const getUser = async () => {
    if (user?.sub) {
      const id = user.sub;
      const { access_token: accessToken } = await getAccessToken();
      setAccessToken(accessToken);
      const response = await fetch(
        `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setCurrentUser(data);
      setUserStatus("success");
    }
  };
  const updateUser = async (form) => {
    const id = user.sub;
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
    let isUpdateEmailOrPhone = false;

    const { address, interest, ...rest } = form;
    if (user.email === rest.email) {
      delete rest.email;
    }
    if (currentUser.phone_number === rest.phone_number) {
      delete rest.phone_number;
    } else {
      isUpdateEmailOrPhone = true;
    }
    rest.user_metadata = {
      address,
      interest,
    };

    setUpdateStatus("pending");
    const status = await updateUser(rest);
    setUpdateStatus("idle");
    if (status) {
      if (isUpdateEmailOrPhone) {
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
    getUser();
  }, [isLoading]);
  useEffect(() => {
    setForm({
      ...form,
      name: currentUser.name,
      email: currentUser.email,
      phone_number: currentUser.phone_number,
      address: currentUser.user_metadata?.address,
      interest: currentUser.user_metadata?.interest,
    });
  }, [currentUser]);

  return (
    <div className="w-50 mx-auto">
      <h1>Account</h1>
      <form
        action=""
        onSubmit={handleSubmitForm}
        style={{ position: "relative" }}
      >
        {(userStatus === "pending" || updateStatus === "pending") && (
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
        <fieldset
          disabled={userStatus === "pending" || updateStatus === "pending"}
        >
          <div className="mb-3">
            <label htmlFor="">Tên</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Tên..."
              value={form?.name ?? ""}
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
              value={form?.email ?? ""}
              onChange={handleChangeValue}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="">Điện thoại</label>
            <input
              type="text"
              name="phone_number"
              className="form-control"
              placeholder="Số điện thoại..."
              value={form?.phone_number ?? ""}
              onChange={handleChangeValue}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="">Địa chỉ</label>
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="Địa chỉ..."
              value={form?.address ?? ""}
              onChange={handleChangeValue}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="">Sở thích</label>
            <input
              type="text"
              name="interest"
              className="form-control"
              placeholder="Sở thích..."
              value={form?.interest ?? ""}
              onChange={handleChangeValue}
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
