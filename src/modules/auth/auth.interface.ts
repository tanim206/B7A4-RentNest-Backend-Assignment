export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  activeStatus: "BANNED" | "UNBANNED";
}

export interface ILoginPayload {
  email: string;
  password: string;
}
