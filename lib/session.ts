import { verifyUserStatus } from "@/services/auth";

export const getSessionStatus = async (): Promise<boolean> => {
  try {
    const doesUserTokenExist = await verifyUserStatus();
    return doesUserTokenExist;
  } catch (error) {
    return false;
  }
};
