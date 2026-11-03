# TRACE — particle anatomy sources

The visible figure, skeleton, lungs, heart and vessels are rendered entirely as particles.
No skin surface, solid organ mesh or photographic human is drawn. A hidden rig is used
only to place and deform the particles. Fingers are procedurally animated, not tracked.

## Human particle scaffold — CC0

MakeHuman hm08 base mesh, default skeleton and default skin weights:
https://github.com/makehumancommunity/makehuman/tree/master/makehuman/data
https://raw.githubusercontent.com/makehumancommunity/makehuman/master/makehuman/data/3dobjs/base.obj
https://raw.githubusercontent.com/makehumancommunity/makehuman/master/makehuman/data/rigs/default.mhskel
https://raw.githubusercontent.com/makehumancommunity/makehuman/master/makehuman/data/rigs/default_weights.mhw

The OBJ explicitly declares CC0; skeleton and weights declare CC0 in their JSON metadata.
Source OBJ SHA-256: 8e761e6624b8f54536409135d1636da63b32486a90d4897f84e121d144f6fb4c
13,380 surface vertices, 163 bones. The generated human-rig.json retains normalized
positions and four strongest normalized skin weights per vertex. Surface point weights
are interpolated from the sampled triangle. 82% use the current skeleton; 18% use
historical skeleton matrices with controlled scatter.
License: MAKEHUMAN_LICENSE.md in this directory.

## Anatomical references

OpenStax Anatomy and Physiology:
https://openstax.org/books/anatomy-and-physiology/pages/7-1-divisions-of-the-skeletal-system
https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy
https://openstax.org/books/anatomy-and-physiology-2e/pages/22-2-the-lungs

These references informed the placement and simplified shape of the rib cage, spine,
pelvis, heart, asymmetric lungs, trachea, bronchi and major vessels. Internal geometry
is original procedural artwork sampled into particles. It is not a medical simulation.
No OpenStax illustrations or Z-Anatomy model assets were copied into the app.

## Runtime

Three.js — MIT. License: three/LICENSE.txt.
https://threejs.org/docs/pages/SkinnedMesh.html
https://threejs.org/docs/pages/MeshSurfaceSampler.html
MediaPipe Pose Landmarker — bundled runtime/model, previously included license.
https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js

## Loop behavior

https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop
https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event

Uses native HTMLMediaElement.loop. The performance clock and pose history continue
across loop boundaries. Explicit user seeks clear spectral transients without resetting
the performance phase. Loop preferences are stored locally; music stays in the browser.
