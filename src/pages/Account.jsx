import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export default function Account() {
  const { user, isLoading } = useAuth0();
  console.log(user);

  const [form, setForm] = useState({});
  const handleSubmitForm = (e) => {
    e.preventDefault();
    console.log(form);
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
            defaultValue={user.name}
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
            defaultValue={user.email}
            // value={form.email ?? ""}
            onChange={handleChangeValue}
            required
          />
        </div>
        <div className="d-grid">
          <button className="btn btn-primary">Cập nhật</button>
        </div>
      </form>
    </div>
  );
}
