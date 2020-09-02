var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var deck = new Array();
var players = new Array();
var currentPlayer = 0;

function createDeck() {
    deck = new Array();
    for (var i = 0 ; i < values.length; i++) {
        for(var x = 0; x < suits.length; x++) {
            var weight = parseInt(values[i]);
            var color = '';
            if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                weight = 10;
            if (values[i] == "A")
                weight = 11;
            if (suits[x] == 'Diamonds' || suits[x] == 'Hearts') {
                color = 'red'
            } else color = 'black'
                
            var card = { Value: values[i], Suit: suits[x], Weight: weight, Color : color };
            deck.push(card);
        }
    }
    console.log(deck)
}

createDeck()