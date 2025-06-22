import { UserFileUploader } from "@/components/admin/UserFileUploader";

export const SysAdminUserAddPage = () => {
  // const inputId = "file-upload";  // accessibility
  const studentFormatInstructions = (
    <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
      <span className="font-bold italic">
        surname, given name, email, phone number, course
      </span>
      <span className="pt-2">See the example below</span>
      <hr className="mb-2" />
      <span className="font-bold">
        surname, given name, email, phone number, course
      </span>
      <span className="">
        Namukwaya<span className="font-bold">,</span> Elizabeth
        <span className="font-bold">,</span> ne@students.cavendish.ac.ug
        <span className="font-bold">,</span> 0778956421
        <span className="font-bold">,</span> Bachelor of Public Health
      </span>
    </p>
  );

  const lecturerFormatInstructions = (
    <p className="flex h-max flex-col gap-2 p-4 text-lg text-sky-700">
      <span className="font-bold italic">
        surname, given name, email, phone number, faculty
      </span>
      <span className="pt-2">See the example below</span>
      <hr className="mb-2" />
      <span className="font-bold">
        surname, given name, email, phone number, faculty
      </span>
      <span className="">
        Kavivya<span className="font-bold">,</span> Tristan
        <span className="font-bold">,</span> tk@cavendish.ac.ug
        <span className="font-bold">,</span> 0778956421
        <span className="font-bold">,</span> Faculty of Science and Technology
      </span>
    </p>
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
