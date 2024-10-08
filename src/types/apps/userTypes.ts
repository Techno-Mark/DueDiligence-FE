// Type Imports
import type { ThemeColor } from "@core/types";

export type UsersType = {
  sectionName: any;
  sectionSlug: any;
  templateSlug: any;
  templateDescription: any;
  srNo?: number;
  id: number;
  name: string;
  country: string;
  contact: string;
  email: string;
  company: string;
  role: string;
  status: string;
  avatar: string;
  fullName: string;
  username: string;
  currentPlan: string;
  avatarColor?: ThemeColor;
  billing: string;
  slug: string;
  jsonContent: any;
  createdAt: string;
  sectionId: string;
};

export type ADD_SECTION = -1;
export type EDIT_SECTION = 1;
