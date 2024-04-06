export type Team = Array<Character>;

export type Character = {
  team: string;
  name: string;
  appearance: string;
  class: CharacterClassType;
};

export type CharacterClassType = {
  className: string;
  hp: number;
  str: number;
  dex: number;
  min: number;
  arm: number;
  res: number;
  spe: number;
  luc: number;
  mov: number;
  weapons?: Array<Weapon>;
  skills?: Array<any>;
  modifiers?: Array<any>;
};

export type Weapon = {
  name: string;
  category: string;
  damage?: number;
  hit?: number;
  crit?: number;
  range?: Array<number>;
  target?: Array<string>;
  skills?: Array<any>;
};

export type CellGridType = {
  position: PositionType;
  terrain: string;
  character: Array<Character>;
};

export type PositionType = {
  x: number;
  y: number;
};
