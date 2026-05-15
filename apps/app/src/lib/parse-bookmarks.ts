/**
 * parseBookmarks.ts
 * Parses a Netscape Bookmark HTML file (exported from Chrome, Firefox, Safari, Edge)
 * using the browser's built-in DOMParser. No dependencies required.
 */

export interface Bookmark {
  title: string;
  url: string;
  folder: string | null;
  addDate: Date | null;
  icon: string | null;
}

export interface BookmarkFolder {
  name: string;
  bookmarks: Bookmark[];
  subfolders: BookmarkFolder[];
}

export interface ParseResult {
  bookmarks: Bookmark[];
  tree: BookmarkFolder[];
  total: number;
}

/**
 * Reads an HTML File object from an <input type="file"> and parses it.
 *
 * @example
 * const input = document.querySelector('input[type="file"]');
 * input.addEventListener('change', async (e) => {
 *   const result = await parseBookmarkFile(e.target.files[0]);
 *   console.log(result.bookmarks);
 * });
 */
export async function parseBookmarkFile(file: File): Promise<ParseResult> {
  if (!file || file.type !== "text/html") {
    throw new Error("Invalid file. Please upload a valid HTML bookmarks file.");
  }

  const html = await file.text();
  return parseBookmarkHTML(html);
}

/**
 * Parses a raw HTML string from a Netscape Bookmark file.
 *
 * @example
 * const html = await fetch('/bookmarks.html').then(r => r.text());
 * const { bookmarks, tree, total } = parseBookmarkHTML(html);
 */
export function parseBookmarkHTML(html: string): ParseResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const bookmarks = extractFlatBookmarks(doc);
  const tree = extractBookmarkTree(doc);

  return {
    bookmarks,
    tree,
    total: bookmarks.length,
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function extractFlatBookmarks(doc: Document): Bookmark[] {
  const anchors = Array.from(doc.querySelectorAll("a"));

  return anchors
    .filter((a) => a.getAttribute("href") && a.getAttribute("href") !== "about:blank")
    .map((a) => ({
      title: a.textContent?.trim() || a.getAttribute("href") || "",
      url: a.getAttribute("href") as string,
      folder: getParentFolderName(a),
      addDate: parseTimestamp(a.getAttribute("add_date")),
      icon: a.getAttribute("icon") ?? null,
    }));
}

function extractBookmarkTree(doc: Document): BookmarkFolder[] {
  const rootDL = doc.querySelector("dl");
  if (!rootDL) return [];

  return parseDL(rootDL);
}

function parseDL(dl: Element, folderName = "Root"): BookmarkFolder[] {
  const result: BookmarkFolder = {
    name: folderName,
    bookmarks: [],
    subfolders: [],
  };

  const children = Array.from(dl.children);

  for (const dt of children) {
    const anchor = dt.querySelector<HTMLAnchorElement>(":scope > a");
    const header = dt.querySelector<HTMLElement>(":scope > h3");
    const nestedDL = dt.querySelector(":scope > dl");

    if (anchor) {
      result.bookmarks.push({
        title: anchor.textContent?.trim() || anchor.getAttribute("href") || "",
        url: anchor.getAttribute("href") as string,
        folder: folderName,
        addDate: parseTimestamp(anchor.getAttribute("add_date")),
        icon: anchor.getAttribute("icon") ?? null,
      });
    } else if (header && nestedDL) {
      const subfolder = parseDL(nestedDL, header.textContent?.trim() ?? "Unnamed Folder");
      result.subfolders.push(...subfolder);
    }
  }

  return [result];
}

function getParentFolderName(anchor: Element): string | null {
  let el: Element | null = anchor.parentElement;

  while (el) {
    if (el.tagName === "DL") {
      const prev = el.previousElementSibling;
      if (prev?.tagName === "H3") {
        return prev.textContent?.trim() ?? null;
      }
    }
    el = el.parentElement;
  }

  return null;
}

function parseTimestamp(timestamp: string | null): Date | null {
  if (!timestamp) return null;
  const ms = parseInt(timestamp, 10) * 1000;
  const date = new Date(ms);
  return isNaN(date.getTime()) ? null : date;
}

export function getAllFolderNames(tree: BookmarkFolder[]): string[] {
  const names: string[] = [];
  function walk(folders: BookmarkFolder[]) {
    for (const f of folders) {
      names.push(f.name);
      walk(f.subfolders);
    }
  }
  walk(tree);
  return names;
}

export function groupBookmarksByFolder(tree: BookmarkFolder[]): Record<string, Bookmark[]> {
  const groups: Record<string, Bookmark[]> = {}

  function walk(folders: BookmarkFolder[]) {
    for (const folder of folders) {
      if (folder.bookmarks.length > 0) {
        groups[folder.name] = folder.bookmarks
      }
      walk(folder.subfolders)
    }
  }

  walk(tree)
  return groups
}