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
  currentYear = new Date().getFullYear();
games = [
  {
    route: '/tic-tac-toe',
    name: 'Tic Tac Toe',
    description: 'Classic tic tac toe game',
    icon: 'https://img.icons8.com/ios-filled/200/000000/tic-tac-toe.png'
  },
  {
    route: '/snake',
    name: 'Snake',
    description: 'Grow the snake and avoid walls!',
    icon: 'https://img.icons8.com/ios-filled/200/000000/snake.png'
  },
  {
    route: '/memory',
    name: 'Memory Game',
    description: 'Match the cards!',
   icon: 'https://cdn-icons-png.flaticon.com/512/3050/3050525.png'
  },
  {
    route: '/minesweeper',
    name: 'Minesweeper',
    description: 'Clear the field without hitting mines.',
    icon: 'https://img.icons8.com/ios-filled/200/000000/minesweeper.png'
  },
  {
    route: '/balloon',
    name: 'Pop It Balloon',
    description: 'Pop all the balloons!',
    icon: 'https://img.icons8.com/?size=100&id=26142&format=png&color=000000'
  },
  {
    route: '/dice-roll',
    name: 'Dice Roll',
    description: 'Roll a dice and test your luck!',
    icon: 'https://img.icons8.com/ios-filled/200/000000/dice.png'
  }
];


}
