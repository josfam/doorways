import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import StudentList from "../components/admin/StudentList";
import LecturerList from "../components/admin/LecturerList";
import SecurityGuardList from "../components/admin/SecurityGuardList";

const AdminPage = () => {
  return (
    <>
      <div className="w-full bg-orange-300 p-2">
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>
      <div className="pt-20">
        <div className="h-[650px] rounded-lg border-2 border-slate-400 bg-slate-400 p-10">
          <Tabs
            defaultValue="students"
            className="flex flex-col gap-8 lg:w-[1400px]"
          >
            <div>
              <TabsList className="grid w-full grid-cols-3 gap-6">
                <TabsTrigger value="students" className="!bg-white">
                  Students
                </TabsTrigger>
                <TabsTrigger value="lecturers" className="!bg-white">
                  Lecturers
                </TabsTrigger>
                <TabsTrigger value="security-guards" className="!bg-white">
                  Security Guards
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="students">
              <StudentList />
            </TabsContent>
            <TabsContent value="lecturers">
              <LecturerList />
            </TabsContent>
            <TabsContent value="security-guards">
              <SecurityGuardList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
