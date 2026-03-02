import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LevelCardProps {
  level: number;
  icon: LucideIcon;
  title: string;
  description: string;
  examples: string[];
  isActive: boolean;
  onClick: () => void;
}

export const LevelCard = ({
  level,
  icon: Icon,
  title,
  description,
  examples,
  isActive,
  onClick,
}: LevelCardProps) => {
  return (
    <Card
      className={cn(
        "p-6 cursor-pointer transition-all hover:shadow-md bg-card",
        isActive
          ? "border-primary shadow-glow"
          : "hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={cn(
          "p-2.5 rounded-lg transition-all",
          isActive ? "bg-primary text-white" : "bg-primary/10 text-primary"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-muted-foreground mb-1">
            Disziplin {level}
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <div className="flex flex-wrap gap-2">
        {examples.map((example, idx) => (
          <span
            key={idx}
            className={cn(
              "text-xs px-3 py-1 rounded-full transition-all",
              isActive
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {example}
          </span>
        ))}
      </div>
    </Card>
  );
};
