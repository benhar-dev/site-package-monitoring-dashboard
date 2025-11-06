export interface Package {
  id: string;
  name: string;
  version: string;
  description: string;
  dependencies: Dependency[];
  currentFeed: 'experimental' | 'testing' | 'stable' | 'outdated' | 'removed';
  publishedDate?: Date;
  projectUrl?: string;
  author?: string;
  tags?: string[];
}

export interface PackageHistoryData {
  packageName: string;
  versionHistory: VersionHistoryEntry[];
  feedHistoryByVersion: {
    [version: string]: FeedHistoryEntry[];
  };
}

export interface Dependency {
  name: string;
  version: string;
  dependencies?: Dependency[];
}

export interface FeedHistoryEntry {
  feed: 'experimental' | 'testing' | 'stable' | 'outdated';
  enteredDate: Date;
  exitedDate?: Date;
}

export interface VersionHistoryEntry {
  version: string;
  date: Date;
  feed: 'experimental' | 'testing' | 'stable' | 'outdated';
}
