import { Game } from './Game';

window.onload = async () => {
    try {
        const game = Game.getInstance();
        await game.start();
    } catch (error) {
        console.error("Error starting the game:", error);
    }
};
