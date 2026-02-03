// Herní svět a stav

export interface Position {
  x: number;
  y: number;
}

export interface Item {
  name: string;
  description: string;
  type: "weapon" | "potion" | "treasure";
}

export interface Enemy {
  name: string;
  health: number;
  damage: number;
  position: Position;
  alive: boolean;
}

export interface Player {
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
  position: Position;
  inventory: Item[];
  gold: number;
}

export class GameWorld {
  private static instance: GameWorld;
  public player: Player;
  public enemies: Enemy[];
  public items: Map<string, Item>;
  public mapSize: number = 5;
  public visitedRooms: Set<string>;

  private constructor() {
    this.player = {
      name: "Hrdina",
      health: 100,
      maxHealth: 100,
      damage: 15,
      position: { x: 2, y: 2 },
      inventory: [],
      gold: 0,
    };

    this.enemies = [
      { name: "Goblin", health: 30, damage: 8, position: { x: 1, y: 1 }, alive: true },
      { name: "Ork", health: 50, damage: 12, position: { x: 4, y: 1 }, alive: true },
      { name: "Troll", health: 80, damage: 20, position: { x: 4, y: 4 }, alive: true },
    ];

    this.items = new Map();
    this.items.set("1,3", { name: "Lektvar zdraví", description: "Obnoví 50 HP", type: "potion" });
    this.items.set("0,0", { name: "Meč válečníka", description: "+10 dmg", type: "weapon" });
    this.items.set("3,4", { name: "Zlatý poklad", description: "100 zlatých", type: "treasure" });
    this.items.set("2,0", { name: "Lektvar zdraví", description: "Obnoví 50 HP", type: "potion" });

    this.visitedRooms = new Set();
    this.visitedRooms.add(this.positionKey(this.player.position));
  }

  static getInstance(): GameWorld {
    if (!GameWorld.instance) {
      GameWorld.instance = new GameWorld();
    }
    return GameWorld.instance;
  }

  static reset(): void {
    GameWorld.instance = new GameWorld();
  }

  positionKey(pos: Position): string {
    return `${pos.x},${pos.y}`;
  }

  getEnemyAtPosition(pos: Position): Enemy | undefined {
    return this.enemies.find(
      (e) => e.alive && e.position.x === pos.x && e.position.y === pos.y
    );
  }

  getItemAtPosition(pos: Position): Item | undefined {
    return this.items.get(this.positionKey(pos));
  }

  removeItemAtPosition(pos: Position): void {
    this.items.delete(this.positionKey(pos));
  }

  isValidPosition(pos: Position): boolean {
    return pos.x >= 0 && pos.x < this.mapSize && pos.y >= 0 && pos.y < this.mapSize;
  }

  describeCurrentLocation(): string {
    const pos = this.player.position;
    const enemy = this.getEnemyAtPosition(pos);
    const item = this.getItemAtPosition(pos);

    let description = `\n📍 Nacházíte se na pozici [${pos.x}, ${pos.y}]\n`;

    if (enemy) {
      description += `\n⚔️  Před vámi stojí: ${enemy.name} (HP: ${enemy.health})\n`;
    } else if (item) {
      description += `\n✨ Vidíte zde: ${item.name} - ${item.description}\n`;
    } else {
      const roomDescriptions = [
        "Temná místnost s vlhkými zdmi.",
        "Osvětlená chodba s pochodněmi.",
        "Prostorná síň s vysokým stropem.",
        "Úzký koridor s pavučinami.",
        "Kamenná komnata se zvuky kapající vody.",
      ];
      const index = (pos.x + pos.y * this.mapSize) % roomDescriptions.length;
      description += `\n${roomDescriptions[index]}\n`;
    }

    return description;
  }

  displayMap(): void {
    console.log("\n🗺️  MAPA JESKYNĚ:\n");
    for (let y = 0; y < this.mapSize; y++) {
      let line = "";
      for (let x = 0; x < this.mapSize; x++) {
        const pos = { x, y };
        if (this.player.position.x === x && this.player.position.y === y) {
          line += " 🧙 ";
        } else if (this.getEnemyAtPosition(pos)) {
          line += " 👹 ";
        } else if (this.items.has(this.positionKey(pos))) {
          line += " 📦 ";
        } else if (this.visitedRooms.has(this.positionKey(pos))) {
          line += " ·  ";
        } else {
          line += " ?  ";
        }
      }
      console.log(line);
    }
    console.log("\nLegenda: 🧙=Vy 👹=Nepřítel 📦=Předmět ·=Navštíveno ?=Neznámo\n");
  }

  displayStatus(): void {
    console.log("═".repeat(55));
    console.log(
      `❤️  HP: ${this.player.health}/${this.player.maxHealth}  |  ⚔️  DMG: ${this.player.damage}  |  💰 Zlato: ${this.player.gold}`
    );
    console.log(`🎒 Inventář (${this.player.inventory.length}): ${
      this.player.inventory.length > 0
        ? this.player.inventory.map((i) => i.name).join(", ")
        : "prázdný"
    }`);
    console.log("═".repeat(55));
  }
}
