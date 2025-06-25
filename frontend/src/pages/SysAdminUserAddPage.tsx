import { UserFileUploader } from "@/components/admin/UserFileUploader";

export const SysAdminUserAddPage = () => {
  // const inputId = "file-upload";  // accessibility
  const studentFormatInstructions = (
    <>
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold italic">
          student id,email,surname,given name,phone number,course name,role name
        </span>
        <span className="pt-2">See the example below</span>
      </p>
      <hr className="mb-2" />
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold">
          student id,email,surname,given name,phone number,course name,role name
        </span>
        <span>
          100001<span className="font-bold">,</span>
          mm100001@students.cavendish.ac.ug
          <span className="font-bold">,</span>Moreau
          <span className="font-bold">,</span>Marie
          <span className="font-bold">,</span>0779987779
          <span className="font-bold">,</span>Master of Public Health
          <span className="font-bold">,</span>student
        </span>
      </p>
    </>
  );

  const lecturerFormatInstructions = (
    <>
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold italic">
          lecturer id,email,surname,given_name,phone number,faculty name,role
          name
        </span>
        <span className="pt-2">See the example below</span>
      </p>
      <hr className="mb-2" />
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold">
          lecturer id,email,surname,given_name,phone number,faculty name,role
          name
        </span>
        <span>
          100006<span className="font-bold">,</span>
          euler@cavendish.ac.ug
          <span className="font-bold">,</span>Euler
          <span className="font-bold">,</span>Marie
          <span className="font-bold">,</span>0779987779
          <span className="font-bold">,</span>Faculty of Science and Technology
          <span className="font-bold">,</span>lecturer
        </span>
      </p>
    </>
  );

  const securityGuardFormatInstructions = (
    <>
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold italic">
          security id, email, surname, given name, phone number, security
          company,role name
        </span>
        <span className="pt-2">See the example below</span>
      </p>
      <hr className="mb-2" />
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold">
          security id, email, surname, given name, phone number, security
          company,role name
        </span>
        <span>
          100010<span className="font-bold">,</span>
          asilvia@security.cavendish.ac.ug
          <span className="font-bold">,</span>Akol
          <span className="font-bold">,</span>Silvia
          <span className="font-bold">,</span>0777117177
          <span className="font-bold">,</span>Securex
          <span className="font-bold">,</span>security guard
        </span>
      </p>
    </>
  );

  const sysAdminFormatInstructions = (
    <>
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold italic">
          sys admin id,email,surname,given name,phone number,role name
        </span>
        <span className="pt-2">See the example below</span>
      </p>
      <hr className="mb-2" />
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold">
          sys admin id,email,surname,given name,phone number,role name
        </span>
        <span>
          000001<span className="font-bold">,</span>
          llubega@cavendish.ac.ug
          <span className="font-bold">,</span>Lubega
          <span className="font-bold">,</span>Jordan
          <span className="font-bold">,</span>0780883456
          <span className="font-bold">,</span>sys admin
        </span>
      </p>
    </>
  );

  const AdminFormatInstructions = (
    <>
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold italic">
          admin id,email,surname,given name,phone number,course name,role name
        </span>
        <span className="pt-2">See the example below</span>
      </p>
      <hr className="mb-2" />
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold">
          admin id,email,surname,given name,phone number,course name,role name
        </span>
        <span>
          200001<span className="font-bold">,</span>
          sreghabi@cavendish.ac.ug
          <span className="font-bold">,</span>Reghabi
          <span className="font-bold">,</span>Stacy
          <span className="font-bold">,</span>0777974569
          <span className="font-bold">,</span>admin
        </span>
      </p>
    </>
  );

  return (
    <>
      <h1 className="page-header">Add users</h1>
      <div className="grid w-5/6 grid-cols-1 gap-6 xl:grid-cols-2">
        <UserFileUploader
          userType="sys-admins"
          formatInstructions={sysAdminFormatInstructions}
        />
        <UserFileUploader
          userType="lecturers"
          formatInstructions={lecturerFormatInstructions}
        />
        <UserFileUploader
          userType="students"
          formatInstructions={studentFormatInstructions}
        />
        <UserFileUploader
          userType="admins"
          formatInstructions={AdminFormatInstructions}
        />
        <UserFileUploader
          userType="security-guards"
          formatInstructions={securityGuardFormatInstructions}
        />
      </div>
    </>
  );
};
