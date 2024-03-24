"use server";

import { handleCookies } from "./auth";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  getDoc,
  DocumentData,
  Query,
} from "firebase/firestore";
import { Community } from "@/types";
import { createNewNotification } from "./notifications";

export const createNewCommunity = async (
  communityName: string,
  communityDescription: string,
  communityType: string,
  communityVisibility: string
): Promise<boolean> => {
  try {
    const userId = await handleCookies("get", "USER_ID");
    if (!userId || typeof userId !== "string")
      throw new Error("UserId Not Found");

    const communityId = generateCommunityId(communityName);

    const newCommunity = {
      name: communityName,
      description: communityDescription,
      type: communityType,
      visibility: communityVisibility,
      communityId: communityId,
      createdAt: new Date().getTime(),
      creator: userId,
      communityImage: "",
      members: 1,
    };

    await setDoc(doc(db, "communities", communityId), newCommunity);

    await setDoc(
      doc(db, "communityMembers", communityId),
      {
        [userId]: true,
      },
      { merge: true }
    );

    await createNewNotification(
      `You created a new community called "${communityName}"`,
      userId
    );

    return true;
  } catch (error) {
    throw error;
  }
};

export const fetchUserCreatedCommunities = async (): Promise<Community[]> => {
  try {
    const userId = await handleCookies("get", "USER_ID");
    if (!userId || typeof userId !== "string")
      throw new Error("UserId Not Found");

    const communities: Community[] = [];

    const q = query(
      collection(db, "communities"),
      where("creator", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return communities;
    }

    querySnapshot.forEach(async (doc) => {
      const community = doc.data() as Community;
      communities.push(community);
    });

    return communities;
  } catch (error) {
    throw error;
  }
};

export const fetchUserCommunities = async (): Promise<Community[]> => {
  try {
    const userId = await handleCookies("get", "USER_ID");
    if (!userId || typeof userId !== "string")
      throw new Error("UserId Not Found");

    const communities: Community[] = [];

    const q = query(
      collection(db, "communityMembers"),
      where(userId, "==", true)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return communities;
    }

    const communityIds = querySnapshot.docs.map((doc) => doc.id);

    for (const communityId of communityIds) {
      const communityDoc = await getDoc(doc(db, "communities", communityId));
      if (communityDoc.exists()) {
        const community = communityDoc.data() as Community;
        communities.push(community);
      }
    }

    return communities;
  } catch (error) {
    throw error;
  }
};

export const findCommunitiesToJoin = async (): Promise<Community[]> => {
  try {
    const userId = await handleCookies("get", "USER_ID");
    if (!userId || typeof userId !== "string")
      throw new Error("UserId Not Found");

    const communities: Community[] = [];

    const userCommunitiesSnapshot = await getDocs(
      collection(db, "communityMembers")
    );
    const userCommunityIds: string[] = userCommunitiesSnapshot.docs
      .filter((doc) => doc.data()[userId])
      .map((doc) => doc.id);

    let q: Query<DocumentData, DocumentData> = collection(db, "communities");
    if (userCommunityIds.length > 0) {
      q = query(q, where("communityId", "not-in", userCommunityIds));
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return communities;
    }

    querySnapshot.forEach((doc) => {
      const community = doc.data() as Community;
      if (community.creator !== userId) {
        communities.push(community);
      }
    });

    return communities;
  } catch (error) {
    throw error;
  }
};

const generateCommunityId = (communityName: string): string => {
  const currentDate = new Date();

  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear().toString();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");

  const postIdBase = `${year}${month}${day}${hours}${minutes}${seconds}${communityName}`;

  const postId = postIdBase.substring(0, 15);

  return postId;
};
