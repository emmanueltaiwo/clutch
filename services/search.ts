"use server";

import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { SearchResult, User } from "@/types";

export const findUser = async (
  searchQuery: string
): Promise<SearchResult[]> => {
  try {
    const searchResult: SearchResult[] = [];

    if (searchQuery.length === 0) {
      return searchResult;
    }

    const q = query(
      collection(db, "users"),
      where("fullName", "==", searchQuery.toLowerCase())
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const user = doc.data() as User;
      const newSearchResult: SearchResult = {
        username: user.username,
        profilePic: user.profilePic,
        fullName: user.fullName,
      };

      searchResult.push(newSearchResult);
    });

    return searchResult;
  } catch (error: any) {
    throw new Error(error);
  }
};
