export default interface UserInfo {
  id: string;
  lastLoginDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
}
