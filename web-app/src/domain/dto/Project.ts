export interface Project {
  _id: string;
  title: string;
  description?: string;
  ownerId: string;
  members?: string[];
  deleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}
