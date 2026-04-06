#!/usr/bin/env node
/**
 * Build-time script: Fetches GitHub portfolio data via GraphQL.
 * Writes src/data/github-data.json for static import by Vite.
 *
 * Usage:
 *   GH_GRAPHQL_TOKEN=ghp_xxx GITHUB_LOGIN=HJMillan node scripts/fetch-github.mjs
 *
 * Required env:
 *   - GH_GRAPHQL_TOKEN: GitHub Personal Access Token (fine-grained, public_repo read)
 *   - GITHUB_LOGIN: GitHub username (default: HJMillan)
 */

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../src/data/github-data.json');

const TOKEN = process.env.GH_GRAPHQL_TOKEN;
const LOGIN = process.env.GITHUB_LOGIN || 'HJMillan';

if (!TOKEN) {
  console.error('❌ GH_GRAPHQL_TOKEN is required. Set it as an environment variable.');
  console.error('   Example: GH_GRAPHQL_TOKEN=ghp_xxx node scripts/fetch-github.mjs');
  process.exit(1);
}

// ============================================
// GraphQL Mega-Query
// ============================================

const QUERY = `
query PortfolioDashboard($login: String!) {
  user(login: $login) {
    name
    avatarUrl
    bio
    location
    createdAt

    publicRepos: repositories(privacy: PUBLIC) { totalCount }
    followers { totalCount }
    mergedPRs: pullRequests(states: MERGED) { totalCount }

    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      contributionCalendar { totalContributions }
    }

    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          id
          name
          description
          url
          homepageUrl
          updatedAt
          stargazerCount
          forkCount
          repositoryTopics(first: 6) {
            nodes { topic { name } }
          }
          languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name color }
            }
          }
        }
      }
    }

    repos: repositories(
      first: 30
      orderBy: { field: UPDATED_AT, direction: DESC }
      privacy: PUBLIC
      isFork: false
    ) {
      nodes {
        id
        name
        description
        url
        homepageUrl
        updatedAt
        createdAt
        pushedAt
        stargazerCount
        forkCount
        isArchived
        primaryLanguage { name color }
        repositoryTopics(first: 6) {
          nodes { topic { name } }
        }
      }
    }

    repositoriesContributedTo(
      first: 5
      orderBy: { field: UPDATED_AT, direction: DESC }
      privacy: PUBLIC
      contributionTypes: COMMIT
    ) {
      nodes {
        name
        owner { login }
        url
      }
    }
  }
}
`;

// ============================================
// Fetch
// ============================================

