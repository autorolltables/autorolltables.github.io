# auto-roll-tables

developed by dangeratio

roll tables content by OrkishBlade

<a href="http://autorolltables.github.io/">
<img src="https://i.imgur.com/tGEZtHv.png">
</a>

# data table structure

Here is the structure used in table.js if you want to make your own tables in a fork or anything:

## menu - js/menu.js

```
menu_title
menu_id
items []
	item
		item_title
		item_use
		item_main_rolls []
			roll_id
			roll_id
			roll_id
		item_sub_rolls []
			roll_id
			roll_id
			roll_id
```

## rolls - js/rolls.js
```
roll_title
roll_id
roll []
	roll_value
	roll_value
	roll_value
```
