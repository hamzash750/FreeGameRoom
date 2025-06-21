// Enhancements for your BalloonGame

import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

interface Balloon {
  popped: boolean;
  color: string;
  top: number;
  left: number;
  type?: 'normal' | 'bonus' | 'freeze' | 'bomb';
  emoji?: string;
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
  highScore = 0;
  combo = 0;
  speed = 200;
  difficultyLevel = 1;
  totalPopped = 0;
  slots: number[] = [];
  activeSlots: Record<number, boolean> = {};
  colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'yellow'];
  emojis = ['🎈', '💚', '💙', '💛', '💜'];
  audio = new Audio('sound/balloon-pop.mp3'); // Make sure to include this sound

  constructor() {
    this.slots = Array.from({ length: 6 }, (_, i) => i * 16); // 0, 16, 32...80
    this.slots.forEach(slot => this.activeSlots[slot] = true);

    const storedScore = localStorage.getItem('highScore');
    this.highScore = storedScore ? +storedScore : 0;

    for (let i = 0; i < this.difficultyLevel; i++) {
      this.spawnBalloon();
    }

    this.dropBalloons();
    this.speedUp();
  }

  enterFullscreen(): void {
    const docElm = document.documentElement as any;
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    } else if (docElm.webkitRequestFullscreen) {
      docElm.webkitRequestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen();
    }
  }
  exitFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(console.warn);
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }
  adjustDifficulty(): void {
    if (this.popped > this.totalPopped + 10) {
      this.difficultyLevel++;
      this.totalPopped = this.popped;
      this.speed = Math.max(50, this.speed - 20);
    }
  }

  spawnBalloon(): void {
    const freeSlots = this.slots.filter(slot => this.activeSlots[slot]);
    if (freeSlots.length === 0) return;

    const slot = freeSlots[Math.floor(Math.random() * freeSlots.length)];
    this.activeSlots[slot] = false;

    const randomType = Math.random();
    let type: Balloon['type'] = 'normal';
    if (randomType > 0.95) type = 'bomb';
    else if (randomType > 0.9) type = 'freeze';
    else if (randomType > 0.85) type = 'bonus';

    const balloon: Balloon = {
      popped: false,
      color: this.getRandomColor(),
      top: 0,
      left: slot,
      type,
      emoji: this.getRandomEmoji()
    };

    this.balloons.push(balloon);
  }

  getRandomColor(): string {
    const index = Math.floor(Math.random() * this.colors.length);
    return this.colors[index];
  }

  getRandomEmoji(): string {
    return this.emojis[Math.floor(Math.random() * this.emojis.length)];
  }

  dropBalloons(): void {
    setInterval(() => {
      const slotStatus: Record<number, boolean> = {};
      for (let balloon of this.balloons) {
        if (!balloon.popped) {
          balloon.top += 5;
          if (!slotStatus[balloon.left] && balloon.top > 100) {
            this.activeSlots[balloon.left] = true;
            slotStatus[balloon.left] = true;
          }
          if (balloon.top > 580) {
            alert("Game Over!");
            this.saveHighScore();
            this.reset();
            return;
          }
        }
      }
      this.spawnBalloon();
    }, this.speed);
  }

  speedUp(): void {
    setInterval(() => {
      if (this.speed > 50) this.speed -= 10;
    }, 10000);
  }

  pop(balloon: Balloon): void {
    if (balloon.popped) return;

    balloon.popped = true;
    this.popped++;
    this.combo++;
    this.audio.play();

    if (this.combo >= 3 && balloon.type === 'normal') {
      this.popped += 2;
      this.combo = 0;
    }

    if (balloon.type === 'bomb') {
      alert('💣 Bomb! Game Over');
      this.saveHighScore();
      this.reset();
      return;
    } else if (balloon.type === 'freeze') {
      this.speed += 100;
    } else if (balloon.type === 'bonus') {
      this.popped += 3;
    }

    this.activeSlots[balloon.left] = true;

    setTimeout(() => {
      const index = this.balloons.indexOf(balloon);
      if (index > -1) {
        this.balloons.splice(index, 1);
      }
    }, 1000);
  }

  saveHighScore(): void {
    if (this.popped > this.highScore) {
      this.highScore = this.popped;
      localStorage.setItem('highScore', this.highScore.toString());
    }
  }

  reset(): void {
    this.balloons = [];
    this.popped = 0;
    this.combo = 0;
    this.speed = 200;
    this.slots.forEach(slot => this.activeSlots[slot] = true);
  }
}
