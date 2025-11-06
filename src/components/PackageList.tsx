import { Package, PackageHistoryData } from '../types/package';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { getDaysInCurrentFeed, getDaysUntilAutoMove, hasVersionReset, getLatestVersionChange, isNewPackage } from '../utils/packageUtils';
import { Clock, AlertCircle, Package as PackageIcon, Download } from 'lucide-react';
import { toast } from 'sonner';

interface PackageListProps {
  packages: Package[];
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package) => void;
  packageHistoryData: PackageHistoryData[];
}

export function PackageList({ packages, selectedPackage, onSelectPackage, packageHistoryData }: PackageListProps) {
  const handleDownload = (pkg: Package, e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate package download
    toast.success(`Downloading ${pkg.name} v${pkg.version}`, {
      description: 'Package download started'
    });
    // In a real application, this would trigger an actual download
    console.log(`Downloading package: ${pkg.name}@${pkg.version}`);
  };
  
  const getPackageHistory = (pkg: Package) => {
    return packageHistoryData.find(h => h.packageName === pkg.name);
  };
  
  const getStatusBadge = (pkg: Package) => {
    const history = getPackageHistory(pkg);
    const daysUntilMove = getDaysUntilAutoMove(pkg, history);
    const daysIn = getDaysInCurrentFeed(pkg, history);
    
    if (daysUntilMove !== null && daysUntilMove <= 5) {
      return (
        <Badge variant="destructive" className="ml-2 bg-orange-500/20 text-orange-400 border-orange-500/30">
          {daysUntilMove}d until auto-move
        </Badge>
      );
    }
    
    if (isNewPackage(pkg, history, 7)) {
      return <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">New</Badge>;
    }
    
    return null;
  };
  
  const getVersionResetInfo = (pkg: Package) => {
    const history = getPackageHistory(pkg);
    const versionChange = getLatestVersionChange(history);
    if (!versionChange) return null;
    
    return (
      <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
        <AlertCircle className="h-3 w-3" />
        <span>
          Updated {versionChange.daysAgo}d ago ({versionChange.oldVersion} → {versionChange.newVersion})
        </span>
      </div>
    );
  };
  
  return (
    <div className="space-y-2">
      {packages.map((pkg) => {
        const history = getPackageHistory(pkg);
        const daysIn = getDaysInCurrentFeed(pkg, history);
        const daysUntilMove = getDaysUntilAutoMove(pkg, history);
        
        return (
          <Card
            key={pkg.id}
            className={`glass p-4 cursor-pointer transition-all hover:scale-[1.01] hover:border-primary/40 ${
              selectedPackage?.id === pkg.id ? 'border-primary/60 shadow-lg shadow-primary/20' : ''
            }`}
            onClick={() => onSelectPackage(pkg)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  <PackageIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{pkg.name}</span>
                  <Badge variant="outline" className="border-primary/30">
                    v{pkg.version}
                  </Badge>
                  {getStatusBadge(pkg)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
                {getVersionResetInfo(pkg)}
              </div>
              <div className="flex flex-col items-end ml-4 gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{daysIn}d</span>
                </div>
                {daysUntilMove !== null && (
                  <span className={`text-xs ${daysUntilMove <= 5 ? 'text-orange-400' : 'text-muted-foreground'}`}>
                    {daysUntilMove}d to move
                  </span>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary"
                  onClick={(e) => handleDownload(pkg, e)}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
      {packages.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No packages in this feed
        </div>
      )}
    </div>
  );
}
