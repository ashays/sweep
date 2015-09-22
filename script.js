var deck = [];

for (i = 1; i <= 4; i++) {
	for (j = 1; j <= 13; j++) {
		var card = {rank: j, suit: i};
		deck[13 * (i - 1) + j - 1] = card;		
	}
}

