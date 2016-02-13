var deck = [];
var PFCards = [];
var PSCards = [];
var PFpoints = 0;
var PSpoints = 0;
var stagePiles = [];
var tempStage = [];
var topCard = 0;
var turn = 1;

function getStagePiles() {
	return stagePiles;
}

function getDeck() {
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
		var pile = {locked : deck[i].rank == 13 ? true : false, rankValue: deck[i].rank, cards: cardsInPile};
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
		PFCards.push(deck[i]);
	}
	topCard = i;
	for (i = topCard; i < topCard + 12; i++) {
		PSCards.push(deck[i]);
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

/*
SelectedCard = index of card selected inside your hand
targetRankIndex = index of card rank needed to reach in terms of first selection (1stTurn)
selectedPiles = array of indices of selected piles from stagePiles[]
pickUp = boolean for whether you're picking up or putting down
*/
function firstTurn(selectedCard, targetRankIndex, selectedPiles, pickUp) {
	//call normal turn method
	//check if pile they made is selectedCard.rank
	var handCard = PFCards[selectedCard];
	var arrayPiles = [];
	var sumOfCards = 0;
	for (i = 0; i < selectedPiles.length; i++){
		arrayPiles[i] = stagePiles[selectedPiles[i]];
		sumOfCards += arrayPiles[i].rankValue;
	}

	sumOfCards += handCard.rank;
	if (!pickUp) {
		if (sumOfCards != PFCards[targetRankIndex].rank)
			return false
		makePile(handCard, selectedPiles);
	}
	else if (!pickUpPile(handCard, selectedPiles)) {
		return false;
	}

	turn++;
	PFCards.splice(selectedCard, 1);

	deal(true);
	return true;
}

function anyTurn(selectedCard, selectedPiles, pickUp) {
	var player1turn = turn%2 == 1;
	var handCard = player1turn ? PFCards[selectedCard] : PSCards[selectedCard];
	/*var sumOfCards = 0;
	for (i = 0; i < selectedPiles.length; i++){
		sumOfCards += stagePiles[selectedPiles[i]].rankValue;
	}

	sumOfCards += handCard.rank;*/
	if (!pickUp) {
		//if (sumOfCards != PFCards[targetRankIndex].rank)
			//return false
		makePile(handCard, selectedPiles);
	}
	else if (!pickUpPile(handCard, selectedPiles)) {
		return false;
	}

	turn++;
	player1turn ? PFCards.splice(selectedCard, 1) : PSCards.splice(selectedCard, 1);

	if (PFCards.length == 0 && PSCards.length == 0)
		deal(false);

	return true;
}

function makePile(handCard, selectedPiles) {
	if (selectedPiles.length == 0) {
		var newPile = {locked : handCard.rank == 13 ? true : false, rankValue: handCard.rank, cards: [handCard]};
		stagePiles.push(newPile);
		return 0;
	}

	var pileRank = 0;
	var unlockedPiles = {locked : false, rankValue : 0, cards: []};
	var lockedPiles = {locked: true, rankValue: 0, cards: []};
	for (i=0; i < selectedPiles.length; i++) {
		var currentPile = stagePiles[selectedPiles[i]];

		if (!currentPile.locked) {		//Add all unlocked piles into one
			unlockedPiles.rankValue += currentPile.rankValue;
			unlockedPiles.cards = unlockedPiles.cards.concat(currentPile.cards);
		} else {
			if (lockedPiles.cards.length == 0) {
				lockedPiles = currentPile;
			} else {
				if (lockedPiles.rankValue != currentPile.rankValue)
					return false;
				lockedPiles.cards = lockedPiles.cards.concat(currentPile.cards);
			}
		}

	unlockedPiles.cards.push(handCard);
	unlockedPiles.rankValue += handCard.rank;

	if (lockedPiles.cards.length != 0)
		pileRank = lockedPiles.rankValue;
	}
	for (i=9; i<=13; i++) {
		if (unlockedPiles.rankValue % i == 0) {
			if (i > 13)
				unlockedPiles.locked = true;
			unlockedPiles.rankValue = i;
			break;
		}
		if (i==13)
			return false;
	}

	if (pileRank == 0) {
		pileRank = unlockedPiles.rankValue;
	} else if (pileRank != unlockedPiles.rankValue) {
		return false;
	}

	var playerCards = turn % 2 == 1? PFCards : PSCards;
	var count = 0;
	for (i=0; i < playerCards.length; i++) {
		if (playerCards[i].rank == pileRank)
			count++;
	}

	if (pileRank == handCard.rank && count < 2)
		return false;

	if (pileRank != handCard.rank && count < 1)
		return false;



	if (lockedPiles.length != 0) {
		var finalPile = lockedPiles.cards.concat(unlockedPiles.cards);
	} else {
		var finalPile = unlockedPiles;
	}


	var destinationPile = selectedPiles[0];
	/*for (i=1; i<selectedPiles.length; i++) {
		var currentPile = stagePiles[selectedPiles[i]];

		if (!stagePiles[destinationPile].locked)
			stagePiles[destinationPile].rankValue = currentPile.locked ? currentPile.rankValue : 
				stagePiles[destinationPile].rankValue + currentPile.rankValue;
		
		for (j=0; j < currentPile.cards.length; j++) {
			stagePiles[destinationPile].cards.push(currentPile.cards[j]);
		}
	}*/
	for (i=1; i<selectedPiles.length; i++) {
		stagePiles.splice(selectedPiles[i], 1);
	}
	/*stagePiles[destinationPile].cards.push(handCard);
	if (stagePiles[destinationPile].rankValue != handCard.rank)
		stagePiles[destinationPile].rankValue += handCard.rank;
	*/
	stagePiles[destinationPile] = finalPile;
}

function pickUpPile(handCard, selectedPiles) {
	var sumOfCards = 0;
	for (i = 0; i < selectedPiles.length; i++){
		sumOfCards += stagePiles[selectedPiles[i]].rankValue;
	}
	if (handCard.rank != sumOfCards)
		return false;
	for (i=0; i<selectedPiles.length; i++) {
		stagePiles.splice(selectedPiles[i], 1);
	}
	return true;
}

function containsHighCard(cards) {
	for (var i = 0; i < cards.length; i++) {
		if (cards[i].rank >= 9) {
			return true;
		}
	}
	return false;
}