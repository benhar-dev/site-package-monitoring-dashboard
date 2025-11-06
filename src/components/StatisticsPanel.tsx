import { Package, PackageHistoryData } from '../types/package';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Clock, 
  AlertTriangle, 
  Package as PackageIcon,
  ArrowRight,
  Sparkles,
  Activity
} from 'lucide-react';
import { getDaysUntilAutoMove, hasVersionReset, isNewPackage } from '../utils/packageUtils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './ui/hover-card';

interface StatisticsPanelProps {
  packages: Package[];
  packageHistoryData: PackageHistoryData[];
  onSelectPackage: (pkg: Package) => void;
  onSetActiveFeed: (feed: string) => void;
}

export function StatisticsPanel({ packages, packageHistoryData, onSelectPackage, onSetActiveFeed }: StatisticsPanelProps) {
  const getPackageHistory = (pkg: Package) => {
    return packageHistoryData.find(h => h.packageName === pkg.name);
  };
  
  const stablePackages = packages.filter(p => p.currentFeed === 'stable');
  const testingPackages = packages.filter(p => p.currentFeed === 'testing');
  const experimentalPackages = packages.filter(p => p.currentFeed === 'experimental');
  const outdatedPackages = packages.filter(p => p.currentFeed === 'outdated');
  
  const aboutToMoveToStable = testingPackages.filter(p => {
    const history = getPackageHistory(p);
    const daysUntil = getDaysUntilAutoMove(p, history);
    return daysUntil !== null && daysUntil <= 5;
  });
  
  const aboutToMoveToTesting = experimentalPackages.filter(p => {
    const history = getPackageHistory(p);
    const daysUntil = getDaysUntilAutoMove(p, history);
    return daysUntil !== null && daysUntil <= 5;
  });
  
  const newPackages = packages.filter(p => {
    const history = getPackageHistory(p);
    return isNewPackage(p, history, 7);
  });
  const packagesWithResets = packages.filter(p => {
    const history = getPackageHistory(p);
    return hasVersionReset(history);
  });
  
  const totalMovingSoon = aboutToMoveToStable.length + aboutToMoveToTesting.length;
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/20">
        <span className="text-muted-foreground text-xs">Total</span>
        <span className="text-lg font-bold">{packages.length}</span>
      </div>
      
      {totalMovingSoon > 0 && (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 cursor-pointer hover:bg-orange-500/20 transition-colors">
              <Clock className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-muted-foreground text-xs">Moving</span>
              <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs h-5 px-2">
                {totalMovingSoon}
              </Badge>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-background/95 backdrop-blur-xl border-primary/30" side="bottom" align="start">
            <div className="space-y-3">
              <div>
                <p className="font-medium text-orange-400 mb-1">Moving Soon (≤5 days)</p>
                <p className="text-muted-foreground text-xs">
                  Packages approaching automatic feed transition
                </p>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {aboutToMoveToStable.map(pkg => {
                  const history = getPackageHistory(pkg);
                  const daysUntil = getDaysUntilAutoMove(pkg, history);
                  return (
                    <div 
                      key={pkg.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-background/40 hover:bg-background/60 cursor-pointer transition-colors border border-border/50 hover:border-primary/40"
                      onClick={() => {
                        onSetActiveFeed(pkg.currentFeed);
                        onSelectPackage(pkg);
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{pkg.name}</div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <span className="text-blue-400">Testing</span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="text-green-400">Stable</span>
                        </div>
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs h-6 px-2 ml-3 shrink-0">
                        {daysUntil}d
                      </Badge>
                    </div>
                  );
                })}
                {aboutToMoveToTesting.map(pkg => {
                  const history = getPackageHistory(pkg);
                  const daysUntil = getDaysUntilAutoMove(pkg, history);
                  return (
                    <div 
                      key={pkg.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-background/40 hover:bg-background/60 cursor-pointer transition-colors border border-border/50 hover:border-primary/40"
                      onClick={() => {
                        onSetActiveFeed(pkg.currentFeed);
                        onSelectPackage(pkg);
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{pkg.name}</div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <span className="text-purple-400">Experimental</span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="text-blue-400">Testing</span>
                        </div>
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs h-6 px-2 ml-3 shrink-0">
                        {daysUntil}d
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
      
      {newPackages.length > 0 && (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 cursor-pointer hover:bg-green-500/20 transition-colors">
              <Sparkles className="h-3.5 w-3.5 text-green-400" />
              <span className="text-muted-foreground text-xs">New</span>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs h-5 px-2">
                {newPackages.length}
              </Badge>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-background/95 backdrop-blur-xl border-primary/30" side="bottom" align="start">
            <div className="space-y-3">
              <div>
                <p className="font-medium text-green-400 mb-1">New Packages</p>
                <p className="text-muted-foreground text-xs">
                  Packages added in the last 7 days
                </p>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {newPackages.slice(0, 10).map(pkg => (
                  <div 
                    key={pkg.id}
                    className="p-3 rounded-lg bg-background/40 hover:bg-background/60 cursor-pointer transition-colors border border-border/50 hover:border-primary/40"
                    onClick={() => {
                      onSetActiveFeed(pkg.currentFeed);
                      onSelectPackage(pkg);
                    }}
                  >
                    <div className="font-medium truncate">{pkg.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">v{pkg.version}</div>
                  </div>
                ))}
                {newPackages.length > 10 && (
                  <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
                    +{newPackages.length - 10} more packages
                  </div>
                )}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
      
      {packagesWithResets.length > 0 && (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 cursor-pointer hover:bg-yellow-500/20 transition-colors">
              <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-muted-foreground text-xs">Resets</span>
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs h-5 px-2">
                {packagesWithResets.length}
              </Badge>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-background/95 backdrop-blur-xl border-primary/30" side="bottom" align="start">
            <div className="space-y-3">
              <div>
                <p className="font-medium text-yellow-400 mb-1">Version Resets</p>
                <p className="text-muted-foreground text-xs">
                  Packages with multiple versions detected in history
                </p>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {packagesWithResets.slice(0, 10).map(pkg => (
                  <div 
                    key={pkg.id}
                    className="p-3 rounded-lg bg-background/40 hover:bg-background/60 cursor-pointer transition-colors border border-border/50 hover:border-primary/40"
                    onClick={() => {
                      onSetActiveFeed(pkg.currentFeed);
                      onSelectPackage(pkg);
                    }}
                  >
                    <div className="font-medium truncate">{pkg.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">v{pkg.version}</div>
                  </div>
                ))}
                {packagesWithResets.length > 10 && (
                  <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
                    +{packagesWithResets.length - 10} more packages
                  </div>
                )}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
}
