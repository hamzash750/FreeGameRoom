import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
declare var bootstrap: any;
import { NgxParticlesModule } from '@tsparticles/angular';

  import { MoveDirection, OutMode, type Engine } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';
interface Point { x: number; y: number; }

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule,NgxParticlesModule],
  templateUrl: './snake-game.html',
  styleUrl: './snake-game.css'
})
export class SnakeGame implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private size = 30;
  private gridCount = 20;
  private snake: Point[] = [{ x: 8, y: 8 }];
  private food: Point = this.randomPoint();
  private intervalId: any;
  private speed = 200; // default speed
  private timerId: any;
  private duration = 60; // seconds

  score = 0;
  highScore = 0;
  remainingTime = this.duration;
  difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';

  private direction: Point = { x: 1, y: 0 };
  private nextDirection: Point = { x: 1, y: 0 };

ngAfterViewInit(): void {
  const canvas = this.canvasRef.nativeElement;

  // Make the canvas square and fill the viewport
  const side = Math.min(window.innerWidth, window.innerHeight);

  canvas.width = side;
  canvas.height = side;

  this.ctx = canvas.getContext('2d')!;

  // Adjust size and grid count dynamically based on screen
  this.gridCount = 20; // or whatever makes sense for difficulty
  this.size = Math.floor(side / this.gridCount);

  // Setup game
  document.addEventListener('keydown', (e) => this.onKey(e));

  this.loadHighScore();
  this.setupTouchControls();
  this.setDifficulty(this.difficulty);
  this.startGame();
}

  private onKey(e: KeyboardEvent): void {
    const key = e.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) e.preventDefault();

    switch (key) {
      case 'ArrowUp':
        if (this.direction.y === 1) return;
        this.nextDirection = { x: 0, y: -1 }; break;
      case 'ArrowDown':
        if (this.direction.y === -1) return;
        this.nextDirection = { x: 0, y: 1 }; break;
      case 'ArrowLeft':
        if (this.direction.x === 1) return;
        this.nextDirection = { x: -1, y: 0 }; break;
      case 'ArrowRight':
        if (this.direction.x === -1) return;
        this.nextDirection = { x: 1, y: 0 }; break;
    }
  }

  private update(): void {
    this.direction = this.nextDirection;
    const head = {
      x: this.snake[0].x + this.direction.x,
      y: this.snake[0].y + this.direction.y
    };

   if (this.isCollision(head)) {
  this.playSound('gameover');
  clearInterval(this.intervalId);
  clearInterval(this.timerId);
  this.saveHighScore();

  // Show Bootstrap modal
  const modal = new bootstrap.Modal(document.getElementById('gameOverModal'));
  modal.show();
  return;
}

    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.playSound('eat');
      this.score++;
      this.increaseSpeed();
      this.food = this.randomPoint();
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  private draw(): void {
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.size * this.gridCount, this.size * this.gridCount);

    this.ctx.fillStyle = '#198754';
    for (const part of this.snake) {
      this.ctx.fillRect(part.x * this.size, part.y * this.size, this.size, this.size);
    }

    this.ctx.fillStyle = '#dc3545';
    this.ctx.fillRect(this.food.x * this.size, this.food.y * this.size, this.size, this.size);
  }

  private isCollision(point: Point): boolean {
    if (point.x < 0 || point.y < 0 || point.x >= this.gridCount || point.y >= this.gridCount) return true;
    return this.snake.some(p => p.x === point.x && p.y === point.y);
  }

  private randomPoint(): Point {
    let newPoint: Point;
    do {
      newPoint = {
        x: Math.floor(Math.random() * this.gridCount),
        y: Math.floor(Math.random() * this.gridCount)
      };
    } while (this.snake.some(p => p.x === newPoint.x && p.y === newPoint.y));
    return newPoint;
  }

  restart(): void {
    clearInterval(this.intervalId);
    clearInterval(this.timerId);
    this.snake = [{ x: 8, y: 8 }];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.food = this.randomPoint();
    this.score = 0;
    this.remainingTime = this.duration;
    this.setDifficulty(this.difficulty);
    this.startGame();
  }

  private startGame(): void {
    this.intervalId = setInterval(() => this.update(), this.speed);
    this.timerId = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(this.intervalId);
        clearInterval(this.timerId);
        alert('⏱ Time’s up! Your score: ' + this.score);
        this.saveHighScore();
      }
    }, 1000);
  }

  private increaseSpeed(): void {
    if (this.speed > 60) {
      this.speed -= 5;
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => this.update(), this.speed);
    }
  }

  private playSound(type: 'eat' | 'gameover') {
    const audio = new Audio();
    audio.src = type === 'eat' ? 'sound/pop.mp3' : 'sound/gameOver.mp3';
    audio.load();
    audio.play();
  }

  private saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('snake_high_score', this.highScore.toString());
    }
  }

  private loadHighScore() {
    this.highScore = +(localStorage.getItem('snake_high_score') || 0);
  }

  setDifficulty(level: 'Easy' | 'Medium' | 'Hard') {
    this.difficulty = level;
    this.speed = level === 'Easy' ? 200 : level === 'Medium' ? 150 : 100;
    this.duration = 60;
  }

  private setupTouchControls() {
    let startX = 0;
    let startY = 0;

    window.addEventListener('touchstart', e => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    });

    window.addEventListener('touchmove', e => {
      if (!startX || !startY) return;

      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (Math.abs(dx) > Math.abs(dy)) {
        // horizontal
        if (dx > 0 && this.direction.x !== -1) this.nextDirection = { x: 1, y: 0 };
        else if (dx < 0 && this.direction.x !== 1) this.nextDirection = { x: -1, y: 0 };
      } else {
        // vertical
        if (dy > 0 && this.direction.y !== -1) this.nextDirection = { x: 0, y: 1 };
        else if (dy < 0 && this.direction.y !== 1) this.nextDirection = { x: 0, y: -1 };
      }

      startX = 0;
      startY = 0;
    });
  }


particlesOptions = {
  background: {
    color: { value: "#f8f9fa" }
  },
  fpsLimit: 60,
  particles: {
    number: { value: 80 },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.8 },
    size: { value: 4 },
    move: {
      enable: true,
      speed: 1,
      direction: MoveDirection.none, // ✅ use imported enum
      outModes: {
        default: OutMode.bounce // ✅ use imported enum
      }
    }
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 100 },
      push: { quantity: 4 }
    }
  },
  detectRetina: true
};






async particlesInit(engine: Engine): Promise<void> {
  await loadFull(engine);
}

}
