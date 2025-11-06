import { Package, PackageHistoryData } from '../types/package';
import { Badge } from './ui/badge';
import { ArrowRight, Circle, CheckCircle2 } from 'lucide-react';

interface PackageTimelineProps {
  package: Package;
  packageHistory: PackageHistoryData | undefined;
  onTimelineItemClick?: (packageName: string, version: string, feed: string) => void;
}

interface VersionJourney {
  version: string;
  stages: {
    feed: 'experimental' | 'testing' | 'stable' | 'outdated';
    entered: Date;
    exited?: Date;
  }[];
  isLatest: boolean;
  startDate: Date;
}

export function PackageTimeline({ package: pkg, packageHistory, onTimelineItemClick }: PackageTimelineProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatShortDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getFeedColor = (feed: string) => {
    switch (feed) {
      case 'stable':
        return 'border-green-500 bg-green-500/20 text-green-400';
      case 'testing':
        return 'border-blue-500 bg-blue-500/20 text-blue-400';
      case 'experimental':
        return 'border-purple-500 bg-purple-500/20 text-purple-400';
      case 'outdated':
        return 'border-red-500 bg-red-500/20 text-red-400';
      default:
        return 'border-gray-500 bg-gray-500/20 text-gray-400';
    }
  };
  
  // Build the journey for each version by tracking when it entered each feed
  const buildVersionJourneys = (): VersionJourney[] => {
    if (!packageHistory) {
      return [];
    }
    
    const journeys: VersionJourney[] = [];
    
    // For each version in the history, build its journey
    packageHistory.versionHistory.forEach((versionEntry, index) => {
      const version = versionEntry.version;
      const versionStartDate = versionEntry.date;
      const isLatest = index === packageHistory.versionHistory.length - 1;
      
      const stages: VersionJourney['stages'] = [];
      
      // Get feed history for this specific version
      const feedHistory = packageHistory.feedHistoryByVersion[version];
      if (feedHistory) {
        feedHistory.forEach(fe => {
          stages.push({
            feed: fe.feed,
            entered: fe.enteredDate,
            exited: fe.exitedDate
          });
        });
      }
      
      journeys.push({
        version,
        stages,
        isLatest,
        startDate: versionStartDate
      });
    });
    
    // Sort by start date, most recent first
    return journeys.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  };
  
  const journeys = buildVersionJourneys();
  const feeds: ('experimental' | 'testing' | 'stable' | 'outdated')[] = ['experimental', 'testing', 'stable', 'outdated'];
  const feedLabels = {
    experimental: 'Experimental',
    testing: 'Testing',
    stable: 'Stable',
    outdated: 'Outdated'
  };
  
  return (
    <div className="space-y-6">
      {/* Header - Feed Stages */}
      <div className="grid grid-cols-4 gap-2 pb-3 border-b border-border/50">
        {feeds.map(feed => (
          <div key={feed} className="text-center">
            <div className={`text-xs font-medium px-2 py-1 rounded-md ${getFeedColor(feed)}`}>
              {feedLabels[feed]}
            </div>
          </div>
        ))}
      </div>
      
      {/* Version Journeys */}
      <div className="space-y-6">
        {journeys.map((journey) => {
          // Create a map of feed to stage for easy lookup
          const feedToStage = new Map<string, typeof journey.stages[0]>();
          journey.stages.forEach(stage => {
            feedToStage.set(stage.feed, stage);
          });
          
          // Check if this version is still active in any feed
          const isVersionActive = journey.stages.some(stage => !stage.exited);
          
          // Check if this is the currently selected package version
          const isCurrentVersion = journey.version === pkg.version;
          
          return (
            <div 
              key={journey.version} 
              className={`space-y-2 p-3 rounded-lg transition-colors ${
                isCurrentVersion ? 'bg-primary/10 border-2 border-primary/30 shadow-lg' : 'border-2 border-transparent'
              }`}
            >
              {/* Version Label */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={isCurrentVersion ? "border-primary bg-primary/20" : "border-primary/30"}>
                  v{journey.version}
                </Badge>
                {isCurrentVersion && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                    Selected
                  </Badge>
                )}
                {journey.isLatest && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    Latest
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  Started {formatShortDate(journey.startDate)}
                </span>
              </div>
              
              {/* Journey Flow */}
              <div className="grid grid-cols-4 gap-2 items-center">
                {feeds.map((feed, feedIndex) => {
                  const stage = feedToStage.get(feed);
                  const hasStage = !!stage;
                  const isStageActive = hasStage && !stage.exited;
                  const nextFeed = feeds[feedIndex + 1];
                  const hasNextStage = nextFeed && feedToStage.has(nextFeed);
                  
                  // Apply opacity if the version is no longer in any feed
                  const stageOpacity = hasStage && !isVersionActive ? 'opacity-40' : '';
                  
                  return (
                    <div key={feed} className="flex items-center">
                      {/* Stage Node */}
                      <div className="flex-1">
                        {hasStage ? (
                          <div 
                            className={`border-2 rounded-lg p-2 ${getFeedColor(feed)} ${stageOpacity} ${isStageActive ? 'ring-2 ring-primary/50 shadow-lg' : ''} ${onTimelineItemClick ? 'cursor-pointer hover:brightness-110 transition-all' : ''}`}
                            onClick={() => {
                              if (onTimelineItemClick && isStageActive) {
                                onTimelineItemClick(pkg.name, journey.version, feed);
                              }
                            }}
                          >
                            <div className="flex items-center justify-center mb-1">
                              {isStageActive ? (
                                <Circle className="h-4 w-4 fill-current animate-pulse" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                            </div>
                            <div className="text-[10px] text-center leading-tight">
                              <div className="font-medium">{formatShortDate(stage.entered)}</div>
                              {stage.exited && (
                                <div className="text-muted-foreground opacity-70">→ {formatShortDate(stage.exited)}</div>
                              )}
                              {isStageActive && (
                                <div className="text-primary font-medium mt-0.5">Active</div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-border/20 rounded-lg p-2 bg-background/20">
                            <div className="flex items-center justify-center mb-1">
                              <Circle className="h-4 w-4 text-border/50" />
                            </div>
                            <div className="text-[10px] text-center text-muted-foreground/50">
                              —
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Arrow to Next Stage */}
                      {feedIndex < feeds.length - 1 && (
                        <div className={`w-6 flex items-center justify-center ${stageOpacity}`}>
                          {hasStage && hasNextStage ? (
                            <ArrowRight className="h-3 w-3 text-primary" />
                          ) : (
                            <ArrowRight className="h-3 w-3 text-border/20" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {journeys.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No version history available
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="pt-4 border-t border-border/50">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Circle className="h-3 w-3 fill-current text-primary" />
            <span>Currently in this feed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
            <span>Completed this feed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Circle className="h-3 w-3 text-border/50" />
            <span>Never reached this feed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ArrowRight className="h-3 w-3 text-primary" />
            <span>Progressed to next feed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
