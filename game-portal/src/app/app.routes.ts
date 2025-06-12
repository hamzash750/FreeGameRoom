import { Routes } from '@angular/router';
import { GameDetail } from './pages/game-detail/game-detail';
import { GameList } from './pages/game-list/game-list';
import { TicTacToe } from './pages/tic-tac-toe/tic-tac-toe';
import { SnakeGame } from './pages/snake-game/snake-game';
import { MemoryGame } from './pages/memory-game/memory-game';

export const routes: Routes = [
  { path: '', component: GameList },
  { path: 'tic-tac-toe', component: TicTacToe },
  { path: 'snake', component: SnakeGame },
  { path: 'memory', component: MemoryGame },
  { path: 'game/:id', component: GameDetail },
];
