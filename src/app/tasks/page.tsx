"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import QuickAccessMenu from "@/components/QuickAccessMenu";
import BackToTop from "@/components/BackToTop";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  dueDate?: string | null;
  createdAt: string;
}

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as Task["priority"],
    dueDate: "",
  });
  const [filter, setFilter] = useState<"ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED">("ALL");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      fetchTasks();
    }
  }, [status, router]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        setShowNewTask(false);
        setNewTask({ title: "", description: "", priority: "MEDIUM", dueDate: "" });
        fetchTasks();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTaskStatus = async (taskId: string, status: Task["status"]) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-800 border-red-300";
      case "HIGH": return "bg-orange-100 text-orange-800 border-orange-300";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "LOW": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800";
      case "TODO": return "bg-gray-100 text-gray-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTasks = tasks.filter(task => 
    filter === "ALL" || task.status === filter
  );

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === "TODO").length,
    inProgress: tasks.filter(t => t.status === "IN_PROGRESS").length,
    completed: tasks.filter(t => t.status === "COMPLETED").length,
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Tasks</h1>
            <p className="text-gray-600">Manage your tasks and stay organized</p>
          </div>
          <Button onClick={() => setShowNewTask(true)}>
            ➕ New Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white">
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{taskStats.total}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50">
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{taskStats.todo}</div>
              <div className="text-sm text-blue-800">To Do</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50">
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{taskStats.inProgress}</div>
              <div className="text-sm text-yellow-800">In Progress</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{taskStats.completed}</div>
              <div className="text-sm text-green-800">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {(["ALL", "TODO", "IN_PROGRESS", "COMPLETED"] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterOption
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {filterOption.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-600 text-lg">No tasks found</p>
                <p className="text-gray-500 text-sm mt-2">Create your first task to get started!</p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-gray-600 mb-3">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <p className="text-sm text-gray-500">
                          📅 Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {task.status !== "COMPLETED" && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => updateTaskStatus(task.id, "COMPLETED")}
                        >
                          ✓ Complete
                        </Button>
                      )}
                      {task.status === "TODO" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => updateTaskStatus(task.id, "IN_PROGRESS")}
                        >
                          ▶ Start
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => deleteTask(task.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* New Task Modal */}
        {showNewTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full">
              <CardHeader title="Create New Task" />
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter task title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter task description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="secondary" onClick={() => setShowNewTask(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={createTask}>
                      Create Task
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
