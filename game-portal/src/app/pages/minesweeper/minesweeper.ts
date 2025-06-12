import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Cell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
}

@Component({
  selector: 'app-minesweeper',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './minesweeper.html',
  styleUrl: './minesweeper.css'
})
export class Minesweeper {
  width = 8;
  height = 8;
  mines = 10;
  board: Cell[][] = [];
  gameOver = false;
  remaining = 0;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.remaining = this.width * this.height - this.mines;
    this.gameOver = false;
    this.board = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }))
    );
    // place mines
    let placed = 0;
    while (placed < this.mines) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      const cell = this.board[y][x];
      if (!cell.mine) {
        cell.mine = true;
        placed++;
      }
    }
    // calculate adjacent counts
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!this.board[y][x].mine) {
          this.board[y][x].adjacent = this.countAdjacent(x, y);
        }
      }
    }
  }

  private countAdjacent(x: number, y: number): number {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < this.width && ny < this.height && this.board[ny][nx].mine) {
          count++;
        }
      }
    }
    return count;
  }

  reveal(cell: Cell, x: number, y: number): void {
    if (this.gameOver || cell.revealed || cell.flagged) return;
    cell.revealed = true;
    if (cell.mine) {
      this.gameOver = true;
      this.revealAll();
      return;
    }
    this.remaining--;
    if (cell.adjacent === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < this.width && ny < this.height) {
            const neighbor = this.board[ny][nx];
            if (!neighbor.revealed && !neighbor.flagged) {
              this.reveal(neighbor, nx, ny);
            }
          }
        }
      }
    }
    if (this.remaining === 0) {
      this.gameOver = true;
    }
  }

  toggleFlag(cell: Cell): void {
    if (this.gameOver || cell.revealed) return;
    cell.flagged = !cell.flagged;
  }

  private revealAll(): void {
    for (const row of this.board) {
      for (const c of row) {
        c.revealed = true;
      }
    }
  }
}
