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

type BaseUserDetails = {
  id: string;
  email: string;
  surname: string;
  "given name": string;
  "phone number": string;
  "role name": string
}


export type SysAdminDetails = BaseUserDetails;

export type StudentDetails = BaseUserDetails & {
  "course name": string;
};

export type LecturerDetails = BaseUserDetails &{
  "faculty name": string;
};

export type SecurityGuardDetails = BaseUserDetails & {
  "security company": string;
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
export type UserDetails =
  | StudentDetails
  | LecturerDetails
  | SecurityGuardDetails
  | SysAdminDetails;
