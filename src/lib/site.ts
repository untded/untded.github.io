// Site configuration SSOT: every URL that leaves this codebase is
// declared here once. Hostnames are never hardcoded at call sites, and
// internal routes go through href() so the build respects `base`
// (root and sub-path deployments are different — never assume '/').

export const BASE: string = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')

/** Build a base-aware internal URL. Pass root-relative paths: href('/elements'). */
export function href(path: string): string {
  return `${BASE}/${path.replace(/^\//, '')}`
}

export const GITHUB_ORG_URL = 'https://github.com/untded'
export const DATASET_REPO_URL = `${GITHUB_ORG_URL}/untded-2005`
export const REFERENCES_REPO_URL = `${GITHUB_ORG_URL}/references`
export const DATASET_FILE_BASE = `${DATASET_REPO_URL}/blob/main/data/elements`
export const DATASET_RELEASES_URL = `${DATASET_REPO_URL}/releases`
export const UNECE_UNCEFACT_URL = 'https://unece.org/trade/uncefact'
export const ISO_TC154_URL = 'https://www.isotc154.org'
