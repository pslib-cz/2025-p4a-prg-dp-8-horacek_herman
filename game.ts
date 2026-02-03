// Interaktivní textová hra s Command pattern

import * as readline from "readline";
import { GameWorld } from "./game-world";
import { GameInvoker } from "./game-invoker";
import {
  MoveCommand,
  AttackCommand,
  PickupItemCommand,
  LookAroundCommand,
  ShowMapCommand,
  ShowInventoryCommand,
  ShowStatsCommand,
} from "./game-commands";

class InteractiveGame {
  private world: GameWorld;
  private invoker: GameInvoker;
  private rl: readline.Interface;

  constructor() {
    this.world = GameWorld.getInstance();
    this.invoker = new GameInvoker();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer.trim().toLowerCase());
      });
    });
  }

  private clearScreen(): void {
    console.clear();
  }

  private printHeader(): void {
    console.log("╔═══════════════════════════════════════════════════════╗");
    console.log("║            🏰 DOBRODRUŽSTVÍ V JESKYNI 🏰             ║");
    console.log("║              Command Pattern RPG Game                 ║");
    console.log("╚═══════════════════════════════════════════════════════╝");
  }

  private printHelp(): void {
    console.log("\n📜 DOSTUPNÉ PŘÍKAZY:\n");
    console.log("  🧭 Pohyb:");
    console.log("     s, sever, north  - Jít na sever");
    console.log("     j, jih, south    - Jít na jih");
    console.log("     v, vychod, east  - Jít na východ");
    console.log("     z, zapad, west   - Jít na západ");
    console.log();
    console.log("  ⚔️  Akce:");
    console.log("     utok, attack     - Zaútočit na nepřítele");
    console.log("     seber, pickup    - Sebrat předmět");
    console.log("     rozhliz, look    - Rozhlédnout se");
    console.log();
    console.log("  📊 Informace:");
    console.log("     mapa, map        - Zobrazit mapu");
    console.log("     inventar, inv    - Zobrazit inventář");
    console.log("     stats            - Zobrazit statistiky");
    console.log();
    console.log("  🔧 Ostatní:");
    console.log("     undo, zpet       - Vrátit poslední akci");
    console.log("     help, napoveda   - Zobrazit tuto nápovědu");
    console.log("     quit, konec      - Ukončit hru\n");
  }

  private printIntro(): void {
    console.log("\n" + "═".repeat(55));
    console.log("\n🎮 PŘÍBĚH:\n");
    console.log("Probouzíte se v temné jeskyni. Vaším úkolem je prozkoumat");
    console.log("celou jeskyni, porazit všechny nepřátele a najít všechny");
    console.log("poklady!");
    console.log("\n💡 TIP: Napište 'help' pro zobrazení všech příkazů.\n");
    console.log("═".repeat(55));
  }

  private checkVictory(): void {
    const allEnemiesDefeated = this.world.enemies.every((e) => !e.alive);
    const allItemsCollected = this.world.items.size === 0;

    if (allEnemiesDefeated && allItemsCollected) {
      console.log("\n" + "═".repeat(55));
      console.log("\n🎉🎉🎉 GRATULUJEME! 🎉🎉🎉\n");
      console.log("Úspěšně jste dokončili hru!");
      console.log(`💰 Celkové zlato: ${this.world.player.gold}`);
      console.log(`❤️  Zbývající zdraví: ${this.world.player.health}/${this.world.player.maxHealth}`);
      console.log("\n" + "═".repeat(55) + "\n");
      process.exit(0);
    }
  }

  private parseCommand(input: string): void {
    const commands = {
      // Pohyb
      s: "north", sever: "north", north: "north",
      j: "south", jih: "south", south: "south",
      v: "east", vychod: "east", east: "east",
      z: "west", zapad: "west", west: "west",
      
      // Akce
      utok: "attack", attack: "attack",
      seber: "pickup", pickup: "pickup",
      rozhliz: "look", look: "look",
      
      // Info
      mapa: "map", map: "map",
      inventar: "inventory", inv: "inventory",
      stats: "stats",
      
      // Ostatní
      undo: "undo", zpet: "undo",
      help: "help", napoveda: "help",
      quit: "quit", konec: "quit",
    };

    const cmd = commands[input as keyof typeof commands];

    switch (cmd) {
      case "north":
      case "south":
      case "east":
      case "west":
        this.invoker.executeCommand(new MoveCommand(this.world, cmd));
        break;
      case "attack":
        this.invoker.executeCommand(new AttackCommand(this.world));
        break;
      case "pickup":
        this.invoker.executeCommand(new PickupItemCommand(this.world));
        break;
      case "look":
        this.invoker.executeCommand(new LookAroundCommand(this.world));
        break;
      case "map":
        this.invoker.executeCommand(new ShowMapCommand(this.world));
        break;
      case "inventory":
        this.invoker.executeCommand(new ShowInventoryCommand(this.world));
        break;
      case "stats":
        this.invoker.executeCommand(new ShowStatsCommand(this.world));
        break;
      case "undo":
        this.invoker.undoLastCommand();
        break;
      case "help":
        this.printHelp();
        break;
      case "quit":
        console.log("\n👋 Díky za hru! Nashledanou!\n");
        process.exit(0);
        break;
      default:
        console.log("\n❌ Neznámý příkaz! Napište 'help' pro nápovědu.\n");
    }
  }

  async run(): Promise<void> {
    this.clearScreen();
    this.printHeader();
    this.printIntro();
    
    console.log(this.world.describeCurrentLocation());
    
    while (true) {
      this.world.displayStatus();
      const input = await this.question("➤ Co uděláte? ");

      if (input) {
        console.log(); // Prázdný řádek pro čitelnost
        this.parseCommand(input);
        this.checkVictory();
      }
    }
  }
}

// Spuštění hry
console.log("Načítání hry...\n");
const game = new InteractiveGame();
game.run();
