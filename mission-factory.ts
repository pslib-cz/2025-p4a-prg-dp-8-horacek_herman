import {
  MapLoader,
  CharacterManager,
  InventoryChecker,
  SoundEffects,
  HUDManager,
} from "./subsystems";
import {
  LoadMapCommand,
  InitializeCharactersCommand,
  CheckInventoryCommand,
  PlaySoundCommand,
  SetupHUDCommand,
} from "./commands";
import { MacroCommand } from "./macro-command";

export class MissionFactory {
  private mapLoader: MapLoader;
  private characterManager: CharacterManager;
  private inventoryChecker: InventoryChecker;
  private soundEffects: SoundEffects;
  private hudManager: HUDManager;

  constructor() {
    this.mapLoader = new MapLoader();
    this.characterManager = new CharacterManager();
    this.inventoryChecker = new InventoryChecker();
    this.soundEffects = new SoundEffects();
    this.hudManager = new HUDManager();
  }

  createStartMissionCommand(
    mapName: string,
    difficulty: number,
    playerId: string
  ): MacroCommand {
    const commands = [
      new LoadMapCommand(this.mapLoader, mapName, difficulty),
      new InitializeCharactersCommand(this.characterManager, [1, 2, 3]),
      new CheckInventoryCommand(this.inventoryChecker, playerId),
      new PlaySoundCommand(this.soundEffects, "epic-battle.mp3", 0.8),
      new SetupHUDCommand(this.hudManager, {
        showHealth: true,
        showMana: true,
        showMinimap: true,
      }),
    ];

    return new MacroCommand(commands);
  }

  createLoadMapCommand(mapName: string, difficulty: number): LoadMapCommand {
    return new LoadMapCommand(this.mapLoader, mapName, difficulty);
  }

  createInitCharactersCommand(characterIds: number[]): InitializeCharactersCommand {
    return new InitializeCharactersCommand(this.characterManager, characterIds);
  }

  createCheckInventoryCommand(playerId: string): CheckInventoryCommand {
    return new CheckInventoryCommand(this.inventoryChecker, playerId);
  }

  createPlaySoundCommand(trackName: string, volume?: number): PlaySoundCommand {
    return new PlaySoundCommand(this.soundEffects, trackName, volume);
  }

  createSetupHUDCommand(config: {
    showHealth: boolean;
    showMana: boolean;
    showMinimap: boolean;
  }): SetupHUDCommand {
    return new SetupHUDCommand(this.hudManager, config);
  }
}
