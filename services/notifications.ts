"use server";

import { Notification } from "@/types";
import { db } from "@/firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { handleCookies } from "./auth";

export const createNewNotification = async (
  notificationText: string,
  userId: string
): Promise<boolean> => {
  try {
    const notificationId = generateNotificationId(notificationText);

    const newNotification: Notification = {
      notificationId: notificationId,
      userId: userId,
      notificationText: notificationText,
      hasRead: false,
      createdAt: new Date().getTime(),
    };

    await setDoc(doc(db, "notifications", notificationId), newNotification);

    return true;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const userId = await handleCookies("get", "USER_ID");
    if (!userId || typeof userId !== "string")
      throw new Error("UserId Not Found");

    const notifications: Notification[] = [];

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return notifications;
    }

    querySnapshot.forEach((doc) => {
      const notification = doc.data() as Notification;
      notifications.push(notification);
    });

    return notifications;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<boolean> => {
  try {
    const docRef = doc(db, "notifications", notificationId);

    await updateDoc(docRef, {
      hasRead: true,
    });

    return true;
  } catch (error: any) {
    throw new Error(error);
  }
};

const generateNotificationId = (notificationText: string): string => {
  const currentDate = new Date();

  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear().toString();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");

  const postIdBase = `${year}${month}${day}${hours}${minutes}${seconds}${notificationText}`;

  const postId = postIdBase.substring(0, 15);

  return postId;
};
