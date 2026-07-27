import Navbar from "../../screens/AdminScreens/Reuseables/Navbar";
import AdminLoginForm from "../../screens/AdminScreens/Reuseables/AdminLoginForm";
import AdminLoginButton from "../../screens/AdminScreens/Reuseables/AdminLoginButton";
const AdminLogin = () => {
  return (
    <>
      <Navbar />
      <AdminLoginForm />
      <AdminLoginButton />
    </>
  );
};

export default AdminLogin;