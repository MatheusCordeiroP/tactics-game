import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BattleScreenComponent } from './pages/battle-screen/battle-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BattleScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tactics-game-online';
}
