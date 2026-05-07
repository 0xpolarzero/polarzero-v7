import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(rootDir, "src/data/chat-context.md");
const instructionsPath = resolve(rootDir, "src/data/chat-instructions.md");
const profilePath = resolve(rootDir, "src/data/profile.ts");
const timelinePath = resolve(rootDir, "src/data/timeline.ts");
const socialsPath = resolve(rootDir, "src/data/socials.ts");
const pinnedReposPath = resolve(rootDir, "src/data/pinned-repos.json");
const sharedDescriptionLinksPath = resolve(rootDir, "src/data/shared-description-links.ts");

const githubToken = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
const fetchTimeoutMs = Number(process.env.CHAT_CONTEXT_FETCH_TIMEOUT_MS ?? 15_000);
const maxInlineReadmeDepth = Number(process.env.CHAT_CONTEXT_MAX_README_DEPTH ?? 3);

const fetchNotes = [];

const markdownLinkPattern = /!?\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

const GITHUB_README_OWNER_ALLOWLIST = new Set(["0xpolarzero", "evmts", "polareth", "primodiumxyz"]);

const sourceHeaders = {
  "User-Agent": "polarzero-v7-chat-context-generator",
  ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
};

const readText = (path) => readFile(path, "utf8");

const normalizeWhitespace = (value) => value.replace(/\r\n/g, "\n").trim();

const extractConstExpression = (source, exportName) => {
  const startPattern = new RegExp(`export\\s+const\\s+${exportName}(?:\\s*:[^=]+)?\\s*=`);
  const match = startPattern.exec(source);

  if (!match) {
    throw new Error(`Could not find exported const ${exportName}.`);
  }

  let index = match.index + match[0].length;

  while (/\s/.test(source[index])) {
    index += 1;
  }

  const opener = source[index];
  const closer = opener === "{" ? "}" : opener === "[" ? "]" : null;

  if (!closer) {
    throw new Error(`Exported const ${exportName} must start with an object or array literal.`);
  }

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let cursor = index; cursor < source.length; cursor += 1) {
    const char = source[cursor];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === opener) {
      depth += 1;
    } else if (char === closer) {
      depth -= 1;

      if (depth === 0) {
        return source.slice(index, cursor + 1);
      }
    }
  }

  throw new Error(`Could not parse exported const ${exportName}.`);
};

const evaluateConst = (source, exportName) => {
  const expression = extractConstExpression(source, exportName);

  return Function(`"use strict"; return (${expression});`)();
};

const formatDateRange = (item) => {
  if (!item.to) {
    return item.from;
  }

  return `${item.from} to ${item.to}`;
};

const uniqueBy = (items, keyFn) => {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    const key = keyFn(item);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
};

const githubPartsFromUrl = (url) => {
  let parsed;

  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.hostname !== "github.com") {
    return null;
  }

  const segments = parsed.pathname.split("/").filter(Boolean);

  if (segments.length < 2) {
    return null;
  }

  const [owner, repo, mode, ref, ...pathSegments] = segments;

  return {
    owner,
    repo,
    mode,
    ref,
    path: pathSegments.join("/"),
  };
};

const isAllowedGithubReadmeUrl = (url) => {
  const github = githubPartsFromUrl(url);

  return Boolean(github && GITHUB_README_OWNER_ALLOWLIST.has(github.owner));
};

const rawGithubUrlFromParts = ({ owner, repo, ref, path }) =>
  `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`;

const canonicalGithubReadmeKey = (url) => {
  const github = githubPartsFromUrl(url);

  if (!github) {
    return url;
  }

  if (!github.mode) {
    return `${github.owner}/${github.repo}/HEAD/README.md`;
  }

  if (github.mode === "tree") {
    const path = [github.path, "README.md"].filter(Boolean).join("/");

    return `${github.owner}/${github.repo}/${github.ref}/${path}`;
  }

  if (github.mode === "blob" && /(^|\/)readme(\.[\w.-]+)?$/i.test(github.path)) {
    return `${github.owner}/${github.repo}/${github.ref}/${github.path}`;
  }

  return url;
};

