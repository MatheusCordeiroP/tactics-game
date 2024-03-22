import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  redTeam,
  blueTeam,
  greenTeam,
} from '../../../assets/sprites-reference';

@Component({
  selector: 'app-battle-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './battle-screen.component.html',
  styleUrl: './battle-screen.component.scss',
})
export class BattleScreenComponent {
  redTeam = redTeam;
  blueTeam = blueTeam;
  greenTeam = greenTeam;

  grid_y: number = 16;
  grid_x: number = 16;

  grid: Array<any> = [];

  constructor() {
    for (let i = 0; i < this.grid_y; i++) {
      this.grid.push([]);

      for (let j = 0; j < this.grid_x; j++) {
        this.grid[i].push([]);

        this.grid[i][j] = { x: j, y: i };

        console.log(this.grid[i][j]);
      }
    }
  }
}
