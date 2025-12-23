import { useAuth } from "../../../context/AuthContext";

export default function ProfileDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>👤 My Profile</h1>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}
