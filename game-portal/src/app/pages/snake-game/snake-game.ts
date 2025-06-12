import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Point { x: number; y: number; }

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './snake-game.html',
  styleUrl: './snake-game.css'
})
export class SnakeGame implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private size = 20;
  private snake: Point[] = [{ x: 8, y: 8 }];
  private food: Point = this.randomPoint();
  private intervalId: any;
  score = 0;
private direction: Point = { x: 1, y: 0 }; // start moving right
  ngAfterViewInit(): void {
     console.log('Canvas initialized');
    const canvas = this.canvasRef.nativeElement;
    canvas.width = 400;
    canvas.height = 400;
    this.ctx = canvas.getContext('2d')!;
    document.addEventListener('keydown', e => this.onKey(e));
    this.intervalId = setInterval(() => this.update(), 150);
  }

  private onKey(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowUp':
        if (this.direction.y === 1) return;
        this.direction = { x: 0, y: -1 }; break;
      case 'ArrowDown':
        if (this.direction.y === -1) return;
        this.direction = { x: 0, y: 1 }; break;
      case 'ArrowLeft':
        if (this.direction.x === 1) return;
        this.direction = { x: -1, y: 0 }; break;
      case 'ArrowRight':
        if (this.direction.x === -1) return;
        this.direction = { x: 1, y: 0 }; break;
    }
  }

  private update(): void {
    const head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };
    if (this.isCollision(head)) {
      clearInterval(this.intervalId);
      return;
    }
    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.food = this.randomPoint();
    } else {
      this.snake.pop();
    }
    this.draw();
  }

  private draw(): void {
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, 400, 400);
    this.ctx.fillStyle = '#198754';
    for (const part of this.snake) {
      this.ctx.fillRect(part.x * this.size, part.y * this.size, this.size, this.size);
    }
    this.ctx.fillStyle = '#dc3545';
    this.ctx.fillRect(this.food.x * this.size, this.food.y * this.size, this.size, this.size);
  }

  private isCollision(point: Point): boolean {
    if (point.x < 0 || point.y < 0 || point.x >= 20 || point.y >= 20) {
      return true;
    }
    return this.snake.some(p => p.x === point.x && p.y === point.y);
  }

  private randomPoint(): Point {
    return { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
  }
}
