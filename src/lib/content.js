// Local content layer — replaces the hosted backend this site used to query.
//
// All site content lives in src/content/*.json. These files are imported at
// build time, so there is no network request, no loading state, and no server.
// Edit a JSON file, save, and the dev server hot-reloads.
//
// A malformed JSON file is caught by Vite at build/dev time with a parse error
// naming the file and line. The guards below handle the other failure mode:
// valid JSON of the wrong *shape* (an object where a list belongs, a missing
// field), which would otherwise crash a component mid-render.

import profileData from "@/content/profile.json";
import projectsData from "@/content/projects.json";
import documentsData from "@/content/documents.json";
import linksData from "@/content/links.json";
import statementData from "@/content/statement.json";

/** Content files describing a list must parse to an array. */
function asList(value, filename) {
  if (Array.isArray(value)) return value;
  console.error(
    `[content] src/content/${filename} must contain a list wrapped in [ ... ]. ` +
      `Got ${value === null ? "null" : typeof value}. Rendering an empty list instead.`
  );
  return [];
}

/** Entries are hidden by setting "is_published": false; absent means published. */
const isPublished = (entry) => entry && entry.is_published !== false;

/** Lower sort_order first; entries without one fall to the end in file order. */
const bySortOrder = (a, b) =>
  (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER);

function publishedSorted(value, filename) {
  return asList(value, filename).filter(isPublished).sort(bySortOrder);
}

/**
 * The single profile record. Returns an object even when profile.json is
 * malformed, so components can rely on optional chaining rather than a guard.
 */
export function getProfile() {
  if (profileData && typeof profileData === "object" && !Array.isArray(profileData)) {
    return profileData;
  }
  console.error(
    "[content] src/content/profile.json must contain a single object wrapped in { ... }."
  );
  return {};
}

export function getProjects() {
  return publishedSorted(projectsData, "projects.json");
}

/** A single project by its "id" field, or null when nothing matches. */
export function getProject(id) {
  return getProjects().find((project) => project.id === id) ?? null;
}

export function getDocuments() {
  return publishedSorted(documentsData, "documents.json");
}

/** A single document by its "id" field, or null when nothing matches. */
export function getDocument(id) {
  return getDocuments().find((document) => document.id === id) ?? null;
}

export function getLinks() {
  return publishedSorted(linksData, "links.json");
}

/**
 * The statement of purpose. Its three sections are required by the
 * assignment, so a missing `sections` array is a content error worth
 * surfacing rather than rendering an empty page over.
 */
export function getStatement() {
  const statement =
    statementData && typeof statementData === "object" && !Array.isArray(statementData)
      ? statementData
      : {};

  if (!statement.title) {
    console.error("[content] src/content/statement.json is missing a \"title\".");
  }

  return {
    ...statement,
    sections: asList(statement.sections ?? [], "statement.json (sections)"),
  };
}
