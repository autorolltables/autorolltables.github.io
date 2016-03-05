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
item
	main_rolls []
		js/roll_id
		js/roll_id
		js/roll_id
	sub_rolls []
		js/roll_id
		js/roll_id
		js/roll_id
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
