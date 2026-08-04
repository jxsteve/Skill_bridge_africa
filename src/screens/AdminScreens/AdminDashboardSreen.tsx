import AdminNavbar from "../../screens/AdminScreens/Reuseables/AdminNavbar";
import WelcomeCard from "../../screens/AdminScreens/Reuseables/WelcomeCard";
import DashboardStats from "../../screens/AdminScreens/Reuseables/DashboardStats";
import QuickActions from "../../screens/AdminScreens/Reuseables/QuickActions";
import PendingVerifications from "../../screens/AdminScreens/Reuseables/PendingVerifications";
import EscrowActivity from "../../screens/AdminScreens/Reuseables/EscrowActivity";
import BottomNavigation from "../../screens/AdminScreens/Reuseables/AdminBottomNavigation";


const AdminDashboard = () => {
  return (
    <>
      <AdminNavbar />
      <WelcomeCard />
      <DashboardStats />
      <QuickActions />
      <PendingVerifications />
      <EscrowActivity />
      - <BottomNavigation />
    </>
  );
};

export default AdminDashboard;