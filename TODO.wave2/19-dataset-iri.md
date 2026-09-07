# 19 — Dereference the dataset IRI

Eighth pass (2026-09-07). Found by checking the homepage's structured
data: the schema.org Dataset node's `@id` —
`https://www.untded.org/dataset/untded-2005` — is a **404**, on the
homepage JSON-LD and three times in the RDF graph (the Dataset node and
its DataDownload links). The graph points at nothing.

## Tasks

- [x] `/dataset/untded-2005` — a small canonical landing page for the
      dataset IRI: what it identifies (UNTDED 2005 = ISO 7372:2005,
      ECE/TRADE/362), the mandate line, downloads (machine artifacts +
      repo), attribution. Plain card language; no new visual ideas.
- [x] The graph and homepage keep their IRI — the page now makes it
      dereferenceable (the Linked Data-correct fix, vs. renaming the
      IRI to /download).
- [x] Contract: the route builds; homepage JSON-LD's dataset `@id`
      resolves (200); the page links /download and /about.

## Verification

Build + tests + links; live check after deploy.

## Beats

A registry whose dataset IRI 404s undercuts its own Linked Data story;
theirs has no dataset IRI at all. Ours now resolves to a citable page.
