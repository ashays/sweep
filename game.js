var deck = [];
var PFCards = [];
var PSCards = [];
var stagePiles = [];
var tempStage = [];
var topCard = 0;

function getStagePiles() {
	return stagePiles;
}

function geDeck() {
	return deck;
}

function getPFCards() {
	return PFCards;
}

function getPSCards() {
	return PSCards;
}

function createDeck() {
	for (i = 1; i <= 4; i++) {
		for (j = 1; j <= 13; j++) {
			var card = {rank: j, suit: i};
			deck[13 * (i - 1) + j - 1] = card;		
		}
	}
}


function deckShuffle()    {             
    for (var i = 0; i < 52; i++)    {
        var randomInt = Math.floor(Math.random() * 52);
        var temp = deck[i];
        deck[i] = deck[randomInt];
        deck[randomInt] = temp;
    }
}

function initialDeal() {
	for (i = 0; i < 4; i++) {
		var cardsInPile = [deck[i]];
		var pile = {locked : false, value: deck[i].rank, cards: cardsInPile};
		stagePiles[i] = pile; 
	}
	topCard = 4;
	for (i = topCard; i < 8; i++) {
		PFCards[i - 4] = deck[i];
	}
	topCard = 8;
}

function deal(firstHalf) {
	for (i = topCard; i < (firstHalf ? topCard + 8 : topCard + 12); i++) {
		PFCards[i - (firstHalf ? 4 : topCard)] = deck[i];
	}
	topCard = i;
	for (i = topCard; i < topCard + 12; i++) {
		PSCards[i - topCard] = deck[i];
	}
	topCard = i;
}

function makeTempStage(selectedCard, arrayPiles) {
	var numLockedpiles = 0;
	for (var i = 0; i < arrayPiles.length; i++) {
		if (arrayPiles[i].locked == true) {
			numLockedpiles++;
			var lockedPile = arrayPiles[i];
		}
	}
	if (numLockedpiles > 1) {
		return false;
	}
	if (lockedPile == 1) {

	}
}

function firstTurn(selectedCard) {
	//call normal turn method
	//check if pile they made is selectedCard.rank
}

function containsHighCard(cards) {
	for (var i = 0; i < cards.length; i++) {
		if (cards[i].rank >= 9) {
			return true;
		}
	}
	return false;
}