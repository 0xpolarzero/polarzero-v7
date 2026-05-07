import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const login = process.env.GITHUB_LOGIN ?? "0xpolarzero";
const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
const outputPath = fileURLToPath(new URL("../src/data/pinned-repos.json", import.meta.url));

if (!token) {
  throw new Error("Missing GITHUB_TOKEN or GH_TOKEN.");
}

const query = `
  query PinnedRepos($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            nameWithOwner
            url
            description
            primaryLanguage {
              name
              color
            }
            stargazerCount
            forkCount
          }
        }
      }
    }
  }
`;

const response = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "User-Agent": "polarzero-v7",
  },
  body: JSON.stringify({ query, variables: { login } }),
});

if (!response.ok) {
  throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
}

const payload = await response.json();

if (payload.errors?.length) {
  throw new Error(payload.errors.map((error) => error.message).join("\n"));
}

const repos = payload.data.user.pinnedItems.nodes.map((repo) => ({
  name: repo.name,
  nameWithOwner: repo.nameWithOwner,
  url: repo.url,
  description: repo.description ?? "",
  language: repo.primaryLanguage?.name ?? null,
  languageColor: repo.primaryLanguage?.color ?? null,
  stars: repo.stargazerCount,
  forks: repo.forkCount,
}));

const data = { repos };

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`);

console.log(`Updated ${repos.length} pinned repos for ${login}.`);
