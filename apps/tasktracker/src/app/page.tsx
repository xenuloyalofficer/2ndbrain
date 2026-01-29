"use client";

import { MobileView } from "@/components/mobile-view";
import { KanbanView } from "@/components/kanban-view";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Dashboard() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Show mobile checklist on phones, kanban board on desktop
  return isMobile ? <MobileView /> : <KanbanView />;
}
