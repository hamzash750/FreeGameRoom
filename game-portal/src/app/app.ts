import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
 constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Free Game Portal - Play Browser Games');

    this.meta.addTags([
      { name: 'description', content: 'Enjoy free classic browser games like Tic Tac Toe, Snake, and Memory Game. No login required.' },
      { name: 'keywords', content: 'Free games, Angular games, browser games, tic tac toe, snake, memory, HTML5 games' },
      { name: 'author', content: 'Hamza Shafique' },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ]);
  }
}