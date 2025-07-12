// src/types.ts
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  photo: string;
  skillsOffered: string[];
  skillsWanted: string[];
  rating: number;
  isPublic: boolean;
}
export interface Review {
  reviewerName: string;
  rating: number;
  text: string;
}

