"use server";

import { handleCookies } from "./auth";
import { db } from "../firebase";
import { getDocs, doc, getDoc, collection, query } from "firebase/firestore";
import { Community } from "@/types/communities-types";

export const fetchUserCommunities = async (): Promise<Community[]> => {
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

export const fetchAllCommunities = async (): Promise<Community[]> => {
  try {
    const userId = await handleCookies("get", "USER_ID");

    if (!userId) {
      throw new Error("User Don't exists");
    }

    const allCommunities = query(collection(db, "communities"));
    const querySnapshot = await getDocs(allCommunities);

    const communities: Community[] = [];

    querySnapshot.forEach((doc) => {
      communities.push(doc.data() as Community);
    });

    return communities;
  } catch (error) {
    throw new Error("An error occured while fetching communities");
  }
};

export const recommendCommunityToUser = async (): Promise<Community[]> => {
  try {
    const userId = await handleCookies("get", "USER_ID");

    const userRef = doc(db, "users", userId.toString());
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userInterests = userSnap.data()?.interest as string[];

      const mappedInterests = userInterests.map((interest: string) => interest);

      const communities = await fetchAllCommunities();

      const recommendedCommunities = communities.filter(
        (community) =>
          community.communityCategory === mappedInterests.toString()
      );

      if (recommendedCommunities.length < 1) {
        return communities;
      }

      return recommendedCommunities;
    }

    throw new Error("User don't exist");
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
