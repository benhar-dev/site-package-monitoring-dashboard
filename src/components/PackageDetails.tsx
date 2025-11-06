import { useState } from 'react';
import { Package, PackageHistoryData } from '../types/package';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DependencyTree } from './DependencyTree';
import { PackageTimeline } from './PackageTimeline';
import { Separator } from './ui/separator';
import { GitBranch, Download, ExternalLink, GitCommit, ChevronRight, ChevronDown, Maximize2, Minimize2, Calendar, User } from 'lucide-react';
import { getDaysInCurrentFeed } from '../utils/packageUtils';
import { toast } from 'sonner';

interface PackageDetailsProps {
  package: Package;
  packageHistory: PackageHistoryData | undefined;
  onTimelineItemClick?: (packageName: string, version: string, feed: string) => void;
}

export function PackageDetails({ package: pkg, packageHistory, onTimelineItemClick }: PackageDetailsProps) {
  const [isDependenciesOpen, setIsDependenciesOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [expandAllTrigger, setExpandAllTrigger] = useState<{ expand: boolean; timestamp: number } | undefined>(undefined);
  
  const handleDownload = () => {
    toast.success(`Downloading ${pkg.name} v${pkg.version}`, {
      description: 'Package download started'
    });
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getFeedBadgeVariant = (feed: string) => {
    switch (feed) {
      case 'stable':
        return 'default';
      case 'testing':
        return 'secondary';
      case 'experimental':
        return 'outline';
      case 'outdated':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  const getFeedBadgeClass = (feed: string) => {
    switch (feed) {
      case 'stable':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'testing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'experimental':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'outdated':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'removed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return '';
    }
  };
  
  return (
    <Card className="glass-strong border-primary/30">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle>{pkg.name}</CardTitle>
              <Badge className={getFeedBadgeClass(pkg.currentFeed)}>
                {pkg.currentFeed}
              </Badge>
            </div>
            <CardDescription>Version {pkg.version}</CardDescription>
          </div>
          <Button 
            onClick={handleDownload} 
            size="sm"
            className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 shrink-0"
            variant="outline"
          >
            <Download className="h-3 w-3 mr-1.5" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Package Metadata */}
        <div className="space-y-4">
          {/* Description */}
          <p className="text-sm">{pkg.description}</p>
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {pkg.publishedDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Published:</span>
                <span>{formatDate(pkg.publishedDate)}</span>
              </div>
            )}
            {pkg.author && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="text-xs">Author:</span>
                <span>{pkg.author}</span>
              </div>
            )}
            {pkg.projectUrl && (
              <div className="flex items-center gap-2 text-muted-foreground col-span-1 md:col-span-2">
                <ExternalLink className="h-4 w-4" />
                <span className="text-xs">Project URL:</span>
                <a 
                  href={pkg.projectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  {pkg.projectUrl}
                </a>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {pkg.tags && pkg.tags.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-xs text-muted-foreground mt-1.5">Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {pkg.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Dependencies Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors flex-1"
              onClick={() => setIsDependenciesOpen(!isDependenciesOpen)}
            >
              {isDependenciesOpen ? (
                <ChevronDown className="h-4 w-4 text-primary" />
              ) : (
                <ChevronRight className="h-4 w-4 text-primary" />
              )}
              <GitBranch className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Dependencies ({pkg.dependencies.length})</h3>
            </div>
            {isDependenciesOpen && pkg.dependencies.length > 0 && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setExpandAllTrigger({ expand: true, timestamp: Date.now() })}
                  className="h-7 text-xs"
                >
                  <Maximize2 className="h-3 w-3 mr-1" />
                  Expand All
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setExpandAllTrigger({ expand: false, timestamp: Date.now() })}
                  className="h-7 text-xs"
                >
                  <Minimize2 className="h-3 w-3 mr-1" />
                  Collapse All
                </Button>
              </div>
            )}
          </div>
          {isDependenciesOpen && (
            <div className="max-h-64 overflow-y-auto">
              {pkg.dependencies.length > 0 ? (
                <DependencyTree dependencies={pkg.dependencies} expandAllTrigger={expandAllTrigger} />
              ) : (
                <p className="text-sm text-muted-foreground">No dependencies</p>
              )}
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Timeline Section */}
        <div className="space-y-3">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
            onClick={() => setIsTimelineOpen(!isTimelineOpen)}
          >
            {isTimelineOpen ? (
              <ChevronDown className="h-4 w-4 text-primary" />
            ) : (
              <ChevronRight className="h-4 w-4 text-primary" />
            )}
            <GitCommit className="h-4 w-4 text-primary" />
            <div className="flex-1">
              <h3 className="font-semibold">Package Timeline</h3>
              {!isTimelineOpen && (
                <p className="text-xs text-muted-foreground">
                  Version releases and feed transitions
                </p>
              )}
            </div>
          </div>
          {isTimelineOpen && (
            <>
              <p className="text-xs text-muted-foreground pl-10">
                Version releases and feed transitions • Click a stage to jump to that version
              </p>
              <div className="max-h-96 overflow-y-auto">
                <PackageTimeline 
                  package={pkg} 
                  packageHistory={packageHistory}
                  onTimelineItemClick={onTimelineItemClick}
                />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
