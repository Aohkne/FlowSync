import type { SafeUser } from "../types";

// Extract safe user data (remove password)
export const extractSafeUser = (user: {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}): SafeUser => {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
};

// Check if user has board access
export const checkBoardAccess = (
  boardOwnerId: string,
  userId: string,
  members: Array<{ userId: string }>
): boolean => {
  const isMember = members.some((m) => m.userId === userId);
  const isOwner = boardOwnerId === userId;
  return isMember || isOwner;
};
