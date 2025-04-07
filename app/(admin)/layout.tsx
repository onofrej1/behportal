import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { Navbar } from "@/components/admin-panel/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminPanelLayout>
      <Navbar title={"test"} />
      <div className="p-6">{children}</div>
      {/*<ContentLayout title="test">{children}</ContentLayout>*/}
    </AdminPanelLayout>
  );
}
