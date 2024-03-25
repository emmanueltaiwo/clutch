"use server";

import { Login, AuthResponse, Signup } from "../types/auth-types";
import { auth, db } from "../firebase";
import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { cookies } from "next/headers";
import { User } from "@/types";

export const handleLoginAuthentication = async (
  prevState: AuthResponse,
  formData: FormData
): Promise<AuthResponse> => {
  // This function handles the login request by verifying the data, sending the authentication to firebase auth, storing the userID in cookies and redirecting to the main app on successful login.

  handleCookies("delete", "USER_ID");

  if (!formData) {
    const response = {
      message: "No data was received, Try resubmitting the form",
    };
    return response;
  }

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) return { message: "All input must be filled" };

  const newLogin = {
    email,
    password,
  };

  const isFormValid: boolean = validateLoginInput(newLogin);
  if (!isFormValid) {
    const response = {
      message:
        "Make sure your password should be at least 8 characters long and your email address is valid",
    };
    return response;
  }

  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const { uid } = user;
    handleCookies("set", "USER_ID", uid);
    const updateStatus = await updateUserStatus(uid, true);
    if (!updateStatus)
      return {
        message: "Error updating user status, Please refresh and try again",
      };
    const storedUserData = await getUserDocFromFirestore(uid);

    if (!storedUserData)
      return {
        message: "Error updating user status, Please refresh and try again",
      };

    const userData: User = {
      email: storedUserData.email,
      fullName: storedUserData.fullName,
      phoneNumber: storedUserData.phoneNumber,
      dateOfBirth: storedUserData.dateOfBirth,
      profilePic: storedUserData.profilePic || "",
      gender: storedUserData.gender,
      country: storedUserData.country,
      interests: [storedUserData.interest],
      username: storedUserData.username,
      bio: storedUserData.bio,
    };

    return {
      user: userData,
      message:
        "You've logged in successfully. redirecting you to your feed now",
    };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    const { code } = firebaseError;
    const response = { message: code };
    return response;
  }
};

export const handleSignupAuthentication = async (
  prevState: AuthResponse,
  formData: FormData
): Promise<AuthResponse> => {
  handleCookies("delete", "USER_ID");
  // This function handles the signup request by verifying the data, sending the authentication to firebase auth, creating a new document containing the user data in the firebase database, storing the userID in cookies and redirecting to the main app on successful login.

  if (!formData) {
    const response = {
      message: "No data was received, Try resubmitting the form",
    };
    return response;
  }

  const email = formData.get("email")?.toString();
  const fullName = formData.get("fullName")?.toString();
  const phoneNumber = formData.get("phoneNumber")?.toString();
  const dateOfBirth = formData.get("dateOfBirth")?.toString();
  const gender = formData.get("gender")?.toString();
  const country = formData.get("country")?.toString();
  const termsAndConditions = formData.get("termsAndConditions")?.toString();
  const interest = formData.get("interest")?.toString();
  const password = formData.get("password")?.toString();

  if (
    !email ||
    !fullName ||
    !phoneNumber ||
    !dateOfBirth ||
    !gender ||
    !country ||
    !interest ||
    !termsAndConditions ||
    !password
  ) {
    return { message: "All input must be filled" };
  }

  const [firstName, lastName] = fullName.split(" ");
  let username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;

  const newUser: Signup = {
    email,
    fullName: fullName.toLowerCase(),
    phoneNumber,
    dateOfBirth,
    gender,
    country,
    interests: [interest],
    termsAndConditions,
    password,
    profilePic: "",
    username,
    bio: "",
  };

  const isFormValid: boolean = validateSignupInput(newUser);

  if (!isFormValid) {
    const response = {
      message: "Form is invalid, make sure all fields are valid",
    };
    return response;
  }

  let q = query(collection(db, "users"), where("username", "==", username));
  let querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    let randomChars = Math.random().toString(36).substring(2, 6);
    while (!querySnapshot.empty) {
      username = `${username}${randomChars}`;
      q = query(collection(db, "users"), where("username", "==", username));
      querySnapshot = await getDocs(q);
    }
  }

  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const { uid } = user;

    await createNewUserDocument(uid, {
      ...newUser,
      hasFullAccess: true,
      status: true,
      username,
      bio: "",
    });

    handleCookies("set", "USER_ID", uid);

    return {
      user: {
        email: newUser.email,
        fullName: newUser.fullName,
        phoneNumber: newUser.phoneNumber,
        dateOfBirth: newUser.dateOfBirth,
        profilePic: "",
        gender: newUser.gender,
        country: newUser.country,
        interests: newUser.interests,
        username,
        bio: "",
      },
      message:
        "You've succesfully created an account on clutch. redirecting you to your feed now",
    };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    const { code } = firebaseError;
    const response = { message: code };
    return response;
  }
};

