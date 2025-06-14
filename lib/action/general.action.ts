import { db } from "@/firebase/admin";
import { DocumentData, CollectionReference,  } from "firebase-admin/firestore";

export async function getInterviewByUserId(
  userId: string | undefined
): Promise<Interview[] | null> {
  if (!userId) {
    return [];
  }

  try {
    const interviewCollection: CollectionReference<DocumentData> =
      db.collection("interviews");

    const snapshot = await interviewCollection
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) return [];

    const interviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    return interviews;
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return null;
  }
}

export async function getInterviewById(
    id: string | undefined
  ): Promise<Interview | null> {
    try {
      const interviewRef = db.collection('interview');
      const snapshot = await interviewRef.where('id', '==', id).get();
      
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Interview;
    } catch (error) {
      console.error("Error fetching interviews:", error);
      return null;
    }
  }
 
  export async function getLatestInterviews(
    params: GetLatestInterviewsParams
  ): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params
  
    try {
      const interviewCollection: CollectionReference<DocumentData> =
        db.collection("interviews");
  
      const snapshot = await interviewCollection
        .orderBy("createdAt", "desc")
        .where("finalized", "==", true)
        .where("userId", "!=", userId)
        .limit(limit)
        .get();
  
      if (snapshot.empty) return [];
  
      const interviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Interview[];
  
      return interviews;
    } catch (error) {
      console.error("Error fetching interviews:", error);
      return null;
    }
  }
  