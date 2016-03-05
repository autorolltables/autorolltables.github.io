//  subrolls.js
//
//  Note:
//    percent_to is the percent to roll at all
//    percent_of is the percent of the total to roll

npc_roll = [
  {"title":"Nobleman", "main_rolls":["npcs/d6thelordis", "npcs/d6thelordseekssomeoneto", "npcs/d6thelordcarries", ],"sub_rolls":[],},
  {"title":"Noblewoman", "main_rolls":["npcs/d6theladyis", "npcs/d6theladyseekssomeoneto", "npcs/d4theladycarries", ],"sub_rolls":[],},
  {"title":"Guard", "main_rolls":["npcs/d6theguardserveshisliegefor", "npcs/d6ontheguardsfaceis", "npcs/d4theguardcarries", ],"sub_rolls":[],},
  {"title":"Guard", "main_rolls":["npcs/d6theguardserveshisliegefor", "npcs/d6ontheguardsfaceis", "npcs/d4theguardcarries", ],"sub_rolls":[],},
  {"title":"Guard", "main_rolls":["npcs/d6theguardserveshisliegefor", "npcs/d6ontheguardsfaceis", "npcs/d4theguardcarries", ],"sub_rolls":[],},
  {"title":"Guard", "main_rolls":["npcs/d6theguardserveshisliegefor", "npcs/d6ontheguardsfaceis", "npcs/d4theguardcarries", ],"sub_rolls":[],},
  {"title":"Guard", "main_rolls":["npcs/d6theguardserveshisliegefor", "npcs/d6ontheguardsfaceis", "npcs/d4theguardcarries", ],"sub_rolls":[],},
  {"title":"Guard", "main_rolls":["npcs/d6theguardserveshisliegefor", "npcs/d6ontheguardsfaceis", "npcs/d4theguardcarries", ],"sub_rolls":[],},
  {"title":"Guard", "main_rolls":["npcs/d6theguardserveshisliegefor", "npcs/d6ontheguardsfaceis", "npcs/d4theguardcarries", ],"sub_rolls":[],},
  {"title":"Guard", "main_rolls":["npcs/d6theguardserveshisliegefor", "npcs/d6ontheguardsfaceis", "npcs/d4theguardcarries", ],"sub_rolls":[],},
  {"title":"Guard", "main_rolls":["npcs/d6theguardserveshisliegefor", "npcs/d6ontheguardsfaceis", "npcs/d4theguardcarries", ],"sub_rolls":[],},
  {"title":"Guard", "main_rolls":["npcs/d6theguardserveshisliegefor", "npcs/d6ontheguardsfaceis", "npcs/d4theguardcarries", ],"sub_rolls":[],},
  {"title":"Knight", "main_rolls":["npcs/d6theknightis", "npcs/d6theknighthasswornto", "npcs/d6theknightcarries", ],"sub_rolls":[],},
  {"title":"Knight", "main_rolls":["npcs/d6theknightis", "npcs/d6theknighthasswornto", "npcs/d6theknightcarries", ],"sub_rolls":[],},
  {"title":"Knight", "main_rolls":["npcs/d6theknightis", "npcs/d6theknighthasswornto", "npcs/d6theknightcarries", ],"sub_rolls":[],},
  {"title":"Knight", "main_rolls":["npcs/d6theknightis", "npcs/d6theknighthasswornto", "npcs/d6theknightcarries", ],"sub_rolls":[],},
  {"title":"Knight", "main_rolls":["npcs/d6theknightis", "npcs/d6theknighthasswornto", "npcs/d6theknightcarries", ],"sub_rolls":[],},
  {"title":"Squire/Valet", "main_rolls":["npcs/d6theretaineris", "npcs/d4theretainerhas", "npcs/d6theretainerwantsto", ],"sub_rolls":[],},
  {"title":"Squire/Valet", "main_rolls":["npcs/d6theretaineris", "npcs/d4theretainerhas", "npcs/d6theretainerwantsto", ],"sub_rolls":[],},
  {"title":"Squire/Valet", "main_rolls":["npcs/d6theretaineris", "npcs/d4theretainerhas", "npcs/d6theretainerwantsto", ],"sub_rolls":[],},
  {"title":"Squire/Valet", "main_rolls":["npcs/d6theretaineris", "npcs/d4theretainerhas", "npcs/d6theretainerwantsto", ],"sub_rolls":[],},
  {"title":"Squire/Valet", "main_rolls":["npcs/d6theretaineris", "npcs/d4theretainerhas", "npcs/d6theretainerwantsto", ],"sub_rolls":[],},
  {"title":"Archer", "main_rolls":["npcs/d6thearcheris", "npcs/d4thearcherislookingto", "npcs/d4thearchercarries", ],"sub_rolls":[],},
  {"title":"Archer", "main_rolls":["npcs/d6thearcheris", "npcs/d4thearcherislookingto", "npcs/d4thearchercarries", ],"sub_rolls":[],},
  {"title":"Archer", "main_rolls":["npcs/d6thearcheris", "npcs/d4thearcherislookingto", "npcs/d4thearchercarries", ],"sub_rolls":[],},
  {"title":"Archer", "main_rolls":["npcs/d6thearcheris", "npcs/d4thearcherislookingto", "npcs/d4thearchercarries", ],"sub_rolls":[],},
  {"title":"Archer", "main_rolls":["npcs/d6thearcheris", "npcs/d4thearcherislookingto", "npcs/d4thearchercarries", ],"sub_rolls":[],},
  {"title":"Armorer / Smith", "main_rolls":["npcs/d4thesmithis", "npcs/d4thesmithislookingfor", "npcs/d4thesmithcarries", ],"sub_rolls":[],},
  {"title":"Steward", "main_rolls":["npcs/d4thestewardis", "npcs/d4thestewardseekssomeoneto", "npcs/d4thestewardisconcernedabout", ],"sub_rolls":[],},
  {"title":"Chaplain", "main_rolls":["npcs/d4thechaplainis", "npcs/d4thechaplainislookingfor", "npcs/d4thechaplaincarries", ],"sub_rolls":[],},
  {"title":"Cook", "main_rolls":["npcs/d4thecookgreetsyouwith", "npcs/d4thecookislookingfor", ],"sub_rolls":[],},
  {"title":"Fool/Jester", "main_rolls":["npcs/d6thefoolis", "npcs/d8thefoolgetsthemostlaughsfrom", "npcs/d6thefoolwantsnothingmorethanto", ],"sub_rolls":[],},
  {"title":"Tutor/Sage", "main_rolls":["npcs/d6thetutoris", "npcs/d4thetutorschargesviewhimheras", "npcs/d12thetutorisparticularlywellversedin", ],"sub_rolls":[],},
  {"title":"Tutor/Sage", "main_rolls":["npcs/d6thetutoris", "npcs/d4thetutorschargesviewhimheras", "npcs/d12thetutorisparticularlywellversedin", ],"sub_rolls":[],},
  {"title":"Tutor/Sage", "main_rolls":["npcs/d6thetutoris", "npcs/d4thetutorschargesviewhimheras", "npcs/d12thetutorisparticularlywellversedin", ],"sub_rolls":[],},
  {"title":"Maidservant", "main_rolls":["npcs/d4theservantis", "npcs/d4theservanthas", "npcs/d4theservantwantsto", ],"sub_rolls":[],},
  {"title":"Maidservant", "main_rolls":["npcs/d4theservantis", "npcs/d4theservanthas", "npcs/d4theservantwantsto", ],"sub_rolls":[],},
  {"title":"Maidservant", "main_rolls":["npcs/d4theservantis", "npcs/d4theservanthas", "npcs/d4theservantwantsto", ],"sub_rolls":[],},
  {"title":"Maidservant", "main_rolls":["npcs/d4theservantis", "npcs/d4theservanthas", "npcs/d4theservantwantsto", ],"sub_rolls":[],},
  {"title":"Maidservant", "main_rolls":["npcs/d4theservantis", "npcs/d4theservanthas", "npcs/d4theservantwantsto", ],"sub_rolls":[],},
  {"title":"Guard Captain", "main_rolls":["npcs/d6thecaptainis", "npcs/d4thecaptainisconcernedabout", "npcs/d4thecaptainislookingfor", "npcs/d6thecaptaincarries", ],"sub_rolls":[],},
  {"title":"Horsemaster", "main_rolls":["npcs/d4thehorsemasteris", "npcs/d4thehorsemasterhas", "npcs/d4thehorsemasterwantsto", ],"sub_rolls":[],},
  {"title":"Stable Hand", "main_rolls":["npcs/d4thestablehandis", "npcs/d4thestablehandhas", "npcs/d4thestablehandwantsto", ],"sub_rolls":[],},
  {"title":"Stable Hand", "main_rolls":["npcs/d4thestablehandis", "npcs/d4thestablehandhas", "npcs/d4thestablehandwantsto", ],"sub_rolls":[],},
  {"title":"Stable Hand", "main_rolls":["npcs/d4thestablehandis", "npcs/d4thestablehandhas", "npcs/d4thestablehandwantsto", ],"sub_rolls":[],},
  {"title":"Stable Hand", "main_rolls":["npcs/d4thestablehandis", "npcs/d4thestablehandhas", "npcs/d4thestablehandwantsto", ],"sub_rolls":[],},
  {"title":"Stable Hand", "main_rolls":["npcs/d4thestablehandis", "npcs/d4thestablehandhas", "npcs/d4thestablehandwantsto", ],"sub_rolls":[],},
  {"title":"Huntsman", "main_rolls":["npcs/d6thehuntsmanis", "npcs/d4thehuntsmanisconcernedabout", "npcs/d4thehuntsmanislookingto", "npcs/d4thehuntsmancarries", ],"sub_rolls":[],},
  {"title":"Kennelmaster", "main_rolls":["npcs/d4thekennelmasteris", "npcs/d4thekennelmasterislookingto", "npcs/d4thekennelmastercarries", ],"sub_rolls":[],},
  {"title":"Boyer/Fletcher", "main_rolls":["npcs/d4thebowyeris", "npcs/d4thebowyerislookingfor", "npcs/d4thebowyercarries", ],"sub_rolls":[],},
];

