# hex-map-generator

This tool's goal is to use the original Gary Gygax hex table generator and build it automatically by simulating the rolls and building out a map.  Not a lot of options at this point, only the JS functions to build a completely random (not rule based) working so far.


Source:
[Tables from Gygax](https://www.reddit.com/r/DnDBehindTheScreen/comments/4zqe25/stolen_tables_from_gygax/)


| Biomes       | Plain | Scrub | Forest | Rough | Desert | Hills | Mountains | Marsh |
|--------------|-------|-------|--------|-------|--------|-------|-----------|-------|
| Plain        | 1-11  | 1-3   | 1      | 1-2   | 1-3    | 1     | 1         | 1-2   |
| Scrub        | 12    | 4-11  | 2-4    | 3-4   | 4-5    | 2-3   | 2         | 3-4   |
| Forest*      | 13    | 12-13 | 5-14   | 5     | -      | 4-5   | 3         | 5-6   |
| Rough        | 14    | 14    | 15     | 6-8   | 6-8    | 6-7   | 4-5       | 7     |
| Desert       | 15    | 15    | -      | 9-10  | 9-14   | 8     | 6         | -     |
| Hills**      | 16    | 16    | 16     | 11-15 | 15     | 9-14  | 7-10      | 8     |
| Mountains*** | 17    | 17    | 17     | 16-17 | 16-17  | 15-16 | 11-18     |       |
| Marsh        | 18    | 18    | 18     | 18    | 18     | 17    | -         | 9-15  |
| Pond         | 19    | 19    | 19     | 19    | 19     | 18-19 | 19        | 16-19 |
| Depression   | 20    | 20    | 20     | 20    | 20     | 20    | 20        | 20    |

<a href="http://autorolltables.github.io/hex-map-generator/hex_map_generator.html">
<img src="https://i.imgur.com/T0Z61bp.png">
</a>
