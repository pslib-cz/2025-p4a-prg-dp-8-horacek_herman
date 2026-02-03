import { ICommand } from "./command";
import {
  MapLoader,
  CharacterManager,
  InventoryChecker,
  SoundEffects,
  HUDManager,
} from "./subsystems";

export class LoadMapCommand implements ICommand {
  constructor(
    private mapLoader: MapLoader,
    private mapName: string,
    private difficulty: number
  ) {}

  execute(): void {
    this.mapLoader.loadGameMap(this.mapName, this.difficulty);
  }

  undo(): void {
    console.log(`⟲ Mapa "${this.mapName}" vyložena`);
  }
}

export class InitializeCharactersCommand implements ICommand {
  constructor(
    private characterManager: CharacterManager,
    private characterIds: number[]
  ) {}

  execute(): void {
    const success = this.characterManager.initializeCharacters(...this.characterIds);
    if (!success) {
      throw new Error("Inicializace postav selhala");
    }
  }

  undo(): void {
    console.log(`⟲ Postavy resetovány`);
  }
}

export class CheckInventoryCommand implements ICommand {
  constructor(
    private inventoryChecker: InventoryChecker,
    private playerId: string
  ) {}

  execute(): void {
    // Synchronní volání asynchronní metody pro jednoduchost
    this.inventoryChecker.checkPlayerInventory(this.playerId);
  }

  undo(): void {
    console.log(`⟲ Inventář uzavřen`);
  }
}

export class PlaySoundCommand implements ICommand {
  constructor(
    private soundEffects: SoundEffects,
    private trackName: string,
    private volume: number = 0.8
  ) {}

  execute(): void {
    this.soundEffects.playSoundtrack(this.trackName, this.volume);
  }

  undo(): void {
    console.log(`⟲ Zvuk "${this.trackName}" zastaven`);
  }
}

export class SetupHUDCommand implements ICommand {
  constructor(
    private hudManager: HUDManager,
    private config: { showHealth: boolean; showMana: boolean; showMinimap: boolean }
  ) {}

  execute(): void {
    this.hudManager.setupHUD(this.config);
  }

  undo(): void {
    console.log(`⟲ HUD skryt`);
  }
}
