"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import QuickAccessMenu from "@/components/QuickAccessMenu";
import BackToTop from "@/components/BackToTop";
import { format } from "date-fns";

interface JournalEntry {
  id: string;
  content: string;
  mood?: string | null;
  createdAt: string;
}

export default function JournalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    content: "",
    mood: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      fetchEntries();
    }
  }, [status, router]);

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/journal");
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Error fetching journal entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async () => {
    if (!newEntry.content.trim()) return;

    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (response.ok) {
        setShowNewEntry(false);
        setNewEntry({ content: "", mood: "" });
        fetchEntries();
      }
    } catch (error) {
      console.error("Error creating journal entry:", error);
    }
  };

  const moodEmojis = {
    "amazing": "🤩",
    "happy": "😊",
    "good": "🙂",
    "neutral": "😐",
    "sad": "😢",
    "stressed": "😰",
    "tired": "😴",
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📔 Journal</h1>
            <p className="text-gray-600">Reflect on your day and track your thoughts</p>
          </div>
          <Button onClick={() => setShowNewEntry(true)}>
            ✏️ New Entry
          </Button>
        </div>

        {/* Prompt Card */}
        <Card className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">✨ Daily Reflection Prompts</h3>
            <ul className="space-y-1 text-sm">
              <li>• What went well today?</li>
              <li>• What challenges did you face?</li>
              <li>• What are you grateful for?</li>
              <li>• What will you improve tomorrow?</li>
            </ul>
          </CardContent>
        </Card>

        {/* Entries Timeline */}
        <div className="space-y-6">
          {entries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📖</div>
                <p className="text-gray-600 text-lg">No journal entries yet</p>
                <p className="text-gray-500 text-sm mt-2">Start journaling to track your thoughts and reflections</p>
              </CardContent>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">
                        {entry.mood ? moodEmojis[entry.mood as keyof typeof moodEmojis] || "📝" : "📝"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {format(new Date(entry.createdAt), "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(entry.createdAt), "h:mm a")}
                        </p>
                      </div>
                    </div>
                    {entry.mood && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium capitalize">
                        {entry.mood}
                      </span>
                    )}
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* New Entry Modal */}
        {showNewEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full">
              <CardHeader title="New Journal Entry" />
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How are you feeling?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(moodEmojis).map(([mood, emoji]) => (
                        <button
                          key={mood}
                          onClick={() => setNewEntry({ ...newEntry, mood })}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            newEntry.mood === mood
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          <span className="text-2xl">{emoji}</span>
                          <span className="text-xs ml-2 capitalize">{mood}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What's on your mind? *
                    </label>
                    <textarea
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={8}
                      placeholder="Write your thoughts, reflections, or anything you'd like to remember about today..."
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="secondary" onClick={() => setShowNewEntry(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={createEntry}>
                      Save Entry
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Access Menu */}
        <QuickAccessMenu />

        {/* Back to Top Button */}
        <BackToTop />
      </div>
    </div>
  );
}
