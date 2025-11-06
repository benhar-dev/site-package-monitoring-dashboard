import { Package, PackageHistoryData } from '../types/package';

export const getDaysInCurrentFeed = (pkg: Package, packageHistory?: PackageHistoryData): number => {
  if (!packageHistory) return 0;
  
  const feedHistory = packageHistory.feedHistoryByVersion[pkg.version];
  if (!feedHistory) return 0;
  
  const currentEntry = feedHistory.find(
    entry => entry.feed === pkg.currentFeed && !entry.exitedDate
  );
  
  if (!currentEntry) return 0;
  
  const now = new Date();
  const entered = new Date(currentEntry.enteredDate);
  const diffTime = Math.abs(now.getTime() - entered.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const getDaysUntilAutoMove = (pkg: Package, packageHistory?: PackageHistoryData): number | null => {
  if (pkg.currentFeed === 'stable' || pkg.currentFeed === 'outdated') {
    return null; // These feeds don't auto-move
  }
  
  const daysIn = getDaysInCurrentFeed(pkg, packageHistory);
  const daysRemaining = 20 - daysIn;
  
  return daysRemaining > 0 ? daysRemaining : 0;
};

export const hasVersionReset = (packageHistory?: PackageHistoryData): boolean => {
  if (!packageHistory) return false;
  return packageHistory.versionHistory.length > 1;
};

export const getLatestVersionChange = (packageHistory?: PackageHistoryData): { oldVersion: string; newVersion: string; daysAgo: number } | null => {
  if (!packageHistory || packageHistory.versionHistory.length < 2) return null;
  
  const sorted = [...packageHistory.versionHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const latest = sorted[0];
  const previous = sorted[1];
  
  const now = new Date();
  const changeDate = new Date(latest.date);
  const diffTime = Math.abs(now.getTime() - changeDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    oldVersion: previous.version,
    newVersion: latest.version,
    daysAgo: diffDays
  };
};

export const isNewPackage = (pkg: Package, packageHistory?: PackageHistoryData, days: number = 7): boolean => {
  if (!packageHistory) return false;
  
  const feedHistory = packageHistory.feedHistoryByVersion[pkg.version];
  if (!feedHistory || feedHistory.length === 0) return false;
  
  const firstEntry = feedHistory[0];
  
  const now = new Date();
  const entered = new Date(firstEntry.enteredDate);
  const diffTime = Math.abs(now.getTime() - entered.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= days;
};

export const searchPackagesByDependency = (packages: Package[], dependencyName: string): Array<{ package: Package; matchingDeps: string[] }> => {
  const searchInDeps = (deps: any[], name: string): string[] => {
    const matches: string[] = [];
    for (const dep of deps) {
      if (dep.name.toLowerCase().includes(name.toLowerCase())) {
        matches.push(dep.name);
      }
      if (dep.dependencies) {
        const nestedMatches = searchInDeps(dep.dependencies, name);
        matches.push(...nestedMatches);
      }
    }
    return matches;
  };
  
  const results: Array<{ package: Package; matchingDeps: string[] }> = [];
  
  for (const pkg of packages) {
    const matchingDeps = searchInDeps(pkg.dependencies, dependencyName);
    if (matchingDeps.length > 0) {
      // Remove duplicates
      const uniqueDeps = Array.from(new Set(matchingDeps));
      results.push({ package: pkg, matchingDeps: uniqueDeps });
    }
  }
  
  return results;
};
