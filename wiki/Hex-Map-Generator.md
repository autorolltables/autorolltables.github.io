# Hex Map Generator

Builds a wilderness hex map by simulating the terrain tables from Appendix B of
the 1st edition *Dungeon Masters Guide* (p.173).

**[Open the generator](https://autorolltables.github.io/hex-map-generator/hex_map_generator.html)**

## How it generates

It starts from a single tile in the middle of the board and works outwards. Each
new tile is rolled from the terrain of a tile next to it, using a d20 against
that terrain's column. Forest tends to beget forest, mountains give way to hills,
and so on, which is what makes the result read as a landscape rather than noise.

Water and Valley are ignored when rolling the next tile, exactly as the original
tables specify, so a pond does not reset the terrain around it.

The generator renames three of the original terrains: Scrub is **Brush**, Pond is
**Water**, and Depression is **Valley**.

## Controls

**Tile labels** switches what is drawn on each tile:

- **Description** writes the terrain name.
- **Image** draws a symbol for the terrain instead. Useful at the smaller sizes
  where names get cramped.

**Map size** sets how many tiles fit. The names describe the map, so a larger map
means smaller hexes:

| Size | Hex radius | Roughly |
|---|---|---|
| Small | 100 | a couple of dozen tiles |
| Medium | 60 | around 50 tiles |
| Large | 30 | a few hundred tiles |
| Extra Large | 19 | around 900 tiles at desktop width |

The exact count depends on your window, since the grid fills whatever space the
canvas has.

**Generate** rolls a fresh map at the current size. **Save** downloads the map as
a PNG, with the date and time in the filename. The **?** button opens the terrain
key, which also explains the source tables.

## Notes

- The size is carried in the URL (`?s=m`), so a particular size can be
  bookmarked or shared.
- Generating measures the canvas first, so resizing the window or collapsing the
  sidebar and pressing Generate refits the map.
- Whole tiles only: the grid is centred with a margin, so nothing is clipped at
  the edges.
