"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Plus, LogOut, Clock, Tag as TagIcon } from "lucide-react";

// Simple dummy data
const dummyIdeas = [
  {
    id: "1",
    title: "AI Recipe Generator",
    description: "An app that creates recipes from available ingredients",
    stage: "Seed",
    tags: ["AI", "Food", "App"],
    updatedAt: "2 days ago",
  },
  {
    id: "2",
    title: "Eco-Friendly Packaging",
    description: "Biodegradable packaging from agricultural waste",
    stage: "Refining",
    tags: ["Sustainability", "Business"],
    updatedAt: "1 week ago",
  },
  {
    id: "3",
    title: "Study Groups Platform",
    description: "Connect students worldwide for collaborative learning",
    stage: "Validating",
    tags: ["Education", "Social"],
    updatedAt: "3 days ago",
  },
  {
    id: "4",
    title: "Local Business Discovery",
    description: "Help users find small businesses nearby",
    stage: "Launching",
    tags: ["Local", "Discovery"],
    updatedAt: "1 day ago",
  },
];

const stages = [
  {
    name: "Seed",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    count: 1,
  },
  {
    name: "Refining",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    count: 1,
  },
  {
    name: "Validating",
    color: "bg-green-50 border-green-200 text-green-700",
    count: 1,
  },
  {
    name: "Launching",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    count: 1,
  },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Lightbulb className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your ideas...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            Please sign in to access your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Lightbulb className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Idea Incubator Board
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Idea
              </Button>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>Welcome, {session?.user?.name}!</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Ideas Dashboard
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stages.map((stage) => (
              <div
                key={stage.name}
                className={`p-4 rounded-lg border ${stage.color}`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">{stage.count}</div>
                  <div className="text-sm">{stage.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Ideas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyIdeas.map((idea) => (
              <Card
                key={idea.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      {idea.title}
                    </CardTitle>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        idea.stage === "Seed"
                          ? "bg-yellow-100 text-yellow-700"
                          : idea.stage === "Refining"
                          ? "bg-blue-100 text-blue-700"
                          : idea.stage === "Validating"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {idea.stage}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {idea.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {idea.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                      >
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated {idea.updatedAt}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State for new users */}
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ready to innovate?
          </h3>
          <p className="text-gray-600 mb-6">
            Start by adding your first idea and watch it evolve through our
            stage-based system.
          </p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Idea
          </Button>
        </div>
      </main>
    </div>
  );
}
