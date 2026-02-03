import { ICommand } from "./command";

export class MacroCommand implements ICommand {
  private commands: ICommand[] = [];

  constructor(commands: ICommand[]) {
    this.commands = commands;
  }

  execute(): void {
    console.log("🎮 Spouštím herní misi...\n");
    for (const command of this.commands) {
      command.execute();
    }
    console.log("\n✅ Mise úspěšně spuštěna!");
  }

  undo(): void {
    console.log("\n⟲ Vracím změny mise...\n");
    for (let i = this.commands.length - 1; i >= 0; i--) {
      if (this.commands[i].undo) {
        this.commands[i].undo!();
      }
    }
    console.log("\n✅ Změny vráceny!");
  }

  addCommand(command: ICommand): void {
    this.commands.push(command);
  }

  removeCommand(command: ICommand): void {
    const index = this.commands.indexOf(command);
    if (index > -1) {
      this.commands.splice(index, 1);
    }
  }
}
