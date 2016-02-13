var firstTurnSelectedCard = -1;

$(function(){
	createDeck();
	do {
		deckShuffle();
		initialDeal();
		console.log(PFCards[0].rank + " " + PFCards[1].rank + " " + PFCards[2].rank + " " + PFCards[3].rank);
	} while (!containsHighCard(PFCards))

	showCards();
	$('.button').hide();
	$('#stage').hide();

	$(".card").click(function(event) {
	    console.log($(event.target).data());
		if ($(event.target).parent('#hand').length) {
			$('#hand .selected').removeClass("selected");
			$(event.target).addClass("selected");
		} else {
			$(event.target).toggleClass("selected");
		}
		if (firstTurnSelectedCard < 0) {
			// and if first turn
			if (PFCards[$(event.target).data().index].rank >= 9) {
				$('#selectBtn').show();
			} else {
				$('#selectBtn').hide();
			}
		} else {
			if ($('#hand .selected')) {
				$('#pileBtn').show();
				$('#pickBtn').show();
			} else {
				$('#pileBtn').hide();
				$('#pickBtn').hide();
			}
		}
	});

	$('#selectBtn').click(function(event) {
		// Check if a card is selected
		if (! $('#hand .selected') || PFCards[$('#hand .selected').data().index].rank < 9) {
			console.log('ERROR');
		} else {
			firstTurnSelectedCard = $('#hand .selected').data().index;
			$('#stage').show();
			$('#hand .selected').removeClass("selected");
			$('#selectBtn').hide();
			console.log(firstTurnSelectedCard);
		}
	});
	//If is high card, show stage cards,
	//Then continue like normal level play

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

function makePile() {
	console.log("selected piles: " + selectedPiles());
	console.log("first selected target index: " + firstTurnSelectedCard);
	// if first turn
	console.log(firstTurn($($('#hand .selected')).data().index, firstTurnSelectedCard, selectedPiles(), false));
}

function pickUpPile() {
	console.log(selectedPiles());
	if (firstTurn($($('#hand .selected')).data().index, firstTurnSelectedCard, selectedPiles(), true)) {
		console.log("it worked");
		showCards();
	} else {
		console.log("it didn't work");
		alert('something went wrong. try again');
	}
}

var selectedPiles = function() {
	var arrOfCards = [];
	for (var i = 0; i < $('#stage .selected').length; i++) {
		arrOfCards[i] = $($('#stage .selected')[i]).data().index;
	}
	return arrOfCards;
}

