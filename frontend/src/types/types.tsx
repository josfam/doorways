export type JwtPayload = {
  id: string;
  email: string;
  role_name: string;
  expiration: string;
  code_time_out: number;
};

export type transitionItem = {
  id: number;
  user_id: string;
  transition_type_id: number;
  time: string;
};

export type SysAdminDetails = {
  email: string;
  surname: string;
  given_name: string;
  phone_number: string;
  role_id: string;
};

export type StudentDetails = {
  email: string;
  surname: string;
  given_name: string;
  phone_number: string;
  role_id: string;
  course_id: string;
};

export type LecturerDetails = {
  email: string;
  surname: string;
  given_name: string;
  phone_number: string;
  role_id: string;
  faculty_id: string;
};

export type SecurityGuardDetails = {
  email: string;
  surname: string;
  given_name: string;
  phone_number: string;
  role_id: string;
  security_company: string;
};

export type StudentDetailsArray = StudentDetails[];
export type LecturerDetailsArray = LecturerDetails[];
export type SecurityGuardDetailsArray = SecurityGuardDetails[];
export type SysAdminDetailsArray = SysAdminDetails[];
export type UserDetailsArray =
  | StudentDetailsArray
  | LecturerDetailsArray
  | SecurityGuardDetailsArray
  | SysAdminDetailsArray;
