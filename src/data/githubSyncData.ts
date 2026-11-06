import raw from "./github-sync.json";
import { parseSyncFile, type GithubSyncFile } from "@/lib/githubSync";

export const githubSync: GithubSyncFile = parseSyncFile(raw);
