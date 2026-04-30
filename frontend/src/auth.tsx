import { useState, useEffect, createContext, useContext } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

/**
 * Ensures a Firestore user document exists on first login.
 */
async function ensureFirestoreUser(user: User): Promise<void> {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      credits: 0,
      createdAt: serverTimestamp(),
      email: user.email || "",
      displayName: user.displayName || "",
    });
  }
}

/**
 * Firebase Auth provider — wraps the app with auth context.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await ensureFirestoreUser(firebaseUser);
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signIn() {
    await signInWithPopup(auth, googleProvider);
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth state.
 */
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