async function fetchGraphQL() {
  console.log(`🔄 Fetching GitHub data for @${LOGIN}...`);

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-build-script',
    },
    body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors, null, 2)}`);
  }

  return json.data.user;
}

// ============================================
// Transform: GraphQL → App-compatible JSON
// ============================================

/** @param {string} color - hex color like "#3178C6" */
const LANG_FALLBACK_COLORS = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3572A5',
  'C#': '#239120',
  HTML: '#E34C26',
  CSS: '#563D7C',
};

function transformRepo(node) {
  return {
    id: hashId(node.id),
    name: node.name,
    full_name: `${LOGIN}/${node.name}`,
    description: node.description,
    html_url: node.url,
    language: node.primaryLanguage?.name ?? null,
    stargazers_count: node.stargazerCount,
    forks_count: node.forkCount,
    watchers_count: node.stargazerCount,
    topics: (node.repositoryTopics?.nodes ?? []).map((n) => n.topic.name),
    updated_at: node.updatedAt,
    created_at: node.createdAt ?? node.updatedAt,
    pushed_at: node.pushedAt ?? node.updatedAt,
    fork: false,
    archived: node.isArchived ?? false,
    homepage: node.homepageUrl ?? null,
  };
}

function transformPinnedRepo(node) {
  return {
    id: hashId(node.id),
    name: node.name,
    full_name: `${LOGIN}/${node.name}`,
    description: node.description,
    html_url: node.url,
    language: node.languages?.edges?.[0]?.node?.name ?? null,
    stargazers_count: node.stargazerCount,
    forks_count: node.forkCount,
    watchers_count: node.stargazerCount,
    topics: (node.repositoryTopics?.nodes ?? []).map((n) => n.topic.name),
    updated_at: node.updatedAt,
    created_at: node.updatedAt,
    pushed_at: node.updatedAt,
    fork: false,
    archived: false,
    homepage: node.homepageUrl ?? null,
  };
}

// Remap language labels for display (GitHub detects file types, not frameworks)
const LABEL_REMAP = {
  TypeScript: { language: 'React / TypeScript', color: '#61DAFB' },
};

function calculateLanguages(pinnedNodes) {
  const aggregated = {};

  for (const node of pinnedNodes) {
    for (const edge of node.languages?.edges ?? []) {
      const name = edge.node.name;
      const color = edge.node.color || LANG_FALLBACK_COLORS[name] || '#8B8B8B';
      if (!aggregated[name]) aggregated[name] = { bytes: 0, color };
      aggregated[name].bytes += edge.size;
    }
  }

  const totalBytes = Object.values(aggregated).reduce((a, b) => a + b.bytes, 0);

  return Object.entries(aggregated)
    .map(([language, { bytes, color }]) => {
      const remap = LABEL_REMAP[language];
      return {
        language: remap?.language ?? language,
        bytes,
        percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
        color: remap?.color ?? color,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);
}

/** Convert GraphQL node ID to a numeric hash for compatibility */
function hashId(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.trunc((hash << 5) - hash + (str.codePointAt(i) ?? 0));
  }
  return Math.abs(hash);
}

function transform(user) {
  const createdYear = new Date(user.createdAt).getFullYear();
  const currentYear = new Date().getFullYear();

  return {
    profile: {
      login: LOGIN,
      avatar_url: user.avatarUrl,
      html_url: `https://github.com/${LOGIN}`,
      name: user.name,
      bio: user.bio,
      public_repos: user.publicRepos.totalCount,
      public_gists: 0,
      followers: user.followers.totalCount,
      following: 0,
      created_at: user.createdAt,
    },
    kpis: {
      publicRepos: user.publicRepos.totalCount,
      followers: user.followers.totalCount,
      mergedPRs: user.mergedPRs.totalCount,
      totalCommits: user.contributionsCollection.totalCommitContributions,
      totalPRContributions: user.contributionsCollection.totalPullRequestContributions,
      totalIssueContributions: user.contributionsCollection.totalIssueContributions,
      totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
      yearsActive: currentYear - createdYear,
    },
    pinnedRepos: (user.pinnedItems?.nodes ?? []).map(transformPinnedRepo),
    repos: (user.repos?.nodes ?? []).filter((n) => !n.isArchived).map(transformRepo),
    languages: calculateLanguages(user.pinnedItems?.nodes ?? []),
    contributedTo: (user.repositoriesContributedTo?.nodes ?? []).map((n) => ({
      name: n.name,
      owner: n.owner.login,
      url: n.url,
    })),
    fetchedAt: new Date().toISOString(),
  };
}

// ============================================
// Main
// ============================================

try {
  const user = await fetchGraphQL();
  const data = transform(user);

  writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`✅ GitHub data written to ${OUTPUT_PATH}`);
  console.log(`   📦 ${data.repos.length} repos, ${data.pinnedRepos.length} pinned, ${data.languages.length} languages`);
  console.log(`   📊 KPIs: ${data.kpis.totalCommits} commits, ${data.kpis.mergedPRs} PRs, ${data.kpis.totalContributions} contributions`);
  console.log(`   🕐 Fetched at: ${data.fetchedAt}`);
} catch (err) {
  console.error('❌ Failed to fetch GitHub data:', err.message);
  process.exit(1);
}
