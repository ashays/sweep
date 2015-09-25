$(function(){

	createDeck();
	do {
		deckShuffle();
		initialDeal();
		console.log(PFCards[0].rank + " " + PFCards[1].rank + " " + PFCards[2].rank + " " + PFCards[3].rank);
	} while (!containsHighCard(PFCards))

	showCards();
	$('#stage').hide();
	//After select, check if isHighCard
	//If is high card, show stage cards,
	//Then continue like normal level play

	$(".card").click(function(event) {
	    console.log($(event.target).data());
		if ($(event.target).parent('#hand').length) {
			$('#hand .selected').removeClass("selected");
			$(event.target).addClass("selected");
		} else {
			$(event.target).toggleClass("selected");
		}
	});

	$('#selectBtn').click(function(event) {
		turn($($('#hand .selected')).data().index, selectedPiles());
	});
})

var cardEle = function(rank, suit, index) {
	return '<div class="card ' + suitName[suit] + '" data-index="' + index + '">' + rankName(rank) + ' ' + suitFigure[suit] + '</div>';
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

function showCards() {
	$('#stage').empty();
	for (var i = 0; i < stagePiles.length; i++) {
		if (stagePiles[i].cards.length == 1) {
			$('#stage').append(cardEle(stagePiles[i].cards[0].rank, stagePiles[i].cards[0].suit, i));
		}
	}
	$('#hand').empty();
	for (var i = 0; i < PFCards.length; i++) {
		$('#hand').append(cardEle(PFCards[i].rank, PFCards[i].suit, i));
	}
}

var selectedPiles = function() {
	var arrOfCards = [];
	for (var i = 0; i < $('#stage .selected').length; i++) {
		arrOfCards[i] = $($('#stage .selected')[i]).data().index;
	}
	return arrOfCards;
}

