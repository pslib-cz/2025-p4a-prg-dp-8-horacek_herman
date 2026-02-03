// Herní entita - hráč

export interface Position {
  x: number;
  y: number;
}

export class Player {
  public position: Position;
  public health: number;
  public maxHealth: number;
  public mana: number;
  public maxMana: number;
  public inventory: string[] = [];
  public experience: number = 0;
  public level: number = 1;

  constructor(startX: number, startY: number) {
    this.position = { x: startX, y: startY };
    this.health = 100;
    this.maxHealth = 100;
    this.mana = 50;
    this.maxMana = 50;
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  addItem(item: string): void {
    this.inventory.push(item);
  }

  hasItem(item: string): boolean {
    return this.inventory.includes(item);
  }

  removeItem(item: string): void {
    const index = this.inventory.indexOf(item);
    if (index > -1) {
      this.inventory.splice(index, 1);
    }
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  gainExperience(amount: number): void {
    this.experience += amount;
    if (this.experience >= this.level * 100) {
      this.levelUp();
    }
  }

  private levelUp(): void {
    this.level++;
    this.maxHealth += 20;
    this.maxMana += 10;
    this.health = this.maxHealth;
    this.mana = this.maxMana;
  }
}
