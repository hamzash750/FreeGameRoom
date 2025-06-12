import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.html',
  styleUrl: './game-list.css',
    standalone: true,
  imports: [CommonModule, RouterModule],
})
export class GameList {
games = [
  { route: '/tic-tac-toe', name: 'Tic Tac Toe', description: 'Classic tic tac toe game' },
  { route: '/snake', name: 'Snake', description: 'Grow the snake and avoid walls!' },
  { route: '/memory', name: 'Memory Game', description: 'Match the cards!' },
];

}
