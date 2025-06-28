import StudentList from "@/components/admin/StudentList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { role_names } from "@/constants";

export const SysAdminUserViewPage = () => {
  return (
    <>
      <h1 className="page-header">View users</h1>
      <div className="flex w-full flex-col items-center justify-center">
        <Tabs defaultValue="Student" className="w-full">
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
            {/* Content for lecturers */}
          </TabsContent>
          <TabsContent value={role_names.security}>
            {/* Content for security */}
          </TabsContent>
          <TabsContent value={role_names["sys admin"]}>
            {/* Content for sys admins */}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
