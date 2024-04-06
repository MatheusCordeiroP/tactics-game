import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  redTeam,
  blueTeam,
  greenTeam,
} from '../../../assets/sprites-reference';
import { characterClass } from '../../../utils/characterClass';
import { Character, Team, CellGridType, PositionType } from '../../../types';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-battle-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './battle-screen.component.html',
  styleUrl: './battle-screen.component.scss',
})
export class BattleScreenComponent {
  redTeamSprites = redTeam;
  blueTeamSprites = blueTeam;
  greenTeamSprites = greenTeam;

  players = ['redTeam', 'greenTeam'];
  currentPlayer = 'redTeam';

  redTeam: Team = [
    {
      team: 'redTeam',
      name: 'Zéfiro',
      appearance: this.redTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
    {
      team: 'redTeam',
      name: 'Zéfiro',
      appearance: this.redTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
    {
      team: 'redTeam',
      name: 'Zéfiro',
      appearance: this.redTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
    {
      team: 'redTeam',
      name: 'Zéfiro',
      appearance: this.redTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
    {
      team: 'redTeam',
      name: 'Zéfiro',
      appearance: this.redTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
    {
      team: 'redTeam',
      name: 'Zéfiro',
      appearance: this.redTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
  ];
  blueTeam = [
    {
      team: 'blueTeam',
      name: 'Ragaki',
      appearance: this.blueTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
  ];
  greenTeam = [
    {
      team: 'greenTeam',
      name: 'Ragaki',
      appearance: this.greenTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
    {
      team: 'greenTeam',
      name: 'Ragaki Clone 1',
      appearance: this.greenTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
    {
      team: 'greenTeam',
      name: 'Ragaki Clone 2',
      appearance: this.greenTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
    {
      team: 'greenTeam',
      name: 'Ragaki Clone 3',
      appearance: this.greenTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
    {
      team: 'greenTeam',
      name: 'Ragaki Clone 4',
      appearance: this.greenTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
    {
      team: 'greenTeam',
      name: 'Ragaki Clone 5',
      appearance: this.greenTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
    {
      team: 'greenTeam',
      name: 'Ragaki Clone 6',
      appearance: this.greenTeamSprites['rogue'],
      class: characterClass['rogue'],
    },
  ];

  grid_y: number = 16;
  grid_x: number = 16;

  grid: Array<Array<CellGridType>> = [];

  walkable: Array<any> = [];
  attackingArea: Array<any> = [];

  walkableVisibilityChange: Subject<Array<any>> = new Subject<Array<any>>();

  currentRound: number;

  constructor() {
    this.walkableVisibilityChange.subscribe((value) => {
      this.walkable = value;
    });

    for (let i = 0; i < this.grid_y; i++) {
      this.grid.push([]);
      for (let j = 0; j < this.grid_x; j++) {
        this.grid[i].push({
          position: { x: j, y: i },
          terrain: 'plains',
          character: [],
        });
      }
    }

    this.grid[0][9].terrain = 'river';
    this.grid[1][9].terrain = 'river';

    this.players.forEach((team) => {
      switch (team) {
        case 'redTeam':
          this.redTeam.forEach((character, i) => {
            this.grid[0][this.grid_x / 2 + i].character.push(character);
          });
          break;
        case 'blueTeam':
          this.blueTeam.forEach((character, i) => {
            this.grid[this.grid_y][this.grid_x / 2 + i].character.push(
              character
            );
          });
          break;
        case 'greenTeam':
          this.greenTeam.forEach((character, i) => {
            this.grid[this.grid_y / 2 + i][0].character.push(character);
          });
          break;
      }
    });

    this.redTeam;

    this.currentRound = 1;

    this.changeCharacterPositionOnGrid({ y: 0, x: 9 }, { y: 12, x: 1 });
    this.changeCharacterPositionOnGrid({ y: 0, x: 10 }, { y: 2, x: 10 });
    this.changeCharacterPositionOnGrid({ y: 0, x: 11 }, { y: 1, x: 10 });
    this.changeCharacterPositionOnGrid({ y: 0, x: 12 }, { y: 3, x: 9 });
    this.changeCharacterPositionOnGrid({ y: 0, x: 13 }, { y: 4, x: 9 });

    this.changeCharacterPositionOnGrid({ y: 11, x: 0 }, { y: 5, x: 10 });
    this.changeCharacterPositionOnGrid({ y: 10, x: 0 }, { y: 5, x: 9 });
    this.changeCharacterPositionOnGrid({ y: 9, x: 0 }, { y: 5, x: 8 });
  }

  // Mostra todos os locais para qual o personagem pode ir
  showMoveArea(character: Character, piecePosition: PositionType) {
    let tempWalkable: Array<any> = [];
    let nextMoveStart: Array<any> = [];
    const selectedCharacterTeam = character.team;

    console.log({ character, piecePosition });

    if (character.team == this.currentPlayer) {
      for (let i = 1; i <= character.class.mov; i++) {
        if (i == 1) {
          nextMoveStart = [{ x: piecePosition.x, y: piecePosition.y }];
        }

        let nextMoves: Array<any> = nextMoveStart;
        nextMoveStart = [];
        nextMoves.forEach((gridCell, index) => {
          if (
            gridCell.x + 1 < this.grid_x &&
            !tempWalkable.some(
              (element) =>
                element.x === gridCell.x + 1 && element.y === gridCell.y
            ) &&
            this.grid[gridCell.y][gridCell.x + 1].terrain == 'plains' &&
            !(
              this.grid[gridCell.y][gridCell.x + 1].character.length > 0 &&
              this.grid[gridCell.y][gridCell.x + 1].character[0].team !=
                selectedCharacterTeam
            )
          ) {
            let newGridCell: { x: number; y: number; path?: any } = {
              x: gridCell.x + 1,
              y: gridCell.y,
            };
            if (!gridCell.path) {
              newGridCell.path = [{ x: gridCell.x + 1, y: gridCell.y }];
              console.log('has not path');
            } else {
              newGridCell.path = gridCell.path.slice();
              newGridCell.path.push({
                x: gridCell.x + 1,
                y: gridCell.y,
              });
              console.log('has path');
            }
            tempWalkable.push(newGridCell);
            nextMoveStart.push(newGridCell);
          }
          if (
            gridCell.x - 1 >= 0 &&
            !tempWalkable.some(
              (element) =>
                element.x === gridCell.x - 1 && element.y === gridCell.y
            ) &&
            this.grid[gridCell.y][gridCell.x - 1].terrain == 'plains' &&
            !(
              this.grid[gridCell.y][gridCell.x - 1].character.length > 0 &&
              this.grid[gridCell.y][gridCell.x - 1].character[0].team !=
                selectedCharacterTeam
            )
          ) {
            let newGridCell: { x: number; y: number; path?: any } = {
              x: gridCell.x - 1,
              y: gridCell.y,
            };
            if (!gridCell.path) {
              newGridCell.path = [{ x: gridCell.x - 1, y: gridCell.y }];
              console.log('has not path');
            } else {
              newGridCell.path = gridCell.path.slice();
              newGridCell.path.push({
                x: gridCell.x - 1,
                y: gridCell.y,
              });
              console.log('has path');
            }
            tempWalkable.push(newGridCell);
            nextMoveStart.push(newGridCell);
          }
          if (
            gridCell.y + 1 < this.grid_y &&
            !tempWalkable.some(
              (element) =>
                element.x === gridCell.x && element.y === gridCell.y + 1
            ) &&
            this.grid[gridCell.y + 1][gridCell.x].terrain == 'plains' &&
            !(
              this.grid[gridCell.y + 1][gridCell.x].character.length > 0 &&
              this.grid[gridCell.y + 1][gridCell.x].character[0].team !=
                selectedCharacterTeam
            )
          ) {
            let newGridCell: { x: number; y: number; path?: any } = {
              x: gridCell.x,
              y: gridCell.y + 1,
            };
            if (!gridCell.path) {
              newGridCell.path = [{ x: gridCell.x, y: gridCell.y + 1 }];
              console.log('has not path');
            } else {
              newGridCell.path = gridCell.path.slice();
              newGridCell.path.push({
                x: gridCell.x,
                y: gridCell.y + 1,
              });
              console.log('has path');
            }
            tempWalkable.push(newGridCell);
            nextMoveStart.push(newGridCell);
          }
          if (
            gridCell.y - 1 >= 0 &&
            !tempWalkable.some(
              (element) =>
                element.x === gridCell.x && element.y === gridCell.y - 1
            ) &&
            this.grid[gridCell.y - 1][gridCell.x].terrain == 'plains' &&
            !(
              this.grid[gridCell.y - 1][gridCell.x].character.length > 0 &&
              this.grid[gridCell.y - 1][gridCell.x].character[0].team !=
                selectedCharacterTeam
            )
          ) {
            let newGridCell: { x: number; y: number; path?: any } = {
              x: gridCell.x,
              y: gridCell.y - 1,
            };
            if (!gridCell.path) {
              newGridCell.path = [{ x: gridCell.x, y: gridCell.y - 1 }];
              console.log('has not path');
            } else {
              newGridCell.path = gridCell.path.slice();
              newGridCell.path.push({
                x: gridCell.x,
                y: gridCell.y - 1,
              });
              console.log('has path');
            }
            tempWalkable.push(newGridCell);
            nextMoveStart.push(newGridCell);
          }
        });

        if (i == character.class.mov) {
          console.log('WE SHOULD ADD EVERYONE');
        }
      }
    } else {
      console.log('Não é o jogador ativo');
    }

    let removedItems: Array<any> = [];
    tempWalkable.forEach((element) => {
      const character = this.grid[element.y][element.x].character;
      if (character && character.length > 0) {
        tempWalkable.filter((item) => {
          if (item.x === element.x && item.y === element.y) {
            removedItems.push(item);
            return false;
          }
          return true;
        });
      }
    });

    tempWalkable = tempWalkable.filter(
      (item1) =>
        !removedItems.some(
          (item2) => item1.x === item2.x && item1.y === item2.y
        )
    );

    this.updateWalkable(tempWalkable);
    this.showDangerArea(character, true, true);
  }

  showDangerArea(
    character: Character,
    showAttacks: boolean,
    showHealingArea: boolean
  ) {
    const selectedCharacterTeam = character.team;
    let tempWalkable = this.walkable;
    let tempAttackArea: Array<any> = [];
    let weaponRanges: Array<number> = [];

    character.class.weapons?.forEach((weapon) => {
      if (weapon.target?.includes('enemy')) {
        weapon.range?.forEach((range) => {
          if (!weaponRanges.includes(range)) {
            weaponRanges.push(range);
          }
        });
      }
    });

    tempWalkable.forEach((element) => {
      console.log(element);

      if (weaponRanges.includes(1)) {
        if (
          element.x + 1 < this.grid_x &&
          !this.isOnAttackArea(element.x + 1, element.y, tempAttackArea) &&
          !(
            this.grid[element.y][element.x + 1].character.length > 0 &&
            this.grid[element.y][element.x + 1].character[0].team ===
              selectedCharacterTeam
          )
        ) {
          tempAttackArea.push({ x: element.x + 1, y: element.y });
        }
        if (
          element.x - 1 >= 0 &&
          !this.isOnAttackArea(element.x - 1, element.y, tempAttackArea) &&
          !(
            this.grid[element.y][element.x - 1].character.length > 0 &&
            this.grid[element.y][element.x - 1].character[0].team ===
              selectedCharacterTeam
          )
        ) {
          tempAttackArea.push({ x: element.x - 1, y: element.y });
        }
        if (
          element.y + 1 < this.grid_y &&
          !this.isOnAttackArea(element.x, element.y + 1, tempAttackArea) &&
          !(
            this.grid[element.y + 1][element.x].character.length > 0 &&
            this.grid[element.y + 1][element.x].character[0].team ===
              selectedCharacterTeam
          )
        ) {
          tempAttackArea.push({ x: element.x, y: element.y + 1 });
        }
        if (
          element.y - 1 >= 0 &&
          !this.isOnAttackArea(element.x, element.y - 1, tempAttackArea) &&
          !(
            this.grid[element.y - 1][element.x].character.length > 0 &&
            this.grid[element.y - 1][element.x].character[0].team ===
              selectedCharacterTeam
          )
        ) {
          tempAttackArea.push({ x: element.x, y: element.y - 1 });
        }
      }

      if (weaponRanges.includes(2)) {
        if (
          element.x + 2 < this.grid_x &&
          !this.isOnAttackArea(element.x + 2, element.y, tempAttackArea) &&
          !(
            this.grid[element.y][element.x + 2].character.length > 0 &&
            this.grid[element.y][element.x + 2].character[0].team ===
              selectedCharacterTeam
          )
        ) {
          tempAttackArea.push({ x: element.x + 2, y: element.y });
        }
        if (
          element.x - 2 >= 0 &&
          !this.isOnAttackArea(element.x - 2, element.y, tempAttackArea) &&
          !(
            this.grid[element.y][element.x - 2].character.length > 0 &&
            this.grid[element.y][element.x - 2].character[0].team ===
              selectedCharacterTeam
          )
        ) {
          tempAttackArea.push({ x: element.x - 2, y: element.y });
        }
        if (
          element.y + 2 < this.grid_y &&
          !this.isOnAttackArea(element.x, element.y + 2, tempAttackArea) &&
          !(
            this.grid[element.y + 2][element.x].character.length > 0 &&
            this.grid[element.y + 2][element.x].character[0].team ===
              selectedCharacterTeam
          )
        ) {
          tempAttackArea.push({ x: element.x, y: element.y + 2 });
        }
        if (
          element.y - 2 >= 0 &&
          !this.isOnAttackArea(element.x, element.y - 2, tempAttackArea) &&
          !(
            this.grid[element.y - 2][element.x].character.length > 0 &&
            this.grid[element.y - 2][element.x].character[0].team ===
              selectedCharacterTeam
          )
        ) {
          tempAttackArea.push({ x: element.x, y: element.y - 2 });
        }

        if (
          element.x + 1 < this.grid_x &&
          element.y + 1 < this.grid_y &&
          !this.isOnAttackArea(element.x + 1, element.y + 1, tempAttackArea) &&
          !(
            this.grid[element.y + 1][element.x + 1].character.length > 0 &&
            this.grid[element.y + 1][element.x + 1].character[0].team ===
              selectedCharacterTeam
          )
        ) {
          tempAttackArea.push({ x: element.x + 1, y: element.y + 1 });
        }
        if (
          element.x - 1 >= 0 &&
          element.y + 1 < this.grid_y &&
          !this.isOnAttackArea(element.x - 1, element.y + 1, tempAttackArea) &&
          !(
            this.grid[element.y + 1][element.x - 1].character.length > 0 &&
            this.grid[element.y + 1][element.x - 1].character[0].team ===
              selectedCharacterTeam
          )
        ) {
          tempAttackArea.push({ x: element.x - 1, y: element.y + 1 });
        }
        if (
          element.x + 1 < this.grid_x &&
          element.y - 1 >= 0 &&
          !this.isOnAttackArea(element.x + 1, element.y - 1, tempAttackArea) &&
          !(
            this.grid[element.y - 1][element.x + 1].character.length > 0 &&
            this.grid[element.y - 1][element.x + 1].character[0].team ===
              selectedCharacterTeam
          )
        ) {
          tempAttackArea.push({ x: element.x + 1, y: element.y - 1 });
        }
        if (
          element.x - 1 >= 0 &&
          element.y - 1 >= 0 &&
          !this.isOnAttackArea(element.x - 1, element.y - 1, tempAttackArea) &&
          !(
            this.grid[element.y - 1][element.x - 1].character.length > 0 &&
            this.grid[element.y - 1][element.x - 1].character[0].team ===
              selectedCharacterTeam
          )
        ) {
          tempAttackArea.push({ x: element.x - 1, y: element.y - 1 });
        }
      }
    });

    console.log(`temp AA::`, tempAttackArea);

    tempAttackArea = tempAttackArea.filter(
      (item) =>
        !tempWalkable.some(
          (walkableItem) =>
            walkableItem.x === item.x && walkableItem.y === item.y
        )
    );
    console.log(`temp BB::`, tempAttackArea);

    this.attackingArea = tempAttackArea.slice();
  }

  isWalkable(x: number, y: number): boolean {
    return this.walkable.some(
      (element: any) => element.x === x && element.y === y
    );
  }

  isAttackable(x: number, y: number): boolean {
    return this.attackingArea.some(
      (element: any) => element.x === x && element.y === y
    );
  }

  isOnAttackArea(x: number, y: number, attackAreaList: Array<any>) {
    return attackAreaList.some((item) => item.x === x && item.y === y);
  }

  updateWalkable(walkable: Array<any>) {
    this.walkableVisibilityChange.next(walkable);
  }

  changeCharacterPositionOnGrid(oldPosition: any, newPosition: any) {
    if (
      this.grid[oldPosition.y][oldPosition.x].character.length > 0 &&
      this.grid[newPosition.y][newPosition.x].character.length == 0
    ) {
      var charactersToMove = this.grid[oldPosition.y][oldPosition.x].character;
      this.grid[newPosition.y][newPosition.x].character.push(
        ...charactersToMove
      );
      this.grid[oldPosition.y][oldPosition.x].character = [];
    }
  }
}
