# memory-puzzle
### a small game created using React JS and Node Js with Mongodb 
#### the game simply contain pictures hidden for the player and he got to find the dublicated pictures and score some points
#### the player got 2 minutes for each turn
#### if the player discovered more than half of the total number of pictures his score points will increased by an equation i made
#### then when the game is done by finding all the pictures or the 2 minutes ended then if the player was new player his score will be saved to the database - the score to be saved should not be zero-
#### if the player is already saved before then his new score will be compared to his last score saved in the database and just if the new score is higher than the old score then the new score will replace the old score
#### the scores will be showed in the right bar everytime a player plays the game - i used socket io to update everytime a player saved to the database-
#### the right bar will contain all the players's scores ordered by highest to lowest score and updated with every change happen in the data base
#### the game need authentication with your facebook account to be able to play it
