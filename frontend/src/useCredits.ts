import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

interface UserData {
  credits: number;
  displayName?: string;
  email?: string;
}

/**
 * Hook that listens to Firestore user credits in real-time.
 * Returns { credits, loading }.
 */
export function useCredits(uid: string | undefined | null) {
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setCredits(0);
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(
      doc(db, "users", uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserData;
          setCredits(data.credits ?? 0);
        } else {
          setCredits(0);
        }
        setLoading(false);
      },
      (err) => {
        console.error("useCredits error", err);
        setCredits(0);
        setLoading(false);
      },
    );

    return unsub;
  }, [uid]);

  return { credits, loading };
}
