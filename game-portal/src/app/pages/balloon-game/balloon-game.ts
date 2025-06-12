import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Balloon {
  popped: boolean;
}

@Component({
  selector: 'app-balloon-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './balloon-game.html',
  styleUrl: './balloon-game.css'
})
export class BalloonGame {
  balloons: Balloon[] = [];
  popped = 0;

  constructor() {
    this.reset();
  }

  pop(balloon: Balloon): void {
    if (balloon.popped) return;
    balloon.popped = true;
    this.popped++;
  }

  reset(): void {
    this.balloons = Array.from({ length: 20 }, () => ({ popped: false }));
    this.popped = 0;
  }
}
