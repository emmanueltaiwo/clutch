"use server";

import { handleCookies } from "./auth";
import { db } from "../firebase";
import { getDocs, collection } from "firebase/firestore";
import { Community } from "@/types/communities-types";

export const fetchAllCommunities = async (): Promise<Community[]> => {
  try {
    const userId = await handleCookies("get", "USER_ID");

    const querySnapshot = await getDocs(
      collection(db, "users", userId.toString(), "communities")
    );

    const communities: Community[] = [];

    querySnapshot.forEach((doc) => {
      communities.push(doc.data() as Community);
    });

    return communities;
  } catch (error) {
    throw new Error("An error occured while fetching communities");
  }
};

const generateCommunityID = async (
  communityName: string
): Promise<string | boolean> => {
  if (!communityName) {
    return false;
  }

  try {
    let hash = 0;
    const date = new Date().toString();

    for (let i = 0; i < communityName.length; i++) {
      const char = communityName.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    const generatedID = hash + date;

    return generatedID;
  } catch (error) {
    return false;
  }
};
