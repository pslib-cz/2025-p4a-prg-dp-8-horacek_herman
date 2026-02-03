import * as readline from "readline";
import { GameInvoker } from "./game-invoker";
import { MissionFactory } from "./mission-factory";

class InteractiveGameApp {
  private invoker: GameInvoker;
  private factory: MissionFactory;
  private rl: readline.Interface;

  constructor() {
    this.invoker = new GameInvoker();
    this.factory = new MissionFactory();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  private clearScreen(): void {
    console.clear();
  }

  private printHeader(): void {
    console.log("╔═══════════════════════════════════════════════════════╗");
    console.log("║         🎮 HERNÍ MISE - COMMAND PATTERN 🎮           ║");
    console.log("╚═══════════════════════════════════════════════════════╝\n");
  }

  private printMenu(): void {
    console.log("┌───────────────────────────────────────────────────────┐");
    console.log("│                    HLAVNÍ MENU                        │");
    console.log("├───────────────────────────────────────────────────────┤");
    console.log("│  1️⃣  Spustit kompletní misi                          │");
    console.log("│  2️⃣  Načíst mapu                                      │");
    console.log("│  3️⃣  Inicializovat postavy                           │");
    console.log("│  4️⃣  Zkontrolovat inventář                           │");
    console.log("│  5️⃣  Spustit zvukové efekty                          │");
    console.log("│  6️⃣  Nastavit HUD                                     │");
    console.log("│  7️⃣  Zobrazit historii příkazů                       │");
    console.log("│  8️⃣  Vrátit poslední příkaz (Undo)                   │");
    console.log("│  9️⃣  Vymazat historii                                │");
    console.log("│  0️⃣  Ukončit program                                 │");
    console.log("└───────────────────────────────────────────────────────┘\n");
  }

  private async startCompleteMission(): Promise<void> {
    console.log("\n🎮 SPUŠTĚNÍ KOMPLETNÍ MISE\n");

    const mapName = await this.question("📍 Název mapy (např. Forest Temple): ");
    const difficultyStr = await this.question("⚔️  Obtížnost (1-10): ");
    const difficulty = parseInt(difficultyStr) || 5;
    const playerId = await this.question("👤 ID hráče (např. player_123): ");

    console.log("\n");
    const missionCommand = this.factory.createStartMissionCommand(
      mapName || "Default Map",
      difficulty,
      playerId || "player_default"
    );

    this.invoker.executeCommand(missionCommand);
    
    await this.question("\n✅ Stiskněte ENTER pro pokračování...");
  }

  private async loadMap(): Promise<void> {
    console.log("\n🗺️  NAČTENÍ MAPY\n");

    const mapName = await this.question("📍 Název mapy: ");
    const difficultyStr = await this.question("⚔️  Obtížnost (1-10): ");
    const difficulty = parseInt(difficultyStr) || 5;

    console.log("\n");
    const command = this.factory.createLoadMapCommand(
      mapName || "Default Map",
      difficulty
    );

    this.invoker.executeCommand(command);
    
    await this.question("\n✅ Stiskněte ENTER pro pokračování...");
  }

  private async initializeCharacters(): Promise<void> {
    console.log("\n👥 INICIALIZACE POSTAV\n");

    const idsStr = await this.question("🆔 ID postav (oddělené čárkou, např. 1,2,3): ");
    const characterIds = idsStr
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    if (characterIds.length === 0) {
      console.log("\n⚠️  Žádné platné ID zadáno, použiji výchozí [1, 2, 3]");
      characterIds.push(1, 2, 3);
    }

    console.log("\n");
    const command = this.factory.createInitCharactersCommand(characterIds);
    this.invoker.executeCommand(command);
    
    await this.question("\n✅ Stiskněte ENTER pro pokračování...");
  }

  private async checkInventory(): Promise<void> {
    console.log("\n🎒 KONTROLA INVENTÁŘE\n");

    const playerId = await this.question("👤 ID hráče: ");

    console.log("\n");
    const command = this.factory.createCheckInventoryCommand(
      playerId || "player_default"
    );
    this.invoker.executeCommand(command);
    
    await this.question("\n✅ Stiskněte ENTER pro pokračování...");
  }

  private async playSoundEffects(): Promise<void> {
    console.log("\n🔊 SPUŠTĚNÍ ZVUKOVÝCH EFEKTŮ\n");

    const trackName = await this.question("🎵 Název zvuku (např. epic-battle.mp3): ");
    const volumeStr = await this.question("🔈 Hlasitost (0.0 - 1.0, výchozí 0.8): ");
    const volume = parseFloat(volumeStr) || 0.8;

    console.log("\n");
    const command = this.factory.createPlaySoundCommand(
      trackName || "default-sound.mp3",
      volume
    );
    this.invoker.executeCommand(command);
    
    await this.question("\n✅ Stiskněte ENTER pro pokračování...");
  }

  private async setupHUD(): Promise<void> {
    console.log("\n📊 NASTAVENÍ HUD\n");

    const showHealth = (await this.question("❤️  Zobrazit zdraví? (a/n): ")).toLowerCase() === "a";
    const showMana = (await this.question("💙 Zobrazit manu? (a/n): ")).toLowerCase() === "a";
    const showMinimap = (await this.question("🗺️  Zobrazit minimapu? (a/n): ")).toLowerCase() === "a";

    console.log("\n");
    const command = this.factory.createSetupHUDCommand({
      showHealth,
      showMana,
      showMinimap,
    });
    this.invoker.executeCommand(command);
    
    await this.question("\n✅ Stiskněte ENTER pro pokračování...");
  }

  private async showHistory(): Promise<void> {
    console.log("\n📜 HISTORIE PŘÍKAZŮ\n");

    const historySize = this.invoker.getHistorySize();
    
    if (historySize === 0) {
      console.log("⚠️  Historie je prázdná - nebyl proveden žádný příkaz.");
    } else {
      console.log(`📊 Celkem provedeno příkazů: ${historySize}`);
    }

    await this.question("\n✅ Stiskněte ENTER pro pokračování...");
  }

  private async undoLastCommand(): Promise<void> {
    console.log("\n⟲ VRÁCENÍ POSLEDNÍHO PŘÍKAZU\n");

    this.invoker.undoLastCommand();

    await this.question("\n✅ Stiskněte ENTER pro pokračování...");
  }

  private async clearHistory(): Promise<void> {
    console.log("\n🗑️  VYMAZÁNÍ HISTORIE\n");

    const confirm = await this.question("⚠️  Opravdu chcete vymazat historii? (a/n): ");
    
    if (confirm.toLowerCase() === "a") {
      this.invoker.clearHistory();
      console.log("\n✅ Historie byla vymazána");
    } else {
      console.log("\n❌ Akce zrušena");
    }

    await this.question("\n✅ Stiskněte ENTER pro pokračování...");
  }

  async run(): Promise<void> {
    let running = true;

    while (running) {
      this.clearScreen();
      this.printHeader();
      this.printMenu();

      const choice = await this.question("Vyberte akci (0-9): ");

      switch (choice) {
        case "1":
          await this.startCompleteMission();
          break;
        case "2":
          await this.loadMap();
          break;
        case "3":
          await this.initializeCharacters();
          break;
        case "4":
          await this.checkInventory();
          break;
        case "5":
          await this.playSoundEffects();
          break;
        case "6":
          await this.setupHUD();
          break;
        case "7":
          await this.showHistory();
          break;
        case "8":
          await this.undoLastCommand();
          break;
        case "9":
          await this.clearHistory();
          break;
        case "0":
          running = false;
          console.log("\n👋 Děkujeme za použití! Nashledanou!\n");
          break;
        default:
          console.log("\n❌ Neplatná volba! Zkuste to znovu.");
          await this.question("Stiskněte ENTER pro pokračování...");
      }
    }

    this.rl.close();
  }
}

// Spuštění interaktivní aplikace
const app = new InteractiveGameApp();
app.run();