export const handleDemoAccountAuthentication = async () => {
  // This function handled demo account authentication
  const email = "demo@clutchuser.com";
  const password = "democlutch#01";

  try {
    handleCookies("delete", "USER_ID");
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const { uid } = user;
    handleCookies("set", "USER_ID", uid);
    const userDoc = await getUserDocFromFirestore(uid);
    if (userDoc !== false) {
      return userDoc as User;
    }
  } catch (error) {
    throw new Error();
    // const firebaseError = error as FirebaseError;
    // const { code } = firebaseError;
    // const response = { message: code };
  }
};

export const validateLoginInput = (formData: Login): boolean => {
  // This function validates the login input by making sure specific criteria are checked and returns a boolean value
  const { email, password } = formData;
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !password) return false;
  if (password.length < 8 || !emailRegex.test(email)) return false;
  return true;
};

export const validateSignupInput = (formData: Signup): boolean => {
  // This function validates the signup input by making sure specific criteria are checked and returns a boolean value
  const { email, password, termsAndConditions } = formData;

  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  if (termsAndConditions !== "on") {
    return false;
  }

  if (password.length < 8) {
    return false;
  }

  return true;
};

export const verifyUserStatus = async (): Promise<boolean> => {
  // This function checks if the user has an existing id stored in cookies. If it exists, then it finds it in the database and verify the status then returns true. else it returns false
  try {
    const userId = await handleCookies("get", "USER_ID");
    if (!userId) return false;

    const userRef = doc(db, "users", userId.toString());
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return false;
    return true;
  } catch (error) {
    return false;
  }
};

export const createNewUserDocument = async (
  userId: string,
  newUser: Signup
) => {
  try {
    const checkUserRef = doc(db, "users", userId);
    const checkUserSnap = await getDoc(checkUserRef);

    if (checkUserSnap.exists()) {
      throw new Error("User already exists");
    }
    await setDoc(doc(db, "users", userId), newUser);
    return true;
  } catch (error) {
    throw new Error(
      "Error creating user, try refreshing the page and try again"
    );
  }
};

export const updateUserStatus = async (
  userId: string,
  status: boolean
): Promise<boolean> => {
  // This function update the status of the user whether offline or online
  try {
    const userRef = doc(db, "users", userId);
    if (!userRef) return false;
    await updateDoc(userRef, {
      status: status,
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const getUserDocFromFirestore = async (userId: string) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return false;
  }
};

export const handleCookies = async (
  method: string,
  name?: string,
  setItem?: string
): Promise<string | boolean> => {
  // This method is used to store, get, delete items in cookiess
  try {
    if (method === "get" && name !== undefined) {
      const cookieData = cookies().get(name);
      if (!cookieData) return false;
      const data = cookieData.value;
      return data;
    }

    if (method === "set" && setItem !== undefined && name !== undefined) {
      cookies().set(name, setItem);
      return true;
    }

    if (method === "delete" && name !== undefined) {
      const data = cookies().get(name);
      if (!data) return false;
      cookies().delete(name);
      return true;
    }
    return false;
    // Add more cookies method
  } catch (error) {
    return false;
  }
};

export const handleUserSignout = async (): Promise<boolean> => {
  try {
    await handleCookies("delete", "USER_ID");

    return true;
  } catch (error) {
    return false;
  }
};
