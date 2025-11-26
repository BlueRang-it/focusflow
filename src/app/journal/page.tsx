"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import QuickAccessMenu from "@/components/QuickAccessMenu";
import BackToTop from "@/components/BackToTop";
import HelpTooltip from "@/components/HelpTooltip";
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
        // API returns { entries, total, hasMore } so extract entries array
        setEntries(data.entries || data);
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
    "VERY_HAPPY": "🤩",
    "HAPPY": "😊",
    "NEUTRAL": "😐",
    "UNHAPPY": "😢",
    "VERY_UNHAPPY": "😰",
  };

  const getMoodLabel = (mood: string) => {
    const labels: Record<string, string> = {
      "VERY_HAPPY": "Very Happy",
      "HAPPY": "Happy",
      "NEUTRAL": "Neutral",
      "UNHAPPY": "Unhappy",
      "VERY_UNHAPPY": "Very Unhappy",
    };
    return labels[mood] || mood;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse" style={{animationDelay: '700ms'}}></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">📔 Journal</h1>
              <p className="text-gray-300 text-lg">Reflect on your day and track your thoughts</p>
            </div>
            <HelpTooltip
              title="How to Use Journal"
              content={[
                "Click '✏️ New Entry' to start journaling",
                "Select your mood: Very Happy 🤩, Happy 😊, Neutral 😐, Unhappy 😢, Very Unhappy 😰",
                "Write your thoughts, reflections, or daily notes",
                "Use reflection prompts for inspiration",
                "Entries appear in timeline view (newest first)",
                "Track emotional patterns over time",
                "No character limit - write as much as you need"
              ]}
            />
          </div>
          <Button onClick={() => setShowNewEntry(true)}>
            ✏️ New Entry
          </Button>
        </div>

        {/* Prompt Card */}
        <Card className="mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white border-4 border-purple-400 shadow-2xl">
          <CardContent>
            <h3 className="text-2xl font-bold mb-3 drop-shadow-lg">✨ Daily Reflection Prompts</h3>
            <ul className="space-y-2 text-base">
              <li className="flex items-center gap-2"><span className="text-yellow-300">•</span> What went well today?</li>
              <li className="flex items-center gap-2"><span className="text-yellow-300">•</span> What challenges did you face?</li>
              <li className="flex items-center gap-2"><span className="text-yellow-300">•</span> What are you grateful for?</li>
              <li className="flex items-center gap-2"><span className="text-yellow-300">•</span> What will you improve tomorrow?</li>
            </ul>
          </CardContent>
        </Card>

        {/* Entries Timeline */}
        <div className="space-y-6">
          {entries.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20">
              <CardContent className="text-center py-12">
                <div className="text-7xl mb-4">📖</div>
                <p className="text-white text-xl font-semibold">No journal entries yet</p>
                <p className="text-gray-300 text-base mt-2">Start journaling to track your thoughts and reflections</p>
              </CardContent>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 hover:border-white/30 hover:shadow-2xl hover:shadow-purple-500/20 transition-all transform hover:scale-[1.02]">
                <CardContent>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl drop-shadow-lg">
                        {entry.mood ? moodEmojis[entry.mood as keyof typeof moodEmojis] || "📝" : "📝"}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-white drop-shadow">
                          {format(new Date(entry.createdAt), "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-gray-300">
                          {format(new Date(entry.createdAt), "h:mm a")}
                        </p>
                      </div>
                    </div>
                    {entry.mood && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {getMoodLabel(entry.mood)}
                      </span>
                    )}
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-200 whitespace-pre-wrap text-base leading-relaxed">{entry.content}</p>
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
                          <span className="text-xs ml-2">{getMoodLabel(mood)}</span>
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
