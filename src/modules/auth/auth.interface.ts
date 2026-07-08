export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  role?: "TENANT" | "LANDLORD" | "ADMIN";
  activeStatus: "BANNED" | "UNBANNED";
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface updatedMyProfile {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  profileImage?: string;
}
