import { GameInvoker } from "./game-invoker";
import { MissionFactory } from "./mission-factory";

function main() {
  const invoker = new GameInvoker();
  const factory = new MissionFactory();

  console.log("═══════════════════════════════════════════════════════");
  console.log("         COMMAND PATTERN - HERNÍ MISE");
  console.log("═══════════════════════════════════════════════════════\n");

  console.log("📌 PŘÍPAD 1: Jednoduchý start mise (pro běžné uživatele)\n");
  
  const startMissionCommand = factory.createStartMissionCommand(
    "Forest Temple",
    3,
    "player_123"
  );
  
  invoker.executeCommand(startMissionCommand);

  console.log("\n" + "═".repeat(55) + "\n");

  console.log("📌 PŘÍPAD 2: Individuální příkazy (pro pokročilé uživatele)\n");
  
  console.log("🔧 Ruční načtení jednotlivých subsystémů:\n");
  
  invoker.executeCommand(factory.createLoadMapCommand("Desert Arena", 5));
  invoker.executeCommand(factory.createInitCharactersCommand([10, 11, 12]));
  invoker.executeCommand(factory.createPlaySoundCommand("desert-wind.mp3", 0.6));
  
  console.log("\n" + "═".repeat(55) + "\n");

  console.log("📌 PŘÍPAD 3: Vrácení posledního příkazu (Undo)\n");
  
  invoker.undoLastCommand();

  console.log("\n" + "═".repeat(55) + "\n");

  console.log("📌 PŘÍPAD 4: Vlastní konfigurace mise\n");

  const customMission = factory.createStartMissionCommand(
    "Ice Dungeon",
    7,
    "player_456"
  );
  
  invoker.executeCommand(customMission);

  console.log("\n" + "═".repeat(55));
  console.log(`\n📊 Celkem provedeno příkazů: ${invoker.getHistorySize()}`);
}

main();
