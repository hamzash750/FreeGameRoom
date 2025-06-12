import { Routes } from '@angular/router';
import { GameDetail } from './pages/game-detail/game-detail';
import { GameList } from './pages/game-list/game-list';

export const routes: Routes = [
      { path: '', component: GameList },
  { path: 'game/:id', component: GameDetail },
];
