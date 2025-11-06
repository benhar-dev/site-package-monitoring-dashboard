import { useState, useEffect } from 'react';
import { Dependency } from '../types/package';
import { ChevronRight, ChevronDown, Package } from 'lucide-react';
import { Badge } from './ui/badge';

interface DependencyTreeProps {
  dependencies: Dependency[];
  level?: number;
  expandAllTrigger?: { expand: boolean; timestamp: number };
}

export function DependencyTree({ dependencies, level = 0, expandAllTrigger }: DependencyTreeProps) {
  return (
    <div className={`space-y-1 ${level > 0 ? 'ml-6 border-l-2 border-border pl-4' : ''}`}>
      {dependencies.map((dep, index) => (
        <DependencyNode key={`${dep.name}-${index}`} dependency={dep} level={level} expandAllTrigger={expandAllTrigger} />
      ))}
    </div>
  );
}

function DependencyNode({ dependency, level, expandAllTrigger }: { dependency: Dependency; level: number; expandAllTrigger?: { expand: boolean; timestamp: number } }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDependencies = dependency.dependencies && dependency.dependencies.length > 0;
  
  // When expandAllTrigger changes, update local state
  useEffect(() => {
    if (expandAllTrigger && hasDependencies) {
      setIsExpanded(expandAllTrigger.expand);
    }
  }, [expandAllTrigger, hasDependencies]);
  
  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded hover:bg-accent ${
          hasDependencies ? 'cursor-pointer' : ''
        }`}
        onClick={() => {
          if (hasDependencies) {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {hasDependencies ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )
        ) : (
          <div className="w-4" />
        )}
        <Package className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{dependency.name}</span>
        <Badge variant="secondary" className="text-xs">
          v{dependency.version}
        </Badge>
        {hasDependencies && (
          <span className="text-xs text-muted-foreground">
            ({dependency.dependencies!.length} {dependency.dependencies!.length === 1 ? 'dependency' : 'dependencies'})
          </span>
        )}
      </div>
      {hasDependencies && isExpanded && (
        <DependencyTree dependencies={dependency.dependencies!} level={level + 1} expandAllTrigger={expandAllTrigger} />
      )}
    </div>
  );
}
