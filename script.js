$(function(){

	createDeck();
	do {
		deckShuffle();
		deal();
		console.log(PFCards[0].rank + " " + PFCards[1].rank + " " + PFCards[2].rank + " " + PFCards[3].rank);
	} while (!containsHighCard())

	var cardEle = function(rank, suit) {
		return '<div class="card ' + suitName[suit] + '" data-rank="' + rank + '" data-suit="' + suit + '">' + rankName(rank) + ' ' + suitFigure[suit] + '</div>';
	}

	var suitName = [null, "spades", "hearts", "diamonds", "clubs"];
	var suitFigure = [null, "&spades;", "&hearts;", "&diams;", "&clubs;"];

	var rankName = function(rankVal) {
		if (rankVal == 1) { return "A"; }
		else if (rankVal == 11) { return "J"; }
		else if (rankVal == 12) { return "Q"; }
		else if (rankVal == 13) { return "K"; }
		else { return rankVal; }
	}

	for (var i = 0; i < stagePiles.length; i++) {
		if (stagePiles[i].cards.length == 1) {
			$('#stage').append(cardEle(stagePiles[i].cards[0].rank, stagePiles[i].cards[0].suit));
		}
	}
	for (var i = 0; i < 12; i++) {
		$('#hand').append(cardEle(PFCards[i].rank, PFCards[i].suit));
	}

	$(".card").click(function(event) {
	    console.log($(event.target).data());
	});
})
