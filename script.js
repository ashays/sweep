var firstTurnSelectedCard = -1;

$(document).ready(function() {
	createDeck();
	do {
		deckShuffle();
		initialDeal();
		console.log(PFCards[0].rank + " " + PFCards[1].rank + " " + PFCards[2].rank + " " + PFCards[3].rank);
	} while (!containsHighCard(PFCards))

	showCards();
	$('.button').hide();
	$('#stage').addClass('hidden');

	$('#selectBtn').click(function(event) {
		// Check if a card is selected
		if (! $('#hand .selected') || PFCards[$('#hand .selected').data().index].rank < 9) {
			console.log('ERROR');
		} else {
			firstTurnSelectedCard = $('#hand .selected').data().index;
			$('#stage').removeClass('hidden');
			$('#hand .selected').removeClass("selected");
			$('#selectBtn').hide();
			console.log(firstTurnSelectedCard);
		}
	});
	//If is high card, show stage cards,
	//Then continue like normal level play

})

var cardEle = function(rank, suit, index) {
	return '<div class="card ' + suitName[suit] + '" data-index="' + index + '" onclick="clickCard(event)">' + rankName(rank) + ' ' + suitFigure[suit] + '</div>';
}

var pileEle = function(rank, index) {
	return '<div class="card" data-index="' + index + '" onclick="clickCard(event)">' + rankName(rank) + '</div>';
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
	console.log("Player " + turn % 2 + "'s turn");
	$('#stage').empty();
	for (var i = 0; i < stagePiles.length; i++) {
		if (stagePiles[i].cards.length == 1) {
			$('#stage').append(cardEle(stagePiles[i].cards[0].rank, stagePiles[i].cards[0].suit, i));
		} else {
			$('#stage').append(pileEle(stagePiles[i].rankValue, i));
		}
	}
	$('#hand').empty();
	if (turn % 2 == 1) {
		// Player 1's turn
		for (var i = 0; i < PFCards.length; i++) {
			$('#hand').append(cardEle(PFCards[i].rank, PFCards[i].suit, i));
		}
	} else {
		for (var i = 0; i < PSCards.length; i++) {
			$('#hand').append(cardEle(PSCards[i].rank, PSCards[i].suit, i));
		}
	}
}

function submitMove(pickUpPileBool) {
	// console.log("selected piles: " + selectedPiles());
	// console.log("first selected target index: " + firstTurnSelectedCard);
	if (turn == 1) {
		if (firstTurn($($('#hand .selected')).data().index, firstTurnSelectedCard, selectedPiles(), pickUpPileBool)) {
			console.log("it worked");
			$('.selected').removeClass("selected");
			$('.button').hide();
			showCards();
		} else {
			console.log("it didn't work");
			alert('something went wrong. try again');
		}		
	} else {
		if (anyTurn($($('#hand .selected')).data().index, selectedPiles(), pickUpPileBool)) {
			console.log("it worked");
			$('.selected').removeClass("selected");
			$('.button').hide();
			showCards();
		} else {
			console.log("it didn't work");
			alert('something went wrong. try again');
		}
	}
}

function clickCard(event) {
    console.log($(event.target).data());
	if ($(event.target).parent('#hand').length) {
		$('#hand .selected').removeClass("selected");
		$(event.target).addClass("selected");

	} else {
		$(event.target).toggleClass("selected");
	}
	if (turn == 1 && firstTurnSelectedCard < 0) {
		if (! $(event.target).parent('#hand').length) {
			$('.selected').removeClass("selected");
		} else if (PFCards[$(event.target).data().index].rank >= 9) {
			$('#selectBtn').show();
		} else {
			$('#selectBtn').hide();
		}
	} else if ($('#hand .selected').length) {
		$('#pileBtn').show();
		if ($('#stage .selected').length) {
			$('#pickBtn').show();
		} else {
			$('#pickBtn').hide();
		}
	}
}

var selectedPiles = function() {
	var arrOfCards = [];
	for (var i = 0; i < $('#stage .selected').length; i++) {
		arrOfCards[i] = $($('#stage .selected')[i]).data().index;
	}
	return arrOfCards;
}

