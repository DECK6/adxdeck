# Week 4 publication

Page: `ontology/study/week4.html`. Static HTML/CSS/ES module, no backend or model calls.
The public experiment is an allowlisted copy of the already frozen 48 + 36 subscription runs. Original evidence remains in the separate species project. It is not rerun by these scripts.

```sh
python3 scripts/gpters24/package-week4.py /absolute/path/to/species-ontology-demo
python3 scripts/gpters24/package-week4-kit.py
python3 tests/week4-release.test.py
bun build scripts/gpters24/app.mjs --outfile ontology/study/assets/app.js --minify
```

The source species directory must contain the completed reports, public records, read-only retrieval code and graph artifacts. The small authored RDF/OWL files are under `downloads/week4/`; validate Turtle/RDF-XML graph equality with RDFLib when changing them.

ZIPs remain local and gitignored. All four ZIP download buttons point to observed Google Drive file URLs, recorded with hashes in `downloads/week4/manifest.json`. After changing a package, update the corresponding Drive file, read back its metadata, check anonymous access, and update the recorded URL/hash. Package regeneration retains a Drive URL only when the bytes still match the old hash. The AKM package is a pinned public-repository archive, with revision in `akm-package.json`.

Do not publish CLI event/stderr logs, machine invocations or thread IDs. `export-manifest.json` records original and exported run JSON hashes. Answers, retrieval traces, usage and scoring fields remain intact.

Browser acceptance: six compound-loop steps, three host prompt prefixes, clipboard fallback, operating-card download, graph lazy load/search/question selection, 390px and desktop no-overflow, Drive downloads, experiment report interactions. Check both ZIP integrity and 62,604 record counts locally before upload. Ensure the six large-question counts and time medians match the frozen run JSON.

The `#growth` section teaches directional, broad and repeated expansion. Its nine total execution prompts are extracted into the kit. `growth-guide.md` and `coverage-map.md` are authored files included unchanged in the ZIP; the generator owns the other operating templates. Keep the scope, priority and growth fields in the operating-card form and Markdown export aligned. Verify the Drive kit is replaced and read back after regeneration, then restore its observed URL in the manifest.

Link audits distinguish links requiring a local machine from instructions for an optional offline copy. The October 20 follow-up checked 54 HTML pages and 159 public assets: all returned HTTP 200. The only loopback addresses were explicitly offline instructions in the week 2 and noosphere downloadable READMEs; both already give their public page URL first.

Publish only the scoped lesson/resources to main using the existing GitHub Pages workflow. Do not run the broad `build.mjs` merely to update navigation; it regenerates historical bundles and the full offline site ZIP.
