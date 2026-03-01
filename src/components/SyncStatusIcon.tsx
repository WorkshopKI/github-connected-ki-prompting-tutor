import { Cloud, CloudOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSyncContext, type SyncStatus } from "@/contexts/SyncContext";

const config: Record<SyncStatus, { icon: typeof Cloud; label: string; className: string }> = {
  idle: { icon: Cloud, label: "Bereit", className: "text-muted-foreground" },
  syncing: { icon: Loader2, label: "Synchronisiere…", className: "text-primary animate-spin" },
  synced: { icon: CheckCircle2, label: "Synchronisiert", className: "text-green-500" },
  error: { icon: AlertCircle, label: "Sync-Fehler", className: "text-destructive" },
  offline: { icon: CloudOff, label: "Offline (lokal)", className: "text-muted-foreground" },
};

export const SyncStatusIcon = () => {
  const { syncStatus } = useSyncContext();
  const { icon: Icon, label, className } = config[syncStatus];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="p-2 rounded-md hover:bg-accent transition-colors" aria-label={label}>
          <Icon className={`h-4 w-4 ${className}`} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};
