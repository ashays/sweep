var deck = [];

for (i = 1; i <= 4; i++) {
	for (j = 1; j <= 13; j++) {
		var card = {rank: j, suit: i};
		deck[13 * (i - 1) + j - 1] = card;		
	}
}


function deckShuffle()    {             
    for (var i = 0; i < 52; i++)    {
        var randomInt = Math.floor(Math.random() * 52);
        var temp = deck[i];
        deck[i] = deck[randomInt];
        deck[randomInt] = temp;
        //deck.set(i, deck.get(randomInt));
        //deck.set(randomInt, temp);
    }
}
