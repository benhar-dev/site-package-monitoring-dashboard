import { Package, PackageHistoryData } from '../types/package';

// Helper to calculate dates relative to today
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const mockPackages: Package[] = [
  // api-connector versions
  {
    id: '1',
    name: 'api-connector',
    version: '2.0.0',
    description: 'Full-stack API connector showing complete version pipeline',
    currentFeed: 'stable',
    publishedDate: daysAgo(45),
    projectUrl: 'https://github.com/example/api-connector',
    author: 'Jane Developer',
    tags: ['api', 'connector', 'http', 'rest'],
    dependencies: [
      {
        name: 'axios',
        version: '1.6.0',
        dependencies: []
      }
    ]
  },
  {
    id: '1b',
    name: 'api-connector',
    version: '1.0.0',
    description: 'Full-stack API connector showing complete version pipeline',
    currentFeed: 'outdated',
    publishedDate: daysAgo(120),
    projectUrl: 'https://github.com/example/api-connector',
    author: 'Jane Developer',
    tags: ['api', 'connector', 'http', 'rest'],
    dependencies: [
      {
        name: 'axios',
        version: '1.4.0',
        dependencies: []
      }
    ]
  },
  {
    id: '1c',
    name: 'api-connector',
    version: '3.0.0',
    description: 'Full-stack API connector showing complete version pipeline',
    currentFeed: 'removed',
    publishedDate: daysAgo(10),
    projectUrl: 'https://github.com/example/api-connector',
    author: 'Jane Developer',
    tags: ['api', 'connector', 'http', 'rest'],
    dependencies: [
      {
        name: 'axios',
        version: '1.6.2',
        dependencies: []
      }
    ]
  },
  {
    id: '1c2',
    name: 'api-connector',
    version: '3.1.0',
    description: 'Full-stack API connector showing complete version pipeline',
    currentFeed: 'testing',
    publishedDate: daysAgo(5),
    projectUrl: 'https://github.com/example/api-connector',
    author: 'Jane Developer',
    tags: ['api', 'connector', 'http', 'rest'],
    dependencies: [
      {
        name: 'axios',
        version: '1.6.5',
        dependencies: []
      }
    ]
  },
  {
    id: '1d',
    name: 'api-connector',
    version: '4.0.0',
    description: 'Full-stack API connector showing complete version pipeline',
    currentFeed: 'experimental',
    publishedDate: daysAgo(2),
    projectUrl: 'https://github.com/example/api-connector',
    author: 'Jane Developer',
    tags: ['api', 'connector', 'http', 'rest'],
    dependencies: [
      {
        name: 'axios',
        version: '1.7.0',
        dependencies: []
      }
    ]
  },
  // react-ui-toolkit
  {
    id: '2',
    name: 'react-ui-toolkit',
    version: '3.2.1',
    description: 'Comprehensive UI component library for React applications',
    currentFeed: 'stable',
    publishedDate: daysAgo(60),
    projectUrl: 'https://github.com/example/react-ui-toolkit',
    author: 'UI Team',
    tags: ['react', 'ui', 'components', 'design-system', 'frontend'],
    dependencies: [
      {
        name: 'react',
        version: '18.2.0',
        dependencies: [
          { name: 'loose-envify', version: '1.4.0' },
          { name: 'scheduler', version: '0.23.0' }
        ]
      },
      {
        name: 'react-dom',
        version: '18.2.0',
        dependencies: [
          { name: 'react', version: '18.2.0' },
          { name: 'scheduler', version: '0.23.0' }
        ]
      }
    ]
  },
  // data-validator
  {
    id: '3',
    name: 'data-validator',
    version: '2.1.1',
    description: 'Schema validation and data sanitization library',
    currentFeed: 'testing',
    publishedDate: daysAgo(15),
    projectUrl: 'https://github.com/example/data-validator',
    author: 'Alex Smith',
    tags: ['validation', 'schema', 'data', 'sanitization'],
    dependencies: [
      {
        name: 'lodash',
        version: '4.17.21',
        dependencies: []
      },
      {
        name: 'ajv',
        version: '8.12.0',
        dependencies: [
          { name: 'fast-deep-equal', version: '3.1.3' },
          { name: 'json-schema-traverse', version: '1.0.0' }
        ]
      }
    ]
  },
  // auth-manager
  {
    id: '4',
    name: 'auth-manager',
    version: '1.5.2',
    description: 'Authentication and authorization management',
    currentFeed: 'testing',
    publishedDate: daysAgo(18),
    projectUrl: 'https://github.com/example/auth-manager',
    author: 'Security Team',
    tags: ['authentication', 'authorization', 'security', 'jwt', 'oauth'],
    dependencies: [
      {
        name: 'jsonwebtoken',
        version: '9.0.2',
        dependencies: [
          { name: 'jws', version: '3.2.2' },
          { name: 'ms', version: '2.1.3' }
        ]
      },
      {
        name: 'bcrypt',
        version: '5.1.1',
        dependencies: []
      }
    ]
  },
  // graph-renderer
  {
    id: '5',
    name: 'graph-renderer',
    version: '4.0.0',
    description: 'High-performance graph and chart rendering engine',
    currentFeed: 'experimental',
    publishedDate: daysAgo(3),
    projectUrl: 'https://github.com/example/graph-renderer',
    author: 'Visualization Lab',
    tags: ['graph', 'chart', 'visualization', 'd3', 'canvas'],
    dependencies: [
      {
        name: 'd3',
        version: '7.8.5',
        dependencies: [
          { name: 'd3-scale', version: '4.0.2' },
          { name: 'd3-shape', version: '3.2.0' },
          { name: 'd3-selection', version: '3.0.0' }
        ]
      },
      {
        name: 'canvas',
        version: '2.11.2',
        dependencies: []
      }
    ]
  },
  // api-client
  {
    id: '6',
    name: 'api-client',
    version: '2.3.1',
    description: 'RESTful API client with automatic retry and caching',
    currentFeed: 'experimental',
    publishedDate: daysAgo(4),
    projectUrl: 'https://github.com/example/api-client',
    author: 'Jane Developer',
    tags: ['api', 'rest', 'http', 'client', 'caching'],
    dependencies: [
      {
        name: 'axios',
        version: '1.6.0',
        dependencies: [
          { name: 'follow-redirects', version: '1.15.3' },
          { name: 'form-data', version: '4.0.0' }
        ]
      }
    ]
  },
  // logger-pro
  {
    id: '7',
    name: 'logger-pro',
    version: '3.1.0',
    description: 'Advanced logging with multiple transports',
    currentFeed: 'stable',
    publishedDate: daysAgo(90),
    projectUrl: 'https://github.com/example/logger-pro',
    author: 'DevOps Team',
    tags: ['logging', 'winston', 'monitoring', 'debugging'],
    dependencies: [
      {
        name: 'winston',
        version: '3.11.0',
        dependencies: [
          { name: 'async', version: '3.2.4' },
          { name: 'colors', version: '1.4.0' }
        ]
      }
    ]
  },
  // image-optimizer
  {
    id: '8',
    name: 'image-optimizer',
    version: '1.2.5',
    description: 'Image compression and optimization toolkit',
    currentFeed: 'outdated',
    publishedDate: daysAgo(200),
    projectUrl: 'https://github.com/example/image-optimizer',
    author: 'Media Team',
    tags: ['image', 'optimization', 'compression', 'sharp'],
    dependencies: [
      {
        name: 'sharp',
        version: '0.32.6',
        dependencies: []
      }
    ]
  },
  // cache-manager
  {
    id: '9',
    name: 'cache-manager',
    version: '5.0.1',
    description: 'Multi-layer caching solution',
    currentFeed: 'stable',
    publishedDate: daysAgo(75),
    projectUrl: 'https://github.com/example/cache-manager',
    author: 'Performance Team',
    tags: ['cache', 'redis', 'performance', 'memory'],
    dependencies: [
      {
        name: 'redis',
        version: '4.6.10',
        dependencies: [
          { name: '@redis/client', version: '1.5.11' },
          { name: '@redis/bloom', version: '1.2.0' }
        ]
      },
      {
        name: 'lru-cache',
        version: '10.0.1',
        dependencies: []
      }
    ]
  },
  // form-builder
  {
    id: '10',
    name: 'form-builder',
    version: '2.8.0',
    description: 'Dynamic form generation and validation',
    currentFeed: 'testing',
    publishedDate: daysAgo(12),
    projectUrl: 'https://github.com/example/form-builder',
    author: 'UI Team',
    tags: ['forms', 'validation', 'react', 'formik', 'ui'],
    dependencies: [
      {
        name: 'react',
        version: '18.2.0',
        dependencies: [
          { name: 'loose-envify', version: '1.4.0' },
          { name: 'scheduler', version: '0.23.0' }
        ]
      },
      {
        name: 'formik',
        version: '2.4.5',
        dependencies: [
          { name: 'react', version: '18.2.0' }
        ]
      },
      {
        name: 'yup',
        version: '1.3.3',
        dependencies: []
      }
    ]
  },
  // notification-service
  {
    id: '11',
    name: 'notification-service',
    version: '1.1.2',
    description: 'Multi-channel notification system',
    currentFeed: 'experimental',
    dependencies: [
      {
        name: 'nodemailer',
        version: '6.9.7',
        dependencies: []
      },
      {
        name: 'twilio',
        version: '4.19.0',
        dependencies: [
          { name: 'axios', version: '1.6.0' }
        ]
      }
    ]
  },
  // hotfix-package
  {
    id: '12',
    name: 'hotfix-package',
    version: '2.5.3',
    description: 'Package with urgent hotfixes showing non-linear progression',
    currentFeed: 'stable',
    dependencies: [
      {
        name: 'core-lib',
        version: '1.0.0',
        dependencies: []
      }
    ]
  },
  // deprecated-utils
  {
    id: '13',
    name: 'deprecated-utils',
    version: '1.0.5',
    description: 'Old utility package that was removed from all feeds',
    currentFeed: 'removed',
    dependencies: []
  },
  // broken-package
  {
    id: '14',
    name: 'broken-package',
    version: '0.1.0',
    description: 'Package that was removed during testing due to critical issues',
    currentFeed: 'removed',
    dependencies: []
  }
];

