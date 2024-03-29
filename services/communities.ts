"use server";

import { getUserDocFromFirestore, handleCookies } from "./auth";
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
  deleteField,
  deleteDoc,
} from "firebase/firestore";
import { Community, SearchResult } from "@/types";
import { createNewNotification } from "./notifications";

export const createNewCommunity = async (
  communityName: string,
  communityDescription: string,
  communityType: string,
  communityVisibility: string,
  inviteCode?: string
): Promise<boolean> => {
  try {
    const userId = await handleCookies("get", "USER_ID");
    if (!userId || typeof userId !== "string")
      throw new Error("UserId Not Found");

    const communityId = generateCommunityId(communityName);

    let newCommunity: Community;

    if (inviteCode) {
      newCommunity = {
        name: communityName,
        description: communityDescription,
        type: communityType,
        visibility: communityVisibility,
        communityId: communityId,
        createdAt: new Date().getTime(),
        creator: userId,
        communityImage: "",
        members: 1,
        active: false,
      };
    } else {
      newCommunity = {
        name: communityName,
        description: communityDescription,
        type: communityType,
        visibility: communityVisibility,
        communityId: communityId,
        createdAt: new Date().getTime(),
        creator: userId,
        communityImage: "",
        members: 1,
        active: false,
        inviteCode: inviteCode,
      };
    }

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
  } catch (error: any) {
    throw new Error(error);
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
  } catch (error: any) {
    throw new Error(error);
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
  } catch (error: any) {
    throw new Error(error);
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
  } catch (error: any) {
    throw new Error(error);
  }
};

export const fetchActiveCommunities = async (): Promise<Community[]> => {
  try {
    const userId = await handleCookies("get", "USER_ID");
    if (!userId || typeof userId !== "string")
      throw new Error("UserId Not Found");

    const userCommunitiesSnapshot = await getDocs(
      collection(db, "communityMembers")
    );

    const userCommunityIds: string[] = [];

    userCommunitiesSnapshot.forEach((doc) => {
      const communityData = doc.data();
      if (communityData[userId] === true) {
        userCommunityIds.push(doc.id);
      }
    });

    const activeUserCommunities: Community[] = [];

    if (userCommunityIds.length > 0) {
      const q = query(
        collection(db, "communities"),
        where("active", "==", true),
        where("communityId", "in", userCommunityIds)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        activeUserCommunities.push(doc.data() as Community);
      });
    }

    return activeUserCommunities;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const activateCommunity = async (
  communityId: string
): Promise<boolean> => {
  try {
    const communityRef = doc(db, "communities", communityId);
    await updateDoc(communityRef, { active: true });

    return true;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deactivateCommunity = async (
  communityId: string
): Promise<boolean> => {
  try {
    const communityRef = doc(db, "communities", communityId);
    await updateDoc(communityRef, { active: false });

    return true;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const verifyCommunityExists = async (
  communityId: string
): Promise<{ exists: boolean; creatorId: string }> => {
  try {
    const communityRef = doc(db, "communities", communityId);
    const communityDoc = await getDoc(communityRef);

    if (!communityDoc.exists()) {
      return { exists: false, creatorId: "" };
    }

    return { exists: true, creatorId: communityDoc.data().creator };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const fetchAllCommunityMembers = async (
  communityId: string
): Promise<SearchResult[]> => {
  try {
    const communityRef = doc(db, "communityMembers", communityId);
    const communityDoc = await getDoc(communityRef);

    if (!communityDoc.exists()) {
      return [];
    }

    const community = communityDoc.data();
    if (!community) {
      return [];
    }

    const userIds = Object.keys(community);

    const users: SearchResult[] = [];

    for (const userId of userIds) {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return [];
      }

      const user = userDoc.data();
      if (!user) {
        return [];
      }

      const member: SearchResult = {
        userId: userDoc.id,
        username: user.username,
        profilePic: user.profilePic,
        fullName: user.fullName,
      };

      users.push(member);
    }

    return users;
  } catch (error: any) {
    throw new Error(`Error fetching community members: ${error.message}`);
  }
};

export const fetchCommunityById = async (
  communityId: string
): Promise<Community> => {
  try {
    const communityRef = doc(db, "communities", communityId);
    const communityDoc = await getDoc(communityRef);

    if (!communityDoc.exists()) {
      throw new Error("Couldn't find community");
    }

    return communityDoc.data() as Community;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const leaveCommunity = async (
  communityId: string,
  communityName: string,
  creatorId: string
): Promise<boolean> => {
  try {
    const userId = await handleCookies("get", "USER_ID");
    if (!userId || typeof userId !== "string") return false;
    const user = await getUserDocFromFirestore(userId);

    if (typeof user === "boolean") return false;

    await updateDoc(doc(db, "communityMembers", communityId), {
      [userId]: deleteField(),
    });

    await createNewNotification(`You left ${communityName} community`, userId);

    await createNewNotification(
      `${user.fullName} left your community (${communityName})`,
      creatorId
    );

    return true;
  } catch (error: any) {
    return false;
  }
};

export const joinPublicCommunity = async (
  communityId: string,
  communityName: string,
  creatorId: string
): Promise<boolean> => {
  try {
    const userId = await handleCookies("get", "USER_ID");
    if (!userId || typeof userId !== "string") return false;
    const user = await getUserDocFromFirestore(userId);

    if (typeof user === "boolean") return false;

    await setDoc(
      doc(db, "communityMembers", communityId),
      {
        [userId]: true,
      },
      { merge: true }
    );

    await createNewNotification(
      `You joined ${communityName} community`,
      userId
    );

    await createNewNotification(
      `${user.fullName} joined your community (${communityName})`,
      creatorId
    );

    await activateCommunity(communityId);

    return true;
  } catch (error: any) {
    return false;
  }
};

export const joinPrivateCommunity = async (
  communityId: string,
  communityName: string,
  creatorId: string,
  enteredInviteCode: string
): Promise<string> => {
  try {
    const userId = await handleCookies("get", "USER_ID");
    if (!userId || typeof userId !== "string") throw new Error();
    const user = await getUserDocFromFirestore(userId);

    if (typeof user === "boolean") throw new Error();

    const docRef = doc(db, "communities", communityId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error();

    const inviteCode = docSnap.data().inviteCode;
    if (inviteCode !== enteredInviteCode) return "Invite code is not correct.";

    await setDoc(
      doc(db, "communityMembers", communityId),
      {
        [userId]: true,
      },
      { merge: true }
    );

    await createNewNotification(
      `You joined ${communityName} community`,
      userId
    );

    await createNewNotification(
      `${user.fullName} joined your community (${communityName})`,
      creatorId
    );

    await activateCommunity(communityId);

    return `You've sucessfully joined ${communityName} community`;
  } catch (error) {
    throw new Error();
  }
};

export const deleteCommunity = async (
  communityId: string
): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "communities", communityId));
    await deleteDoc(doc(db, "communityMembers", communityId));

    return true;
  } catch (error) {
    return false;
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
