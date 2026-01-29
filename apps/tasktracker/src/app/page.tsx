"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DailyView } from "@/components/daily-view";
import { ProjectView } from "@/components/project-view";
import { Id } from "../../convex/_generated/dataModel";

type View = 
  | { type: "daily" }
  | { type: "project"; projectId: Id<"projects"> };

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>({ type: "daily" });
  const projects = useQuery(api.projects.list);

  // Expose navigation functions globally for other components
  if (typeof window !== "undefined") {
    (window as any).__tasktracker = {
      openProject: (projectId: Id<"projects">) => {
        setCurrentView({ type: "project", projectId });
      },
      goToDaily: () => {
        setCurrentView({ type: "daily" });
      },
    };
  }

  if (currentView.type === "project") {
    return (
      <ProjectView 
        projectId={currentView.projectId}
        onBack={() => setCurrentView({ type: "daily" })}
      />
    );
  }

  return <DailyView />;
}
