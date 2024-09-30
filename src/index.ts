import { Game } from './Game';

window.onload = async () => {
    const game = new Game();
    await game.start();
};
