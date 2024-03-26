"use server";

import { getUserDocFromFirestore, handleCookies } from "./auth";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Query,
  DocumentData,
} from "firebase/firestore";
import { Community, User } from "@/types";

export const recommendCommunitiesToUser = async (): Promise<Community[]> => {
  try {
    const userId = await handleCookies("get", "USER_ID");
    if (!userId || typeof userId !== "string")
      throw new Error("UserId Not Found");

    const userPostIds: string[] = [];

    const userCommunitiesSnapshot = await getDocs(
      collection(db, "communityMembers")
    );
    userCommunitiesSnapshot.forEach((doc) => {
      const userData = doc.data();

      if (userData[userId] === true) {
        userPostIds.push(doc.id);
      }
    });

    const user = (await getUserDocFromFirestore(userId)) as User;
    const interest = user.interests[0].toLowerCase();

    const recommendedCommunities: Community[] = [];

    let q: Query<DocumentData> = query(
      collection(db, "communities"),
      where("type", "==", interest)
    );

    if (userPostIds.length > 0) {
      q = query(q, where("communityId", "not-in", userPostIds));
    }

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      recommendedCommunities.push(doc.data() as Community);
    });

    if (recommendedCommunities.length === 0) {
      const allCommunitiesQuerySnapshot = await getDocs(
        collection(db, "communities")
      );
      allCommunitiesQuerySnapshot.forEach((doc) => {
        const community = doc.data() as Community;
        if (!userPostIds.includes(community.communityId)) {
          recommendedCommunities.push(community);
        }
      });
    }

    return recommendedCommunities;
  } catch (error: any) {
    throw new Error(error);
  }
};
