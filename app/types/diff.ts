export type DiffLineType = "context" | "addition" | "deletion" | "header" | "hunk";

export interface DiffLine {
  type: DiffLineType;
  content: string;
  oldLineNumber: number | null;
  newLineNumber: number | null;
}

export interface DiffHunk {
  header: string;
  lines: DiffLine[];
}

export type FileChangeStatus = "modified" | "added" | "deleted" | "renamed";

export interface ParsedDiffFile {
  path: string;
  oldPath?: string;
  status: FileChangeStatus;
  hunks: DiffHunk[];
  additions: number;
  deletions: number;
}

export interface ParsedDiff {
  files: ParsedDiffFile[];
  totalAdditions: number;
  totalDeletions: number;
  modified: ParsedDiffFile[];
  added: ParsedDiffFile[];
  deleted: ParsedDiffFile[];
}
