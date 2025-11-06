import { useState } from 'react';
import { Package } from './types/package';
import { mockPackages, packageHistoryData } from './data/mockPackages';
import { PackageList } from './components/PackageList';
import { PackageDetails } from './components/PackageDetails';
import { DependencySearch } from './components/DependencySearch';
import { StatisticsPanel } from './components/StatisticsPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Server } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [activeFeed, setActiveFeed] = useState<string>('stable');
  
  // Get package history for the selected package
  const selectedPackageHistory = selectedPackage 
    ? packageHistoryData.find(h => h.packageName === selectedPackage.name)
    : undefined;
  
  // Handler for timeline item clicks
  const handleTimelineItemClick = (packageName: string, version: string, feed: string) => {
    // Find the package with the matching name, version, and feed
    const targetPackage = mockPackages.find(
      pkg => pkg.name === packageName && pkg.version === version && pkg.currentFeed === feed
    );
    
    if (targetPackage) {
      setActiveFeed(feed);
      setSelectedPackage(targetPackage);
    }
  };
  
  const stablePackages = mockPackages.filter(pkg => pkg.currentFeed === 'stable');
  const testingPackages = mockPackages.filter(pkg => pkg.currentFeed === 'testing');
  const experimentalPackages = mockPackages.filter(pkg => pkg.currentFeed === 'experimental');
  const outdatedPackages = mockPackages.filter(pkg => pkg.currentFeed === 'outdated');
  const removedPackages = mockPackages.filter(pkg => pkg.currentFeed === 'removed');
  
  return (
    <div className="min-h-screen bg-background dark">
      <Toaster />
      <div className="container mx-auto p-4 lg:p-6 space-y-4">
        <div className="glass-strong p-4 lg:p-6 rounded-xl border border-primary/20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Server className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <h1 className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  Package Server Monitor
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Track packages across feeds and monitor automatic transitions
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatisticsPanel 
                packages={mockPackages} 
                packageHistoryData={packageHistoryData}
                onSelectPackage={setSelectedPackage}
                onSetActiveFeed={setActiveFeed}
              />
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <DependencySearch
              packages={mockPackages}
              onSelectPackage={setSelectedPackage}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Feeds */}
          <div>
            <Tabs value={activeFeed} onValueChange={setActiveFeed} className="w-full">
              <TabsList className="glass-strong grid w-full grid-cols-5 p-1 h-auto">
                <TabsTrigger value="stable" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                  <span className="hidden sm:inline">Stable</span> ({stablePackages.length})
                </TabsTrigger>
                <TabsTrigger value="testing" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                  <span className="hidden sm:inline">Testing</span> ({testingPackages.length})
                </TabsTrigger>
                <TabsTrigger value="experimental" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                  <span className="hidden sm:inline">Exp.</span> ({experimentalPackages.length})
                </TabsTrigger>
                <TabsTrigger value="outdated" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                  <span className="hidden sm:inline">Out.</span> ({outdatedPackages.length})
                </TabsTrigger>
                <TabsTrigger value="removed" className="data-[state=active]:bg-gray-500/20 data-[state=active]:text-gray-400">
                  <span className="hidden sm:inline">Rem.</span> ({removedPackages.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stable" className="mt-4">
                <Card className="glass border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Stable Feed
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Production-ready packages
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-[calc(100vh-280px)] overflow-y-auto">
                    <PackageList
                      packages={stablePackages}
                      selectedPackage={selectedPackage}
                      onSelectPackage={setSelectedPackage}
                      packageHistoryData={packageHistoryData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="testing" className="mt-4">
                <Card className="glass border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Testing Feed
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Auto-move to stable after 20 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-[calc(100vh-280px)] overflow-y-auto">
                    <PackageList
                      packages={testingPackages}
                      selectedPackage={selectedPackage}
                      onSelectPackage={setSelectedPackage}
                      packageHistoryData={packageHistoryData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="experimental" className="mt-4">
                <Card className="glass border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      Experimental Feed
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Auto-move to testing after 20 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-[calc(100vh-280px)] overflow-y-auto">
                    <PackageList
                      packages={experimentalPackages}
                      selectedPackage={selectedPackage}
                      onSelectPackage={setSelectedPackage}
                      packageHistoryData={packageHistoryData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="outdated" className="mt-4">
                <Card className="glass border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Outdated Feed
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Deprecated packages
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-[calc(100vh-280px)] overflow-y-auto">
                    <PackageList
                      packages={outdatedPackages}
                      selectedPackage={selectedPackage}
                      onSelectPackage={setSelectedPackage}
                      packageHistoryData={packageHistoryData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="removed" className="mt-4">
                <Card className="glass border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      Removed Packages
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Deleted from all feeds
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-[calc(100vh-280px)] overflow-y-auto">
                    <PackageList
                      packages={removedPackages}
                      selectedPackage={selectedPackage}
                      onSelectPackage={setSelectedPackage}
                      packageHistoryData={packageHistoryData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column - Package Details */}
          <div>
            {selectedPackage ? (
              <PackageDetails 
                package={selectedPackage} 
                packageHistory={selectedPackageHistory}
                onTimelineItemClick={handleTimelineItemClick}
              />
            ) : (
              <Card className="glass-strong border-primary/20 h-[calc(100vh-180px)] flex items-center justify-center">
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Server className="h-8 w-8 text-primary" />
                    </div>
                    <p>Select a package to view details</p>
                    <p className="text-xs mt-2">Click on any package from the left to see dependencies and history</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
