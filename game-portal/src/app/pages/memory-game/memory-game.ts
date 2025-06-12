import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Card {
  value: number;
  revealed: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './memory-game.html',
  styleUrl: './memory-game.css'
})
export class MemoryGame {
  cards: Card[] = [];
  private first?: Card;
  moves = 0;

  constructor() {
    const values = [...Array(8).keys(), ...Array(8).keys()].sort(() => Math.random() - 0.5);
    this.cards = values.map(v => ({ value: v + 1, revealed: false, matched: false }));
  }

  flip(card: Card): void {
    if (card.revealed || card.matched) return;
    card.revealed = true;
    if (!this.first) {
      this.first = card;
      return;
    }
    this.moves++;
    if (this.first.value === card.value) {
      this.first.matched = card.matched = true;
      this.first = undefined;
    } else {
      const prev = this.first;
      this.first = undefined;
      setTimeout(() => {
        prev.revealed = false;
        card.revealed = false;
      }, 500);
    }
  }

  reset(): void {
    const values = [...Array(8).keys(), ...Array(8).keys()].sort(() => Math.random() - 0.5);
    this.cards = values.map(v => ({ value: v + 1, revealed: false, matched: false }));
    this.moves = 0;
    this.first = undefined;
  }
}
