import { verifyUserStatus } from "@/services/auth";

export const getSessionStatus = async (): Promise<boolean> => {
  try {
    const isUserVerified = await verifyUserStatus();
    return isUserVerified;
  } catch (error) {
    return false;
  }
};
