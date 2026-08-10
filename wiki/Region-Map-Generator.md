# Region Map Generator

Generates a whole region: coastlines, rivers, mountains, cities, borders and
place names.

**[Open the generator](https://autorolltables.github.io/region-map-generator/index.html)**

Built on Martin O'Leary's [terrain generator](https://mewo2.com/notes/terrain/),
using d3.

## How it generates

It builds a height field over an irregular mesh of points, erodes it to cut
valleys and river courses, works out where water flows and pools, then places
cities where the terrain suits them and draws territory borders around them.
Place names are generated from a made-up language rather than picked from a list,
so no two maps share names.

Because it is doing real simulation rather than stamping tiles, a map takes a
moment to appear.

## Controls

- **Generate** produces a completely new region.
- **Export SVG** downloads the map as vector art, which stays sharp at any size
  and can be opened in Illustrator, Inkscape or Affinity.
- **Export PNG** downloads it as an image.

Exports carry their own colours and background, so the file looks the same
wherever you open it rather than depending on the page's stylesheet.

Filenames include the date and time, so repeated exports do not overwrite each
other.

## Notes

- The map fits the window it was generated in. If you resize, generate again.
- Labels are placed to avoid collisions, so a dense region takes slightly longer
  than a sparse one.
