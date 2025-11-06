import { useState } from 'react';
import { Package, PackageHistoryData } from '../types/package';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Clock, 
  AlertTriangle, 
  Package as PackageIcon,
  ArrowRight,
  Sparkles,
  Activity,
  X
} from 'lucide-react';
import { getDaysUntilAutoMove, hasVersionReset, isNewPackage } from '../utils/packageUtils';

interface StatisticsPanelProps {
  packages: Package[];
  packageHistoryData: PackageHistoryData[];
  onSelectPackage: (pkg: Package) => void;
  onSetActiveFeed: (feed: string) => void;
}

export function StatisticsPanel({ packages, packageHistoryData, onSelectPackage, onSetActiveFeed }: StatisticsPanelProps) {
  const [activeCard, setActiveCard] = useState<'moving' | 'new' | 'resets' | null>(null);
  
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
    <div className="relative">
      <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/20">
        <span className="text-muted-foreground text-xs">Total</span>
        <span className="text-lg font-bold">{packages.length}</span>
      </div>
      
        {totalMovingSoon > 0 && (
          <div 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 cursor-pointer hover:bg-orange-500/20 transition-colors ${activeCard === 'moving' ? 'ring-2 ring-orange-500/40' : ''}`}
            onClick={() => setActiveCard(activeCard === 'moving' ? null : 'moving')}
          >
            <Clock className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-muted-foreground text-xs">Moving</span>
            <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs h-5 px-2">
              {totalMovingSoon}
            </Badge>
          </div>
        )}
      
        {newPackages.length > 0 && (
          <div 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 cursor-pointer hover:bg-green-500/20 transition-colors ${activeCard === 'new' ? 'ring-2 ring-green-500/40' : ''}`}
            onClick={() => setActiveCard(activeCard === 'new' ? null : 'new')}
          >
            <Sparkles className="h-3.5 w-3.5 text-green-400" />
            <span className="text-muted-foreground text-xs">New</span>
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs h-5 px-2">
              {newPackages.length}
            </Badge>
          </div>
        )}
      
        {packagesWithResets.length > 0 && (
          <div 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 cursor-pointer hover:bg-yellow-500/20 transition-colors ${activeCard === 'resets' ? 'ring-2 ring-yellow-500/40' : ''}`}
            onClick={() => setActiveCard(activeCard === 'resets' ? null : 'resets')}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />
            <span className="text-muted-foreground text-xs">Resets</span>
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs h-5 px-2">
              {packagesWithResets.length}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Detail Cards - Floating */}
      {activeCard === 'moving' && totalMovingSoon > 0 && (
        <Card className="absolute top-full left-0 mt-2 w-96 bg-background/85 backdrop-blur-xl border-primary/30 shadow-2xl z-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-orange-400">Moving Soon (≤5 days)</CardTitle>
                <p className="text-muted-foreground text-xs mt-1">
                  Packages approaching automatic feed transition
                </p>
              </div>
              <button 
                onClick={() => setActiveCard(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {aboutToMoveToStable.map(pkg => {
                const history = getPackageHistory(pkg);
                const daysUntil = getDaysUntilAutoMove(pkg, history);
                return (
                  <div 
                    key={pkg.id} 
                    className="glass flex items-center justify-between p-3 rounded-lg cursor-pointer hover:border-primary/40 transition-all border border-border/50"
                    onClick={() => {
                      onSetActiveFeed(pkg.currentFeed);
                      onSelectPackage(pkg);
                      setActiveCard(null);
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
                    <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs h-6 px-2 ml-3 shrink-0">
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
                    className="glass flex items-center justify-between p-3 rounded-lg cursor-pointer hover:border-primary/40 transition-all border border-border/50"
                    onClick={() => {
                      onSetActiveFeed(pkg.currentFeed);
                      onSelectPackage(pkg);
                      setActiveCard(null);
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
                    <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs h-6 px-2 ml-3 shrink-0">
                      {daysUntil}d
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeCard === 'new' && newPackages.length > 0 && (
        <Card className="absolute top-full left-0 mt-2 w-96 bg-background/85 backdrop-blur-xl border-primary/30 shadow-2xl z-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-400">New Packages</CardTitle>
                <p className="text-muted-foreground text-xs mt-1">
                  Packages added in the last 7 days
                </p>
              </div>
              <button 
                onClick={() => setActiveCard(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {newPackages.slice(0, 10).map(pkg => (
                <div 
                  key={pkg.id}
                  className="glass flex items-center justify-between p-3 rounded-lg cursor-pointer hover:border-primary/40 transition-all border border-border/50"
                  onClick={() => {
                    onSetActiveFeed(pkg.currentFeed);
                    onSelectPackage(pkg);
                    setActiveCard(null);
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
          </CardContent>
        </Card>
      )}
      
      {activeCard === 'resets' && packagesWithResets.length > 0 && (
        <Card className="absolute top-full left-0 mt-2 w-96 bg-background/85 backdrop-blur-xl border-primary/30 shadow-2xl z-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-yellow-400">Version Resets</CardTitle>
                <p className="text-muted-foreground text-xs mt-1">
                  Packages with multiple versions detected in history
                </p>
              </div>
              <button 
                onClick={() => setActiveCard(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {packagesWithResets.slice(0, 10).map(pkg => (
                <div 
                  key={pkg.id}
                  className="glass flex items-center justify-between p-3 rounded-lg cursor-pointer hover:border-primary/40 transition-all border border-border/50"
                  onClick={() => {
                    onSetActiveFeed(pkg.currentFeed);
                    onSelectPackage(pkg);
                    setActiveCard(null);
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
