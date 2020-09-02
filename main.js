
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
            // console.log(deck)
        }

        function createPlayers(num) {
            players = new Array();
            for(var i = 1; i <= num; i++) {
                var hand = new Array();
                var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand }; //tracking the player with thier ID (1 or 2 for this game) and the points
                players.push(player);
            }
        }

        function createPlayersUI() {
            document.getElementById('players').innerHTML = '';
            for(var i = 0; i < players.length; i++) {
                /*
                creating new html elements.
                let element = document.createElement(tagName);
                */
                var div_player = document.createElement('div');
                var div_playerid = document.createElement('div');
                var div_hand = document.createElement('div');
                var div_points = document.createElement('div');
                //putting thier classNames and IDs | 'class = "abc"' or 'id = "xyz"' in the html
                div_points.className = 'points';
                div_points.id = 'points_' + i; //i : ID or player num
                div_player.id = 'player_' + i;
                div_player.className = 'player';
                div_hand.id = 'hand_' + i;

                div_playerid.innerHTML = 'Player ' + players[i].ID;
                //adding the all above changes with appendChild
                div_player.appendChild(div_playerid);
                div_player.appendChild(div_hand);
                div_player.appendChild(div_points);
                document.getElementById('players').appendChild(div_player);
            }
        }

        function shuffle() {
            // for 1000 turns
            // switch the values of two random cards
            // for (var i = 0; i < 1000; i++)
            // {
            //     var location1 = Math.floor((Math.random() * deck.length));
            //     var location2 = Math.floor((Math.random() * deck.length));
            //     var tmp = deck[location1];

            //     deck[location1] = deck[location2];
            //     deck[location2] = tmp;
            // }
            
                
                for (let i = deck.length - 1; i > 0; i--) {
                  
                  let j = Math.floor(Math.random() * (i + 1));
                  //swap
                  [deck[i], deck[j]] = [deck[j], deck[i]];
                }
                return deck;
            
        }

        function startblackjack() {
            document.getElementById('btnStart').value = 'Restart';
            document.getElementById("status").style.display="none";
            // deal 2 cards to every player object
            currentPlayer = 0;
            createDeck();
            shuffle();
            createPlayers(2);
            createPlayersUI();
            dealHands();
            document.getElementById('player_' + currentPlayer).classList.add('active');
        }

        function dealHands() {
            // alternate handing cards to each player
            // 2 cards each
            for(var i = 0; i < 2; i++){
                for (var x = 0; x < players.length; x++) {
                    var card = deck.pop(); //returns the top-most item in the stack
                    players[x].Hand.push(card);
                    renderCard(card, x);
                    updatePoints();
                }
            }

            updateDeck(); //updateing the deck after every deal
        }

        //Cards needs to be added to their players' 'hand'. | submit the cards
        function renderCard(card, player) {
            
            var hand = document.getElementById('hand_' + player);
            hand.appendChild(getCardUI(card));
        }
        //html unicode for the suits
        function getCardUI(card) {
            var el = document.createElement('div');
            
            var icon = '';
            
            if (card.Suit == 'Hearts')
            icon ='&hearts;';
            
            
            else if (card.Suit == 'Spades')
            icon = '&spades;';
            else if (card.Suit == 'Diamonds')
            icon = '&diams;';
            else
            icon = '&clubs;';
            
            


            el.className = 'card';
            
            //creating div.classes for updating the crad in css for styling
            el.innerHTML = "<div class = 'icon'>"+ card.Value + icon + "</div>" + '<br/>' + '<br>' + "<div class = 'icon-mid'>"+ icon + "</div>" + '<br/>' + '<br/>' + "<div class = 'icon-bot'>"+ card.Value + icon + "</div>";
            // if (icon == '&hearts;' || icon == '&hearts;' ) {
            //     // var cardColor = document.createElement('div')
            //     cardColor.classList.add('red')
            //     // el.append(cardColor)
            // } else {
            //     cardColor.classList.add('black')
            // }
            // cardColor.classList.add(deck.color ? 'red' : 'black')
            
            
            return el;
            
        }

        // returns the number of points that a player has
        function getPoints(player) {
            var points = 0;
            for(var i = 0; i < players[player].Hand.length; i++)
            {
                points += players[player].Hand[i].Weight;
            }
            players[player].Points = points; //returns individual score of the players
            return points;
        }

        function updatePoints() {
            for (var i = 0 ; i < players.length; i++)
            {
                getPoints(i);
                document.getElementById('points_' + i).innerHTML = players[i].Points;
            }
        }

        function hitMe() {
            // pop a card from the deck to the current player
            // check if current player new points are over 21
            var card = deck.pop();
            players[currentPlayer].Hand.push(card);
            renderCard(card, currentPlayer);
            updatePoints();
            updateDeck();
            check(); // determine if the player has lost the game.
        }

        function stay() {
            // move on to next player, if any
            if (currentPlayer != players.length-1) {
                document.getElementById('player_' + currentPlayer).classList.remove('active');
                currentPlayer += 1;
                document.getElementById('player_' + currentPlayer).classList.add('active');
            }
            //if no player's turn is left we can end the game
            else {
                end();
            }
        }

        function end() {
            var winner = false; //can also give falsy value -1
            var score = 0;

            for(var i = 0; i < players.length; i++)
            {
                if (players[i].Points > score && players[i].Points < 22)
                {
                    winner = i;
                }

                score = players[i].Points;
            }

            document.getElementById('status').innerHTML = 'Winner: Player ' + players[winner].ID;
            document.getElementById("status").style.display = "inline-block";
        }

        function check() {
            if (players[currentPlayer].Points > 21)
            {
                document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + ' LOST';
                document.getElementById('status').style.display = "inline-block";
                end();
            }
        }

        function updateDeck() {
            document.getElementById('deckcount').innerHTML = deck.length;
        }
        //adding event handler to the window Object
        window.addEventListener('load', function(){
            createDeck();
            shuffle();
            createPlayers(1);
        });