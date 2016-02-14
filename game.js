var deck = [];
var PFCards = [];
var PSCards = [];
var PFpoints = 0;
var PSpoints = 0;
var PFPile = [];
var PSPile = [];
var stagePiles = [];
var tempStage = [];
var topCard = 0;
var turn = 1;
var lastPickup = 0;

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
	PFCards.sort(sortByRank);
}

function sortByRank(a,b) {
  if (a.rank < b.rank)
     return -1;
  if (a.rank > b.rank)
    return 1;
  return 0;
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
	PFCards.sort(sortByRank);
	PSCards.sort(sortByRank);
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
		if (sumOfCards % PFCards[targetRankIndex].rank != 0)
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
		if (!makePile(handCard, selectedPiles))
			return false;
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
		return true;
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
	}

	unlockedPiles.cards.push(handCard);
	unlockedPiles.rankValue += handCard.rank;

	var highestCardRank = 0;
	for (i=0; i < unlockedPiles.length; i++) {
		if (unlockedPiles.cards[i].rank > highestCardRank)
			highestCardRank = unlockedPiles.cards[i].rank;
	}

	if (lockedPiles.cards.length != 0)
		pileRank = lockedPiles.rankValue;

	for (i=9; i<=13; i++) {
		if (unlockedPiles.rankValue % i == 0 && i>=highestCardRank && i>=pileRank) {
			if (unlockedPiles.rankValue > 13)
				unlockedPiles.locked = true;
			unlockedPiles.rankValue = i;
			break;
		}
		if (i==13)
			return false;
	}

	console.log("1unlocked piles rank value : " + unlockedPiles.rankValue);
	if (pileRank == 0) {
		pileRank = unlockedPiles.rankValue;
	} else if (pileRank != unlockedPiles.rankValue) {
		return false;
	}

	console.log("2unlocked piles rank value : " + unlockedPiles.rankValue);
	console.log("2pile rank value : " + pileRank);

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


	var finalPile = lockedPiles;
	if (lockedPiles.cards.length != 0) {
		finalPile = lockedPiles;
		lockedPiles.cards = lockedPiles.cards.concat(unlockedPiles.cards);
	} else {
		finalPile = unlockedPiles;
		console.log("THIS HAPPENED");
	}

	console.log("3unlocked piles rank value : " + unlockedPiles.rankValue);
	console.log("3final piles rank value : " + finalPile.rankValue);
	console.log("3pile rank value : " + pileRank);


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
	for (i=selectedPiles.length - 1; i > 0; i--) {
		stagePiles.splice(selectedPiles[i], 1);
	}
	/*stagePiles[destinationPile].cards.push(handCard);
	if (stagePiles[destinationPile].rankValue != handCard.rank)
		stagePiles[destinationPile].rankValue += handCard.rank;
	*/
	stagePiles[destinationPile] = finalPile;
	return true;
}

function pickUpPile(handCard, selectedPiles) {
	var sumOfCards = 0;
	for (i = 0; i < selectedPiles.length; i++){
		sumOfCards += stagePiles[selectedPiles[i]].rankValue;
	}
	var sum = 0;
	var flag = false;
	var sweep = false;
	for (i = 0; i < selectedPiles.length; i++){
		sum = stagePiles[selectedPiles[0]].rankValue;

	}

	if (sumOfCards > handCard.rank) {
		if (sumOfCards % handCard.rank != 0)
			return false;
	} else if (sumOfCards < handCard.rank)
		return false;


	for (i=selectedPiles.length - 1; i>=0; i--) {
		if (turn %2 == 1) {
			PFPile = PFPile.concat(stagePiles[selectedPiles[i]].cards);
		} else {
			PSPile = PSPile.concat(stagePiles[selectedPiles[i]].cards);
		}
		stagePiles.splice(selectedPiles[i], 1);
	}

	if (stagePiles.length == 0)
		sweep = true;

	if (turn %2 == 1) {
		lastPickup = 1;
		if (sweep)
			PFPile.push({rank: 50, suit: 1});
		PFPile.push(handCard);
	} else {
		lastPickup = 2;
		if (sweep)
			PSPile.push({rank: 50, suit: 1});
		PSPile.push(handCard);
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

function calculateScore(cards, endgame) {
	if (!cards)
		return 0;
	var score = 0;
	console.log(cards);
	for (i=0; i < cards.length; i++) {
		if (cards[i].suit == 1) {
			score += cards[i].rank;
		} else if (cards[i].suit == 3) {
			score += cards[i].rank == 1 || cards[i].rank == 10 ? cards[i].rank : 0;
		} else if (cards[i].rank == 1) {
			score++;
		}
	}
	if (endgame) {
		score += cards.length > 26 ? 4 : cards.length == 26 ? 2 : 0;
	}
	return score;
}


function endgame() {
	if (lastPickup == 1) {
		while (stagePiles.length != 0) {
			PFPile = PFPile.concat(stagePiles[0].cards);
			stagePiles.splice(0, 1);
		}
	} else while (stagePiles.length != 0) {
		PSPile = PSPile.concat(stagePiles[0].cards);
		stagePiles.splice(0, 1);
	}
}