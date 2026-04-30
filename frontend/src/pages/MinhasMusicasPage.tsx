import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../auth";
import Button from "../components/Button";

interface Song {
  id: string;
  title?: string;
  lyrics?: string;
  theme?: string;
  style?: string;
  kidName?: string;
  audioUrl?: string | null;
  createdAt?: any;
  ownerUid?: string;
}

export default function MinhasMusicasPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/");
      return;
    }

    const songsRef = collection(db, "songs");
    const q = query(
      songsRef,
      where("ownerUid", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: Song[] = [];
        snap.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Song);
        });
        setSongs(items);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading songs", err);
        setLoading(false);
      },
    );

    return unsub;
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-body text-gray-500 animate-pulse">
          {t("common.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-bold text-h1 text-primary text-center mb-8">
          {t("minhasMusicas.title") || "Minhas Músicas"}
        </h1>

        {songs.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-body text-gray-500 mb-6">
              {t("minhasMusicas.empty") || "Você ainda não tem músicas. Crie sua primeira música!"}
            </p>
            <Button variant="primary" onClick={() => navigate("/criar")}>
              {t("landing.cta")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {songs.map((song) => (
              <div
                key={song.id}
                className="bg-white rounded-card shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-h3 text-gray-800">
                      {song.title || song.theme || "Minha Música"}
                    </h3>
                    {song.kidName && (
                      <p className="font-body text-small text-gray-500 mt-1">
                        {t("criar.form.kidName.label")}: {song.kidName}
                      </p>
                    )}
                    <p className="font-body text-small text-gray-400 mt-0.5">
                      {song.style} · {song.theme}
                    </p>
                  </div>
                </div>

                {/* Lyrics preview */}
                {song.lyrics && (
                  <p className="font-body text-small text-gray-600 line-clamp-3 mb-4">
                    {song.lyrics.slice(0, 150)}
                    {song.lyrics.length > 150 ? "..." : ""}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {song.audioUrl && (
                    <Button
                      variant="primary"
                      className="text-small px-3 py-1.5"
                      onClick={() => {
                        const audio = new Audio(song.audioUrl!);
                        audio.play();
                      }}
                    >
                      ▶ {t("minhasMusicas.play") || "Play"}
                    </Button>
                  )}
                  {song.lyrics && (
                    <Button
                      variant="secondary"
                      className="text-small px-3 py-1.5"
                      onClick={() => {
                        const blob = new Blob([song.lyrics!], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${song.title || song.theme || "musica"}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      ⬇ {t("minhasMusicas.download") || "Download"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
