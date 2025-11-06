import { useState } from 'react';
import { Package } from '../types/package';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Package as PackageIcon, X, Box } from 'lucide-react';
import { searchPackagesByDependency } from '../utils/packageUtils';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

interface DependencySearchProps {
  packages: Package[];
  onSelectPackage: (pkg: Package) => void;
}

interface SearchResult {
  package: Package;
  matchingDeps: string[];
}

export function DependencySearch({ packages, onSelectPackage }: DependencySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [packageResults, setPackageResults] = useState<Package[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<'package' | 'dependency'>('package');
  
  const handleSearch = (query: string, mode: 'package' | 'dependency' = searchMode) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setPackageResults([]);
      setIsOpen(false);
      return;
    }
    
    if (mode === 'dependency') {
      const results = searchPackagesByDependency(packages, query);
      setSearchResults(results);
      setPackageResults([]);
    } else {
      // Search by package name
      const results = packages.filter(pkg => 
        pkg.name.toLowerCase().includes(query.toLowerCase())
      );
      setPackageResults(results);
      setSearchResults([]);
    }
    setIsOpen(true);
  };
  
  const handleSelectPackage = (pkg: Package) => {
    onSelectPackage(pkg);
    setSearchQuery('');
    setSearchResults([]);
    setPackageResults([]);
    setIsOpen(false);
  };
  
  const handleModeChange = (mode: 'package' | 'dependency') => {
    setSearchMode(mode);
    if (searchQuery) {
      handleSearch(searchQuery, mode);
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
  
  const resultCount = searchMode === 'dependency' ? searchResults.length : packageResults.length;
  
  return (
    <div className="relative">
      <div className="flex gap-2 items-center">
        <Tabs value={searchMode} onValueChange={(v:string) => handleModeChange(v as 'package' | 'dependency')} className="w-auto">
          <TabsList className="glass h-10">
            <TabsTrigger value="package" className="text-xs gap-1.5">
              <PackageIcon className="h-3.5 w-3.5" />
              Package
            </TabsTrigger>
            <TabsTrigger value="dependency" className="text-xs gap-1.5">
              <Box className="h-3.5 w-3.5" />
              Dependency
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={
              searchMode === 'package' 
                ? "Search by package name (e.g., express, lodash)..." 
                : "Search by dependency name (e.g., react, axios)..."
            }
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10 bg-background/50 border-primary/20"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setPackageResults([]);
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {isOpen && searchQuery && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-primary/30 shadow-xl bg-background/85 backdrop-blur-xl">
          <CardContent className="p-3">
            {resultCount > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                <div className="text-xs text-muted-foreground mb-2">
                  {searchMode === 'dependency' && (
                    <>Found {resultCount} package{resultCount !== 1 ? 's' : ''} using "{searchQuery}"</>
                  )}
                  {searchMode === 'package' && (
                    <>Found {resultCount} package{resultCount !== 1 ? 's' : ''}</>
                  )}
                </div>
                {searchMode === 'dependency' ? (
                  searchResults.map((result) => (
                    <div
                      key={result.package.id}
                      className="glass flex flex-col gap-2 p-3 rounded-lg cursor-pointer hover:border-primary/40 transition-all border border-border/50"
                      onClick={() => handleSelectPackage(result.package)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <PackageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{result.package.name}</span>
                          <Badge variant="outline" className="border-primary/30 flex-shrink-0">v{result.package.version}</Badge>
                        </div>
                        <Badge className={`${getFeedBadgeClass(result.package.currentFeed)} flex-shrink-0 ml-2`}>{result.package.currentFeed}</Badge>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap ml-6">
                        <Box className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">Uses:</span>
                        {result.matchingDeps.slice(0, 3).map((dep, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                        {result.matchingDeps.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{result.matchingDeps.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  packageResults.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="glass flex items-center justify-between p-3 rounded-lg cursor-pointer hover:border-primary/40 transition-all border border-border/50"
                      onClick={() => handleSelectPackage(pkg)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <PackageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{pkg.name}</span>
                        <Badge variant="outline" className="border-primary/30 flex-shrink-0">v{pkg.version}</Badge>
                      </div>
                      <Badge className={`${getFeedBadgeClass(pkg.currentFeed)} flex-shrink-0 ml-2`}>{pkg.currentFeed}</Badge>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted/50 mb-2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {searchMode === 'dependency' 
                    ? `No packages found using dependency "${searchQuery}"` 
                    : `No packages found matching "${searchQuery}"`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
