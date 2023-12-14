"use server";

import { Login, LoginResponse, Signup } from "@/types";
import { auth, db } from "../firebase";
import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { redirect } from "next/navigation";

export const handleLoginAuthentication = async (
  prevState: LoginResponse,
  formData: FormData
): Promise<LoginResponse> => {
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
    const updateStatus = await updateUserStatus(uid, true);
    if (!updateStatus)
      return {
        message: "Error updating user status, Please refresh and try again",
      };
    localStorage.setItem("USER_ID", uid);
    redirect("/");
  } catch (error) {
    const firebaseError = error as FirebaseError;
    const { code } = firebaseError;
    const response = { message: code };
    return response;
  }
};

export const handleSignupAuthentication = async (
  prevState: LoginResponse,
  formData: FormData,
  interests: string[]
): Promise<LoginResponse> => {
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
  const password = formData.get("password")?.toString();

  if (
    !email ||
    !fullName ||
    !phoneNumber ||
    !dateOfBirth ||
    !gender ||
    !country ||
    !interests ||
    !termsAndConditions ||
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
    interests,
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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const { uid } = user;
    await createNewUserDocument(uid, newUser);
    localStorage.setItem("USER_ID", uid);
    redirect("/");
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
  const { email, phoneNumber, dateOfBirth, gender, password } = formData;

  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  const phoneRegex: RegExp = /^\d{10}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return false;
  }

  const dobRegex: RegExp = /^\d{4}-\d{2}-\d{2}$/;
  if (!dobRegex.test(dateOfBirth)) {
    return false;
  }

  const validGenders: string[] = ["Male", "Female", "Other"];
  if (!validGenders.includes(gender)) {
    return false;
  }

  if (password.length < 8) {
    return false;
  }

  return true;
};

export const verifyUserStatus = async (): Promise<boolean> => {
  // This function checks the user status from the database whether the user is offline or online
  try {
    const userId = localStorage.getItem("USER_ID");
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
