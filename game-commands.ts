// Herní příkazy používající Command pattern

import { ICommand } from "./command";
import { GameWorld, Position } from "./game-world";

export class MoveCommand implements ICommand {
  private world: GameWorld;
  private direction: string;
  private previousPosition: Position;

  constructor(world: GameWorld, direction: "north" | "south" | "east" | "west") {
    this.world = world;
    this.direction = direction;
    this.previousPosition = { ...world.player.position };
  }

  execute(): void {
    const newPos = { ...this.world.player.position };

    switch (this.direction) {
      case "north":
        newPos.y -= 1;
        break;
      case "south":
        newPos.y += 1;
        break;
      case "east":
        newPos.x += 1;
        break;
      case "west":
        newPos.x -= 1;
        break;
    }

    if (!this.world.isValidPosition(newPos)) {
      console.log("\n❌ Nemůžete jít tímto směrem - je tam zeď!\n");
      return;
    }

    const enemy = this.world.getEnemyAtPosition(newPos);
    if (enemy) {
      console.log(`\n⚠️  Nemůžete projít - v cestě stojí ${enemy.name}!\n`);
      return;
    }

    this.world.player.position = newPos;
    this.world.visitedRooms.add(this.world.positionKey(newPos));
    console.log(`\n✅ Posouváte se na ${this.direction === "north" ? "sever" : this.direction === "south" ? "jih" : this.direction === "east" ? "východ" : "západ"}...\n`);
  }

  undo(): void {
    this.world.player.position = this.previousPosition;
    console.log("\n⟲ Vrátili jste se zpět\n");
  }
}

export class AttackCommand implements ICommand {
  private world: GameWorld;

  constructor(world: GameWorld) {
    this.world = world;
  }

  execute(): void {
    const enemy = this.world.getEnemyAtPosition(this.world.player.position);

    if (!enemy) {
      console.log("\n❌ Není tu nikdo, koho byste mohli zaútočit!\n");
      return;
    }

    console.log(`\n⚔️  Útočíte na ${enemy.name}!`);
    enemy.health -= this.world.player.damage;
    console.log(`   💥 Způsobili jste ${this.world.player.damage} poškození!`);

    if (enemy.health <= 0) {
      enemy.alive = false;
      const goldReward = Math.floor(Math.random() * 30) + 10;
      this.world.player.gold += goldReward;
      console.log(`\n🎉 Porazili jste ${enemy.name}!`);
      console.log(`💰 Získali jste ${goldReward} zlatých!\n`);
      return;
    }

    console.log(`   ${enemy.name} má ještě ${enemy.health} HP`);

    // Nepřítel vrací úder
    console.log(`\n👹 ${enemy.name} vám vrací úder!`);
    this.world.player.health -= enemy.damage;
    console.log(`   💔 Obdrželi jste ${enemy.damage} poškození!`);

    if (this.world.player.health <= 0) {
      console.log("\n💀 Byli jste poraženi! Hra končí.\n");
      process.exit(0);
    }

    console.log(`   Máte ještě ${this.world.player.health} HP\n`);
  }
}

export class PickupItemCommand implements ICommand {
  private world: GameWorld;

  constructor(world: GameWorld) {
    this.world = world;
  }

  execute(): void {
    const item = this.world.getItemAtPosition(this.world.player.position);

    if (!item) {
      console.log("\n❌ Není tu nic k sebránní!\n");
      return;
    }

    this.world.player.inventory.push(item);
    this.world.removeItemAtPosition(this.world.player.position);

    console.log(`\n✅ Sebrali jste: ${item.name}`);

    // Automaticky použít předmět
    if (item.type === "potion") {
      this.world.player.health = Math.min(
        this.world.player.maxHealth,
        this.world.player.health + 50
      );
      console.log(`   💚 Obnovili jste 50 HP! (Aktuální: ${this.world.player.health})`);
    } else if (item.type === "weapon") {
      this.world.player.damage += 10;
      console.log(`   ⚔️  Váš útok se zvýšil na ${this.world.player.damage}!`);
    } else if (item.type === "treasure") {
      this.world.player.gold += 100;
      console.log(`   💰 Získali jste 100 zlatých!`);
    }

    console.log();
  }
}

export class LookAroundCommand implements ICommand {
  private world: GameWorld;

  constructor(world: GameWorld) {
    this.world = world;
  }

  execute(): void {
    console.log(this.world.describeCurrentLocation());
  }
}

export class ShowMapCommand implements ICommand {
  private world: GameWorld;

  constructor(world: GameWorld) {
    this.world = world;
  }

  execute(): void {
    this.world.displayMap();
  }
}

export class ShowInventoryCommand implements ICommand {
  private world: GameWorld;

  constructor(world: GameWorld) {
    this.world = world;
  }

  execute(): void {
    console.log("\n🎒 INVENTÁŘ:\n");
    if (this.world.player.inventory.length === 0) {
      console.log("   Inventář je prázdný.\n");
    } else {
      this.world.player.inventory.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name} - ${item.description}`);
      });
      console.log();
    }
  }
}

export class ShowStatsCommand implements ICommand {
  private world: GameWorld;

  constructor(world: GameWorld) {
    this.world = world;
  }

  execute(): void {
    console.log("\n📊 STATISTIKY HRÁČE:\n");
    console.log(`   Jméno: ${this.world.player.name}`);
    console.log(`   ❤️  Zdraví: ${this.world.player.health}/${this.world.player.maxHealth}`);
    console.log(`   ⚔️  Poškození: ${this.world.player.damage}`);
    console.log(`   💰 Zlato: ${this.world.player.gold}`);
    console.log(`   🎒 Předmětů: ${this.world.player.inventory.length}`);
    
    const defeatedEnemies = this.world.enemies.filter(e => !e.alive).length;
    console.log(`   👹 Poražených nepřátel: ${defeatedEnemies}/${this.world.enemies.length}\n`);
  }
}
