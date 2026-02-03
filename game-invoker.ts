import { ICommand } from "./command";

export class GameInvoker {
  private history: ICommand[] = [];

  executeCommand(command: ICommand): void {
    command.execute();
    this.history.push(command);
  }

  undoLastCommand(): void {
    const command = this.history.pop();
    if (command && command.undo) {
      command.undo();
    } else {
      console.log("⚠️ Žádný příkaz k vrácení");
    }
  }

  clearHistory(): void {
    this.history = [];
    console.log("📝 Historie příkazů vymazána");
  }

  getHistorySize(): number {
    return this.history.length;
  }
}
