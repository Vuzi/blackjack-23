import React from "react";
import PlayerZone from "./PlayerZone";
import Deck from "./Deck";
import Player from "./Player";
import Game from "./Game";
import { NotificationStack } from 'react-notification';

// Blackjack table
var BlackjackTable = React.createClass({
    displayName: "BlackjackTable",
    getInitialState: function() {
        // New game
        // Create the game engine
        const deck = new Deck();
        const player = new Player(100);
        const game = new Game(deck, [player]);
        return {
            player: player,
            deck: deck,
            game : game,
            notifications: []
        };
    },
    
    nextTurn: function() {
        // Make the dealer draw cards
        this.state.game.dealerDraw();

        // End the turn
        var results = this.state.game.endTurn();

        // Update
        this.forceUpdate();

        // Alert the user
        if(results[0] == "won") {
            this.state.notifications.push({
                message: "You won :)",
                key: "win"
            });
        } else if (results[0] == "lost") {
            this.state.notifications.push({
                message: "You lost :(",
                key: "win"
            });
        } else {
            this.state.notifications.push({
                message: "Equality :S",
                key: "win"
            });
        }
        setTimeout(() => {
            this.state.game.nextTurn();
            this.forceUpdate();
        }, 2500);
    },

    render: function() {
        const { game } = this.state;
        console.log(this.state);
        return (
            <div>
                <PlayerZone
                    type="dealer"
                    player={game.dealer}
                    notification={this.notification}
                    game={game} />
                <PlayerZone
                    type="player"
                    player={game.players[0]}
                    game={game}
                    notification={this.notification}
                    onStand={() => this.nextTurn() } />
                <NotificationStack
                    notifications={this.state.notifications}
                    onDismiss={notification =>
                        this.setState({
                            notifications: this.state.notifications.filter(n => n !== notification)
                        })
                    }
                />
            </div>
        );
    },

    notification: function (message, key) {
        this.state.notifications.push({
            message: message,
            key: key
        });
    },

    componentWillMount: function () {
        // First turn
        this.state.game.nextTurn();
    }
});

export default BlackjackTable;