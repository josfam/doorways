import StudentList from "@/components/admin/StudentList";
import LecturerList from "@/components/admin/LecturerList";
import SecurityGuardList from "@/components/admin/SecurityGuardList";
import AdminList from "@/components/admin/AdminList";
import SysAdminList from "@/components/admin/SysAdminList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { role_names } from "@/constants";

export const SysAdminUserViewPage = () => {
  return (
    <>
      <h1 className="page-header">View users</h1>
      <div className="flex w-full flex-col items-center justify-center">
        <Tabs defaultValue={role_names.student} className="w-full">
          <TabsList className="mb-4 border-2 border-amber-200 bg-amber-50 px-4 py-8">
            {Object.keys(role_names).map((roleName) => (
              <TabsTrigger
                key={roleName}
                value={roleName}
                className="px-4 text-2xl capitalize"
              >
                {roleName}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={role_names.student}>
            <StudentList />
          </TabsContent>
          <TabsContent value={role_names.lecturer}>
            <LecturerList />
          </TabsContent>
          <TabsContent value={role_names.security}>
            <SecurityGuardList />
          </TabsContent>
          <TabsContent value={role_names.admin}>
            <AdminList />
          </TabsContent>
          <TabsContent value={role_names["sys admin"]}>
            <SysAdminList />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
