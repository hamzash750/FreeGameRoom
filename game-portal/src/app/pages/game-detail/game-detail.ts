import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.css',
   standalone: true,
  imports: [CommonModule, RouterModule],
})
export class GameDetail {
  gameId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.gameId = this.route.snapshot.paramMap.get('id');
  }
}
