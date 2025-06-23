import { UserFileUploader } from "@/components/admin/UserFileUploader";

export const SysAdminUserAddPage = () => {
  // const inputId = "file-upload";  // accessibility
  const studentFormatInstructions = (
    <>
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold italic">
          student id,email,surname,given name,phone number,course name
        </span>
        <span className="pt-2">See the example below</span>
      </p>
      <hr className="mb-2" />
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold">
          student id,email,surname,given name,phone number,course name
        </span>
        <span>
          100001<span className="font-bold">,</span>
          mm100001@students.cavendish.ac.ug
          <span className="font-bold">,</span>Moreau
          <span className="font-bold">,</span>Marie
          <span className="font-bold">,</span>0779987779
          <span className="font-bold">,</span>Master of Public Health
        </span>
      </p>
    </>
  );

  const lecturerFormatInstructions = (
    <>
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold italic">
          lecturer id,email,surname,given_name,phone number,faculty name
        </span>
        <span className="pt-2">See the example below</span>
      </p>
      <hr className="mb-2" />
      <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
        <span className="font-bold">
          lecturer id,email,surname,given_name,phone number,faculty name
        </span>
        <span>
          100006<span className="font-bold">,</span>
          euler@cavendish.ac.ug
          <span className="font-bold">,</span>Euler
          <span className="font-bold">,</span>Marie
          <span className="font-bold">,</span>0779987779
          <span className="font-bold">,</span>Faculty of Science and Technology
        </span>
      </p>
    </>
  );
  return (
    <>
      <h1 className="page-header">Add users</h1>
      <div className="grid w-5/6 grid-cols-1 gap-6 xl:grid-cols-2">
        <UserFileUploader
          userType="students"
          formatInstructions={studentFormatInstructions}
        />
        <UserFileUploader
          userType="lecturers"
          formatInstructions={lecturerFormatInstructions}
        />
      </div>
    </>
  );
};