// Package history data - organized by package name
export const packageHistoryData: PackageHistoryData[] = [
  {
    packageName: 'api-connector',
    versionHistory: [
      { version: '1.0.0', date: daysAgo(180), feed: 'experimental' },
      { version: '2.0.0', date: daysAgo(100), feed: 'experimental' },
      { version: '3.0.0', date: daysAgo(40), feed: 'experimental' },
      { version: '3.1.0', date: daysAgo(10), feed: 'testing' },
      { version: '4.0.0', date: daysAgo(5), feed: 'experimental' }
    ],
    feedHistoryByVersion: {
      '1.0.0': [
        { feed: 'experimental', enteredDate: daysAgo(180), exitedDate: daysAgo(160) },
        { feed: 'testing', enteredDate: daysAgo(160), exitedDate: daysAgo(140) },
        { feed: 'stable', enteredDate: daysAgo(140), exitedDate: daysAgo(80) },
        { feed: 'outdated', enteredDate: daysAgo(80) }
      ],
      '2.0.0': [
        { feed: 'experimental', enteredDate: daysAgo(100), exitedDate: daysAgo(80) },
        { feed: 'testing', enteredDate: daysAgo(80), exitedDate: daysAgo(60) },
        { feed: 'stable', enteredDate: daysAgo(60) }
      ],
      '3.0.0': [
        { feed: 'experimental', enteredDate: daysAgo(40), exitedDate: daysAgo(20) },
        { feed: 'testing', enteredDate: daysAgo(20), exitedDate: daysAgo(10) }
      ],
      '3.1.0': [
        { feed: 'testing', enteredDate: daysAgo(10) }
      ],
      '4.0.0': [
        { feed: 'experimental', enteredDate: daysAgo(5) }
      ]
    }
  },
  {
    packageName: 'react-ui-toolkit',
    versionHistory: [
      { version: '3.0.0', date: daysAgo(120), feed: 'experimental' },
      { version: '3.1.0', date: daysAgo(70), feed: 'experimental' },
      { version: '3.2.0', date: daysAgo(45), feed: 'experimental' },
      { version: '3.2.1', date: daysAgo(20), feed: 'experimental' }
    ],
    feedHistoryByVersion: {
      '3.2.1': [
        { feed: 'experimental', enteredDate: daysAgo(20), exitedDate: daysAgo(15) },
        { feed: 'testing', enteredDate: daysAgo(15), exitedDate: daysAgo(3) },
        { feed: 'stable', enteredDate: daysAgo(3) }
      ]
    }
  },
  {
    packageName: 'data-validator',
    versionHistory: [
      { version: '2.1.0', date: daysAgo(45), feed: 'experimental' },
      { version: '2.1.1', date: daysAgo(25), feed: 'experimental' }
    ],
    feedHistoryByVersion: {
      '2.1.0': [
        { feed: 'experimental', enteredDate: daysAgo(45), exitedDate: daysAgo(35) },
        { feed: 'testing', enteredDate: daysAgo(35), exitedDate: daysAgo(30) }
      ],
      '2.1.1': [
        { feed: 'experimental', enteredDate: daysAgo(25), exitedDate: daysAgo(15) },
        { feed: 'testing', enteredDate: daysAgo(15) }
      ]
    }
  },
  {
    packageName: 'auth-manager',
    versionHistory: [
      { version: '1.5.2', date: daysAgo(22), feed: 'experimental' }
    ],
    feedHistoryByVersion: {
      '1.5.2': [
        { feed: 'experimental', enteredDate: daysAgo(22), exitedDate: daysAgo(2) },
        { feed: 'testing', enteredDate: daysAgo(2) }
      ]
    }
  },
  {
    packageName: 'graph-renderer',
    versionHistory: [
      { version: '4.0.0', date: daysAgo(12), feed: 'experimental' }
    ],
    feedHistoryByVersion: {
      '4.0.0': [
        { feed: 'experimental', enteredDate: daysAgo(12) }
      ]
    }
  },
  {
    packageName: 'api-client',
    versionHistory: [
      { version: '2.3.0', date: daysAgo(18), feed: 'experimental' },
      { version: '2.3.1', date: daysAgo(5), feed: 'experimental' }
    ],
    feedHistoryByVersion: {
      '2.3.0': [
        { feed: 'experimental', enteredDate: daysAgo(18), exitedDate: daysAgo(5) }
      ],
      '2.3.1': [
        { feed: 'experimental', enteredDate: daysAgo(5) }
      ]
    }
  },
  {
    packageName: 'logger-pro',
    versionHistory: [
      { version: '3.1.0', date: daysAgo(70), feed: 'experimental' }
    ],
    feedHistoryByVersion: {
      '3.1.0': [
        { feed: 'experimental', enteredDate: daysAgo(70), exitedDate: daysAgo(50) },
        { feed: 'testing', enteredDate: daysAgo(50), exitedDate: daysAgo(30) },
        { feed: 'stable', enteredDate: daysAgo(30) }
      ]
    }
  },
  {
    packageName: 'image-optimizer',
    versionHistory: [
      { version: '1.2.5', date: daysAgo(150), feed: 'experimental' }
    ],
    feedHistoryByVersion: {
      '1.2.5': [
        { feed: 'experimental', enteredDate: daysAgo(150), exitedDate: daysAgo(130) },
        { feed: 'testing', enteredDate: daysAgo(130), exitedDate: daysAgo(110) },
        { feed: 'stable', enteredDate: daysAgo(110), exitedDate: daysAgo(10) },
        { feed: 'outdated', enteredDate: daysAgo(10) }
      ]
    }
  },
  {
    packageName: 'cache-manager',
    versionHistory: [
      { version: '5.0.1', date: daysAgo(2), feed: 'experimental' }
    ],
    feedHistoryByVersion: {
      '5.0.1': [
        { feed: 'experimental', enteredDate: daysAgo(2), exitedDate: daysAgo(2) },
        { feed: 'testing', enteredDate: daysAgo(2), exitedDate: daysAgo(2) },
        { feed: 'stable', enteredDate: daysAgo(2) }
      ]
    }
  },
  {
    packageName: 'form-builder',
    versionHistory: [
      { version: '2.8.0', date: daysAgo(28), feed: 'experimental' }
    ],
    feedHistoryByVersion: {
      '2.8.0': [
        { feed: 'experimental', enteredDate: daysAgo(28), exitedDate: daysAgo(8) },
        { feed: 'testing', enteredDate: daysAgo(8) }
      ]
    }
  },
  {
    packageName: 'notification-service',
    versionHistory: [
      { version: '1.1.0', date: daysAgo(16), feed: 'experimental' },
      { version: '1.1.1', date: daysAgo(9), feed: 'experimental' },
      { version: '1.1.2', date: daysAgo(3), feed: 'experimental' }
    ],
    feedHistoryByVersion: {
      '1.1.2': [
        { feed: 'experimental', enteredDate: daysAgo(3) }
      ]
    }
  },
  {
    packageName: 'hotfix-package',
    versionHistory: [
      { version: '2.5.0', date: daysAgo(90), feed: 'experimental' },
      { version: '2.5.1', date: daysAgo(28), feed: 'testing' },
      { version: '2.5.2', date: daysAgo(22), feed: 'experimental' },
      { version: '2.5.3', date: daysAgo(15), feed: 'stable' }
    ],
    feedHistoryByVersion: {
      '2.5.0': [
        { feed: 'experimental', enteredDate: daysAgo(90), exitedDate: daysAgo(70) },
        { feed: 'testing', enteredDate: daysAgo(70), exitedDate: daysAgo(50) },
        { feed: 'stable', enteredDate: daysAgo(50), exitedDate: daysAgo(30) }
      ],
      '2.5.1': [
        { feed: 'testing', enteredDate: daysAgo(28), exitedDate: daysAgo(25) }
      ],
      '2.5.2': [
        { feed: 'experimental', enteredDate: daysAgo(22), exitedDate: daysAgo(18) }
      ],
      '2.5.3': [
        { feed: 'stable', enteredDate: daysAgo(15) }
      ]
    }
  },
  {
    packageName: 'deprecated-utils',
    versionHistory: [
      { version: '1.0.5', date: daysAgo(100), feed: 'experimental' }
    ],
    feedHistoryByVersion: {
      '1.0.5': [
        { feed: 'experimental', enteredDate: daysAgo(100), exitedDate: daysAgo(80) },
        { feed: 'testing', enteredDate: daysAgo(80), exitedDate: daysAgo(60) },
        { feed: 'stable', enteredDate: daysAgo(60), exitedDate: daysAgo(40) },
        { feed: 'outdated', enteredDate: daysAgo(40), exitedDate: daysAgo(10) }
      ]
    }
  },
  {
    packageName: 'broken-package',
    versionHistory: [
      { version: '0.1.0', date: daysAgo(35), feed: 'experimental' }
    ],
    feedHistoryByVersion: {
      '0.1.0': [
        { feed: 'experimental', enteredDate: daysAgo(35), exitedDate: daysAgo(28) },
        { feed: 'testing', enteredDate: daysAgo(28), exitedDate: daysAgo(20) }
      ]
    }
  }
];
