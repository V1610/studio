"use client";

import { Button } from "@/components/ui/button";
import { Table2, BarChart3, FileText, Eye } from "lucide-react";
import type { ViewType } from "./results-display";

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  disabled: boolean;
}

const viewOptions: { type: ViewType; label: string; icon: React.ElementType }[] = [
  { type: "table", label: "Table", icon: Table2 },
  { type: "chart", label: "Chart", icon: BarChart3 },
  { type: "summary", label: "Summary", icon: FileText },
];

export function ViewSwitcher({ currentView, onViewChange, disabled }: ViewSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-muted rounded-lg shadow">
      <Eye className="h-5 w-5 text-muted-foreground mr-2" />
      {viewOptions.map((option) => (
        <Button
          key={option.type}
          variant={currentView === option.type ? "default" : "outline"}
          size="sm"
          onClick={() => onViewChange(option.type)}
          disabled={disabled}
          aria-pressed={currentView === option.type}
          className={`transition-all duration-200 ease-in-out ${
            currentView === option.type ? 'bg-primary text-primary-foreground scale-105' : 'hover:bg-accent/20'
          }`}
        >
          <option.icon className="mr-2 h-4 w-4" />
          {option.label}
        </Button>
      ))}
    </div>
  );
}
