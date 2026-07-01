import type { DiffHunk, DiffLine, FileChangeStatus, ParsedDiff, ParsedDiffFile } from "@/app/types/diff";

function parseHunkHeader(header: string): { oldStart: number; newStart: number } {
  const match = header.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
  return {
    oldStart: match ? parseInt(match[1], 10) : 1,
    newStart: match ? parseInt(match[2], 10) : 1,
  };
}

function parseHunk(header: string, lines: string[]): DiffHunk {
  const { oldStart, newStart } = parseHunkHeader(header);
  let oldLine = oldStart;
  let newLine = newStart;
  const diffLines: DiffLine[] = [];

  for (const line of lines) {
    if (line.startsWith("+")) {
      diffLines.push({
        type: "addition",
        content: line.slice(1),
        oldLineNumber: null,
        newLineNumber: newLine++,
      });
    } else if (line.startsWith("-")) {
      diffLines.push({
        type: "deletion",
        content: line.slice(1),
        oldLineNumber: oldLine++,
        newLineNumber: null,
      });
    } else if (line.startsWith(" ")) {
      diffLines.push({
        type: "context",
        content: line.slice(1),
        oldLineNumber: oldLine++,
        newLineNumber: newLine++,
      });
    } else if (line.startsWith("\\")) {
      diffLines.push({
        type: "context",
        content: line,
        oldLineNumber: null,
        newLineNumber: null,
      });
    }
  }

  return { header, lines: diffLines };
}

function inferFileStatus(oldPath: string | undefined, newPath: string, isNew: boolean, isDeleted: boolean): FileChangeStatus {
  if (isNew) return "added";
  if (isDeleted) return "deleted";
  if (oldPath && oldPath !== newPath) return "renamed";
  return "modified";
}

export function parseUnifiedDiff(patch: string): ParsedDiff {
  if (!patch.trim()) {
    return { files: [], totalAdditions: 0, totalDeletions: 0, modified: [], added: [], deleted: [] };
  }

  const rawFiles = patch.split(/^diff --git /m).filter(Boolean);
  const files: ParsedDiffFile[] = [];

  for (const raw of rawFiles) {
    const lines = raw.split("\n");
    const firstLine = lines[0] ?? "";
    const pathMatch = firstLine.match(/a\/(.+?) b\/(.+)/);
    const oldPath = pathMatch?.[1];
    const newPath = pathMatch?.[2] ?? firstLine.trim();

    let isNew = false;
    let isDeleted = false;
    const hunks: DiffHunk[] = [];
    let additions = 0;
    let deletions = 0;

    let i = 1;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("new file mode")) isNew = true;
      if (line.startsWith("deleted file mode")) isDeleted = true;
      if (line.startsWith("@@")) {
        const hunkHeader = line;
        const hunkLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("@@") && !lines[i].startsWith("diff --git")) {
          hunkLines.push(lines[i]);
          if (lines[i].startsWith("+") && !lines[i].startsWith("+++")) additions++;
          if (lines[i].startsWith("-") && !lines[i].startsWith("---")) deletions++;
          i++;
        }
        hunks.push(parseHunk(hunkHeader, hunkLines));
        continue;
      }
      i++;
    }

    const status = inferFileStatus(oldPath, newPath, isNew, isDeleted);
    files.push({ path: newPath, oldPath, status, hunks, additions, deletions });
  }

  const modified = files.filter((f) => f.status === "modified" || f.status === "renamed");
  const added = files.filter((f) => f.status === "added");
  const deleted = files.filter((f) => f.status === "deleted");

  return {
    files,
    totalAdditions: files.reduce((s, f) => s + f.additions, 0),
    totalDeletions: files.reduce((s, f) => s + f.deletions, 0),
    modified,
    added,
    deleted,
  };
}

export function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    py: "python",
    json: "json",
    md: "markdown",
    css: "css",
    scss: "scss",
    html: "html",
    yaml: "yaml",
    yml: "yaml",
    sql: "sql",
    sh: "bash",
    go: "go",
    rs: "rust",
    java: "java",
    rb: "ruby",
    toml: "toml",
    dockerfile: "docker",
  };
  if (path.endsWith("Dockerfile")) return "docker";
  return map[ext] ?? "text";
}
