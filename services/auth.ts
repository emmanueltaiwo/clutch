"use server";

import { Login, AuthResponse, Signup } from "../types/auth-types";
import { auth, db } from "../firebase";
import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { cookies } from "next/headers";

export const handleLoginAuthentication = async (
  prevState: AuthResponse,
  formData: FormData
): Promise<AuthResponse> => {
  // This function handles the login request by verifying the data, sending the authentication to firebase auth, storing the userID in cookies and redirecting to the main app on successful login.

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
    return {
      message: "Yay! You've logged in successfully. redirecting you now",
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
  // This function handles the signup request by verifying the data, sending the authentication to firebase auth, creatig a new document containing the user data in the firebase database, storing the userID in cookies and redirecting to the main app on successful login.

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
    !interest ||
    !password
  ) {
    return { message: "All input must be filled" };
  }

  const newUser: Signup = {
    email,
    fullName,
    phoneNumber,
    dateOfBirth,
    gender,
    country,
    interest,
    termsAndConditions,
    password,
  };

  const isFormValid: boolean = validateSignupInput(newUser);

  if (!isFormValid) {
    const response = {
      message: "Form is invalid, make sure all fields are valid",
    };
    return response;
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
    });
    handleCookies("set", "USER_ID", uid);
    return {
      message:
        "Yay! You've succesfully created an account on clutch. redirecting you now",
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
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const { uid } = user;
    handleCookies("set", "USER_ID", uid);
  } catch (error) {
    const firebaseError = error as FirebaseError;
    const { code } = firebaseError;
    const response = { message: code };
    return response;
  }
};

const validateLoginInput = (formData: Login): boolean => {
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
    const isUserOnline = userSnap.data().status;

    if (!isUserOnline) return false;
    return true;
  } catch (error) {
    return false;
  }
};

const createNewUserDocument = async (userId: string, newUser: Signup) => {
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

const updateUserStatus = async (
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

export const handleCookies = async (
  method: string,
  name?: string,
  setItem?: string
) => {
  // This method is used to store, get, delete items in cookiess
  try {
    if (method === "get" && name !== undefined) {
      const data = cookies().get(name);
      return data?.value;
    } else if (
      method === "set" &&
      setItem !== undefined &&
      name !== undefined
    ) {
      cookies().set(name, setItem);
      return true;
    } else if (method === "delete" && name !== undefined) {
      cookies().delete(name);
      return true;
    }
    // Add more cookies method
  } catch (error) {
    throw new Error();
  }
};