const tryFetch = async (url, headers = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), fetchTimeoutMs);

  try {
    const response = await fetch(url, {
      headers: { ...sourceHeaders, ...headers },
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

const fetchGithubReadme = async (owner, repo) => {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
  const response = await fetch(apiUrl, {
    headers: {
      ...sourceHeaders,
      Accept: "application/vnd.github.raw+json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const markdown = await response.text();
  const contentUrl = response.headers.get("x-github-media-type") ? apiUrl : null;

  return {
    markdown,
    baseUrl: `https://github.com/${owner}/${repo}/blob/HEAD/README.md`,
    sourceUrl: contentUrl ?? apiUrl,
  };
};

const fetchReadmeForUrl = async (url) => {
  const github = githubPartsFromUrl(url);

  if (!github) {
    return null;
  }

  if (!GITHUB_README_OWNER_ALLOWLIST.has(github.owner)) {
    fetchNotes.push(`Skipped README outside GitHub owner allowlist: ${url}`);
    return null;
  }

  if (!github.mode) {
    const readme = await fetchGithubReadme(github.owner, github.repo);

    if (readme) {
      return readme;
    }

    for (const ref of ["main", "master"]) {
      const rawUrl = rawGithubUrlFromParts({
        owner: github.owner,
        repo: github.repo,
        ref,
        path: "README.md",
      });
      const markdown = await tryFetch(rawUrl);

      if (markdown) {
        return {
          markdown,
          baseUrl: `https://github.com/${github.owner}/${github.repo}/blob/${ref}/README.md`,
          sourceUrl: rawUrl,
        };
      }
    }

    return null;
  }

  if (github.mode === "blob" && /(^|\/)readme(\.[\w.-]+)?$/i.test(github.path)) {
    const rawUrl = rawGithubUrlFromParts(github);
    const markdown = await tryFetch(rawUrl);

    return markdown
      ? {
          markdown,
          baseUrl: url,
          sourceUrl: rawUrl,
        }
      : null;
  }

  if (github.mode === "tree") {
    for (const readmeName of ["README.md", "readme.md"]) {
      const path = [github.path, readmeName].filter(Boolean).join("/");
      const rawUrl = rawGithubUrlFromParts({ ...github, path });
      const markdown = await tryFetch(rawUrl);

      if (markdown) {
        return {
          markdown,
          baseUrl: `https://github.com/${github.owner}/${github.repo}/blob/${github.ref}/${path}`,
          sourceUrl: rawUrl,
        };
      }
    }
  }

  return null;
};

const shouldInlineReadmeLink = (href) => {
  const cleanHref = href.split("#")[0].split("?")[0];

  return /(^|\/)readme(\.[\w.-]+)?$/i.test(cleanHref);
};

const resolveGithubMarkdownHref = (href, baseUrl) => {
  const base = githubPartsFromUrl(baseUrl);

  if (!base?.mode || !base.ref) {
    return null;
  }

  if (href.startsWith("/")) {
    return `https://github.com/${base.owner}/${base.repo}/blob/${base.ref}${href}`;
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(href)) {
    return null;
  }

  const baseDir = base.path.split("/").slice(0, -1).join("/");
  const path = new URL(href, `https://github.local/${baseDir ? `${baseDir}/` : ""}`).pathname
    .split("/")
    .filter(Boolean)
    .join("/");

  return `https://github.com/${base.owner}/${base.repo}/blob/${base.ref}/${path}`;
};

const resolveMarkdownHref = (href, baseUrl) => {
  if (!shouldInlineReadmeLink(href)) {
    return null;
  }

  const githubResolved = resolveGithubMarkdownHref(href, baseUrl);

  if (githubResolved) {
    return githubResolved;
  }

  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
};

const inlineLinkedReadmes = async (markdown, baseUrl, visited, emittedReadmeKeys, depth) => {
  if (depth >= maxInlineReadmeDepth) {
    return markdown;
  }

  const links = [...markdown.matchAll(markdownLinkPattern)]
    .filter((match) => !match[0].startsWith("!"))
    .map((match) => ({
      label: match[1],
      href: match[2],
      resolved: resolveMarkdownHref(match[2], baseUrl),
    }))
    .filter((link) => link.resolved);

  if (!links.length) {
    return markdown;
  }

  const chunks = [markdown];

  for (const link of uniqueBy(links, (item) => item.resolved)) {
    const readmeKey = canonicalGithubReadmeKey(link.resolved);

    if (visited.has(readmeKey) || emittedReadmeKeys.has(readmeKey)) {
      continue;
    }

    visited.add(readmeKey);

    const linkedReadme = await fetchReadmeForUrl(link.resolved);

    if (!linkedReadme) {
      fetchNotes.push(`Could not inline linked README: ${link.resolved}`);
      continue;
    }

    emittedReadmeKeys.add(canonicalGithubReadmeKey(linkedReadme.baseUrl));

    const nestedMarkdown = await inlineLinkedReadmes(
      normalizeWhitespace(linkedReadme.markdown),
      linkedReadme.baseUrl,
      visited,
      emittedReadmeKeys,
      depth + 1,
    );

    chunks.push(
      [
        "",
        `### Inlined linked README: ${link.label || link.resolved}`,
        "",
        `Source: ${link.resolved}`,
        "",
        nestedMarkdown,
      ].join("\n"),
    );
  }

  return chunks.join("\n");
};

const fetchPortfolioReadmes = async (portfolioItems, pinnedRepos) => {
  const candidates = [];

  for (const item of portfolioItems) {
    for (const [label, href] of Object.entries(item.links ?? {})) {
      candidates.push({
        title: item.title,
        label,
        href,
      });
    }

    for (const [label, href] of Object.entries(item.descriptionLinks ?? {})) {
      candidates.push({
        title: item.title,
        label,
        href,
      });
    }
  }

  for (const repo of pinnedRepos.repos ?? []) {
    candidates.push({
      title: `Pinned repository: ${repo.name}`,
      label: "github",
      href: repo.url,
    });
  }

  const githubCandidates = uniqueBy(
    candidates.filter((candidate) => githubPartsFromUrl(candidate.href)),
    (candidate) => canonicalGithubReadmeKey(candidate.href),
  );

  const sections = [];
  const emittedReadmeKeys = new Set();

  for (const candidate of githubCandidates) {
    if (!isAllowedGithubReadmeUrl(candidate.href)) {
      fetchNotes.push(`Skipped README outside GitHub owner allowlist: ${candidate.href}`);
      continue;
    }

    const readmeKey = canonicalGithubReadmeKey(candidate.href);

    if (emittedReadmeKeys.has(readmeKey)) {
      continue;
    }

    const readme = await fetchReadmeForUrl(candidate.href);

    if (!readme) {
      fetchNotes.push(`Could not fetch README for ${candidate.title} (${candidate.href})`);
      continue;
    }

    emittedReadmeKeys.add(canonicalGithubReadmeKey(readme.baseUrl));

    const visited = new Set(
      [candidate.href, readme.baseUrl, readme.sourceUrl]
        .filter(Boolean)
        .map((url) => canonicalGithubReadmeKey(url)),
    );
    const markdown = await inlineLinkedReadmes(
      normalizeWhitespace(readme.markdown),
      readme.baseUrl,
      visited,
      emittedReadmeKeys,
      0,
    );

    sections.push(
      [
        `## ${candidate.title} / ${candidate.label}`,
        "",
        `Source: ${candidate.href}`,
        "",
        markdown,
      ].join("\n"),
    );
  }

  return sections;
};

const profileMarkdown = (profile) =>
  [
    "# Profile",
    "",
    `Name: ${profile.name}`,
    `Handle: ${profile.handle}`,
    `Title: ${profile.title}`,
    `Location: ${profile.location}`,
    `Timezone: ${profile.timezone}`,
    `Email: ${profile.email}`,
    "",
    "## Summary",
    "",
    profile.summary.map((paragraph) => `- ${paragraph}`).join("\n"),
  ].join("\n");

const socialsMarkdown = (socials) =>
  [
    "# Public links",
    "",
    ...socials.map((social) => `- ${social.label}: ${social.copy ?? social.href}`),
  ].join("\n");

const sharedReferencesMarkdown = (sharedDescriptionLinks) =>
  [
    "# Shared description links",
    "",
    "These links are applied by the website when matching technology/tool names in timeline descriptions.",
    "",
    ...Object.entries(sharedDescriptionLinks).map(([label, href]) => `- ${label}: ${href}`),
  ].join("\n");

const timelineMarkdown = (timeline) => {
  const lines = ["# Portfolio and timeline", ""];

  for (const group of timeline) {
    lines.push(`## ${group.year}`, "");

    for (const item of group.items) {
      lines.push(`### ${item.title}`);
      lines.push("");
      lines.push(`Category: ${item.category}`);
      lines.push(`Dates: ${formatDateRange(item)}`);
      lines.push(`Caption: ${item.caption}`);
      lines.push("");
      lines.push("Details:");
      lines.push(...item.description.map((entry) => `- ${entry}`));

      if (item.links && Object.keys(item.links).length) {
        lines.push("");
        lines.push("Links:");
        lines.push(...Object.entries(item.links).map(([label, href]) => `- ${label}: ${href}`));
      }

      const descriptionLinks = item.descriptionLinks ?? {};

      if (Object.keys(descriptionLinks).length) {
        lines.push("");
        lines.push("Referenced links:");
        lines.push(
          ...Object.entries(descriptionLinks).map(([label, href]) => `- ${label}: ${href}`),
        );
      }

      lines.push("");
    }
  }

  return lines.join("\n").trim();
};

const pinnedReposMarkdown = (pinnedRepos) => {
  const repoSections = (pinnedRepos.repos ?? []).map((repo) =>
    [
      `## ${repo.name}`,
      "",
      `Repository: ${repo.nameWithOwner}`,
      `URL: ${repo.url}`,
      `Description: ${repo.description}`,
      `Primary language: ${repo.language ?? "unknown"}`,
      `Stars: ${repo.stars}`,
      `Forks: ${repo.forks}`,
    ].join("\n"),
  );

  return ["# Pinned repositories", ...repoSections].join("\n\n");
};

const main = async () => {
    const [
      instructions,
      profileSource,
      timelineSource,
      socialsSource,
      pinnedReposSource,
      sharedDescriptionLinksSource,
    ] = await Promise.all([
      readText(instructionsPath),
      readText(profilePath),
      readText(timelinePath),
      readText(socialsPath),
      readText(pinnedReposPath),
      readText(sharedDescriptionLinksPath),
    ]);

  const profile = evaluateConst(profileSource, "PROFILE");
  const timeline = evaluateConst(timelineSource, "TIMELINE");
  const socials = evaluateConst(socialsSource, "SOCIALS");
  const sharedDescriptionLinks = evaluateConst(
    sharedDescriptionLinksSource,
    "SHARED_DESCRIPTION_LINKS",
  );
  const pinnedRepos = JSON.parse(pinnedReposSource);
  const portfolioItems = timeline.flatMap((group) => group.items);
  const readmeSections = await fetchPortfolioReadmes(portfolioItems, pinnedRepos);

  const markdown = [
    "<!-- Generated by scripts/generate-chat-context.mjs. Do not edit by hand. -->",
    "",
    "# polarzero chatbot knowledge",
    "",
    normalizeWhitespace(instructions),
    "",
    profileMarkdown(profile),
    "",
    socialsMarkdown(socials),
    "",
    sharedReferencesMarkdown(sharedDescriptionLinks),
    "",
    pinnedReposMarkdown(pinnedRepos),
    "",
    timelineMarkdown(timeline),
    "",
    "# Fetched README content",
    "",
    readmeSections.length
      ? readmeSections.join("\n\n---\n\n")
      : "No README content could be fetched.",
    "",
    "# Fetch report",
    "",
    fetchNotes.length
      ? fetchNotes.map((note) => `- ${note}`).join("\n")
      : "- All discovered GitHub README fetches completed.",
    "",
  ].join("\n");

  await writeFile(outputPath, `${markdown.trim()}\n`);

  console.log(`Generated ${outputPath}`);
  console.log(`Fetched ${readmeSections.length} README section(s).`);

  if (fetchNotes.length) {
    console.log(`${fetchNotes.length} fetch note(s). See the fetch report in the generated file.`);
  }
};

await main();
