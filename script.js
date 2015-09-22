$(function(){

	createDeck();
	deckShuffle();
	deal();

	var cardEle = function(rank, suit) {
		return '<div class="card" data-rank="' + rank + '" data-suit="' + suit + '">' + rankName(rank) + ' of ' + suitName(suit) + '</div>';
	}

	var suitName = function(suitNum) {
		if (suitNum == 1) { return "Spades"; }
		else if (suitNum == 2) { return "Hearts"; }
		else if (suitNum == 3) { return "Diamonds"; }
		else if (suitNum == 4) { return "Clubs"; }
	}

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
