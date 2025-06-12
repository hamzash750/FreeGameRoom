import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tic-tac-toe.html',
  styleUrl: './tic-tac-toe.css'
})
export class TicTacToe {
  board: string[] = Array(9).fill('');
  currentPlayer: 'X' | 'O' = 'X';
  winner: string | null = null;

  makeMove(index: number): void {
    if (this.board[index] || this.winner) {
      return;
    }
    this.board[index] = this.currentPlayer;
    if (this.checkWin()) {
      this.winner = this.currentPlayer;
    } else if (!this.board.includes('')) {
      this.winner = 'Draw';
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  reset(): void {
    this.board = Array(9).fill('');
    this.currentPlayer = 'X';
    this.winner = null;
  }

  private checkWin(): boolean {
    const combos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    return combos.some(pattern =>
      pattern.every(i => this.board[i] === this.currentPlayer)
    );
  }
}
