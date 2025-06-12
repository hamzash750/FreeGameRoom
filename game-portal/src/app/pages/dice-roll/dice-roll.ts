import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dice-roll',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dice-roll.html',
  styleUrl: './dice-roll.css'
})
export class DiceRoll {
  current: number | null = null;

  roll(): void {
    this.current = Math.floor(Math.random() * 6) + 1;
  }

  reset(): void {
    this.current = null;
  }
}
