"use server";

import { interviewCovers } from "@/constants";
import { db, auth } from "@/firebase/admin";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Query,
} from "firebase-admin/firestore";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;
  try {
    const userRecord = await db.collection("user").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead.",
      };
    }
    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "Account created sucessfully. Please sign in",
    };
  } catch (e: unknown) {
    console.error("Error creating a user", e);
    if (
      e &&
      typeof e === "object" &&
      "code" in e &&
      e.code === "auth/email-already-exists"
    ) {
      return {
        success: false,
        message: "This email is already in use",
      };
    }
    return {
      success: false,
      message: "Failed to create an account",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "user doesnot exist. Create a account instead",
      };
    }
    await setSessionCookie(idToken);
  } catch (error) {
    console.log(error);
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const setSessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });
  cookieStore.set("session", setSessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;

    const usersCollection = db.collection(
      "users"
    ) as CollectionReference<DocumentData>;
    const userDocRef = usersCollection.doc(
      uid
    ) as DocumentReference<DocumentData>;
    const userRecord = await userDocRef.get();

    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();

  return !!user;
}