top.subrolls = [

  {"title":"2d6 Castle Rooms", "id":"castle2d6rooms", "roll_type":"amount", "number":"2d6", "percent_to":"100", "percent_of":"100", "rolls":["dungeons/d20roomsthischamberis", "dungeons/d20featuresyounotice",],},
  {"title":"4d6 Amount of d50 Castle Inhabitants", "id":"castle4d6amountofd50inhabitants", "roll_type":"type", "number":"4d6", "percent_to":"100", "percent_of":"100", "roll":npc_roll,},

  {"title":"5d6 Castle Rooms", "id":"castle5d6rooms", "roll_type":"amount", "number":"5d6", "percent_to":"100", "percent_of":"100", "rolls":["dungeons/d20roomsthischamberis", "dungeons/d20featuresyounotice",],},
  {"title":"10d6 Amount of d50 Castle Inhabitants", "id":"castle10d6amountofd50inhabitants", "roll_type":"type", "number":"10d6", "percent_to":"100", "percent_of":"100", "roll":npc_roll,},

  {"title":"8d6 Castle Rooms", "id":"castle8d6rooms", "roll_type":"amount", "number":"8d6", "percent_to":"100", "percent_of":"100", "rolls":["dungeons/d20roomsthischamberis", "dungeons/d20featuresyounotice",],},
  {"title":"16d6 Amount of d50 Castle Inhabitants", "id":"castle16d6amountofd50inhabitants", "roll_type":"type", "number":"16d6", "percent_to":"100", "percent_of":"100", "roll":npc_roll,},

];
