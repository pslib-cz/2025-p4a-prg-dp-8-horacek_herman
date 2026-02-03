# Command Pattern - Herní Mise

Implementace návrhového vzoru **Command** pro systém spouštění herních misí.

## 📋 Zadání

Vytvořit systém, který umožní hráči rychle spustit herní misi. Mise vyžaduje postupnou aktivaci několika subsystémů:
- 🗺️ Načíst mapu
- 👥 Inicializovat postavy
- 🎒 Zkontrolovat inventář
- 🔊 Spustit zvukové efekty
- 📊 Nastavit herní HUD

### Požadavky
- ✅ Jednoduché spuštění mise jedním příkazem
- ✅ Možnost spustit jednotlivé subsystémy samostatně
- ✅ Různé rozhraní subsystémů (různí vývojáři)

## 🏗️ Struktura projektu

```
├── command.ts           # Rozhraní ICommand
├── commands.ts          # Konkrétní příkazy pro subsystémy
├── subsystems.ts        # Dummy třídy subsystémů
├── macro-command.ts     # MacroCommand pro seskupení příkazů
├── game-invoker.ts      # Invoker pro spouštění příkazů
├── mission-factory.ts   # Factory pro vytváření misí
├── game.ts             # 🎮 Herní RPG adventura (hlavní) ⭐
├── game-world.ts       # Herní svět a stav
├── game-commands.ts    # Herní příkazy (pohyb, boj, atd.)
├── interactive.ts      # Interaktivní menu (technická demo)
├── main.ts             # Demo verze (automatické scénáře)
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Použití Command Pattern

### Základní komponenty:

1. **ICommand** - rozhraní s metodou `execute()`
2. **Concrete Commands** - konkrétní příkazy (LoadMapCommand, InitializeCharactersCommand, atd.)
3. **MacroCommand** - spouští více příkazů najednou
4. **GameInvoker** - spouští příkazy a udržuje historii
5. **MissionFactory** - zjednodušuje vytváření příkazů

## 🚀 Instalace a spuštění

```bash
# Instalace závislostí
npm install

# Spuštění interaktivní aplikace
npm start

# Spuštění demo verze (automatické scénáře)
npm run demo

## 🎮 Herní režim

**Textová RPG adventura** s Command Pattern:
- 🏰 Prozkoumejte jeskyni (mapa 5×5)
- ⚔️  Bojujte s nepřáteli (Goblin, Ork, Troll)
- 📦 Sbírejte předměty (zbraně, lektvary, poklady)
- 💰 Získávejte zlato
- 🎒 Spravujte inventář
- ⟲ Použijte UNDO pro vrácení akcí

**Všechny herní akce používají Command Pattern!**

Spusťte pomocí `npm start` a začněte hrát!

### Ovládání:
- `s, j, v, z` - pohyb (sever, jih, východ, západ)
- `utok` - zaútočit na nepřítele
- `seber` - sebrat předmět
- `mapa` - zobrazit mapu
- `inventar` - zobrazit inventář
- `help` - zobrazit všechny příkazy

## 💡 Příklady použití (programově)ode
npx ts-node interactive.ts  # Interaktivní
npx ts-node main.ts         # Demo
```

## 💡 Příklady použití

### Jednoduchý start mise (běžný uživatel)
```typescript
const factory = new MissionFactory();
const invoker = new GameInvoker();

const startMission = factory.createStartMissionCommand(
  "Forest Temple",
  3,
  "player_123"
);

invoker.executeCommand(startMission);
```

### Individuální příkazy (pokročilý uživatel)
```typescript
invoker.executeCommand(factory.createLoadMapCommand("Desert Arena", 5));
invoker.executeCommand(factory.createInitCharactersCommand([10, 11, 12]));
invoker.executeCommand(factory.createPlaySoundCommand("desert-wind.mp3", 0.6));
```

### Undo funkcionalita
```typescript
invoker.undoLastCommand(); // Vrátí poslední provedený příkaz
```

## ✅ Výhody použití Command Pattern

1. **Oddělení volajícího od příjemce** - GameInvoker nemusí znát detaily subsystémů
2. **Jednoduché použití** - jedna metoda pro spuštění celé mise
3. **Flexibilita** - možnost individuálního volání subsystémů
4. **Undo/Redo** - snadná implementace vracení akcí
5. **Historie příkazů** - možnost sledovat provedené akce
6. **Macro příkazy** - seskupení více příkazů do jednoho
7. **Rozšiřitelnost** - snadné přidání nových příkazů

## 📚 Návrhový vzor Command

**Command** pattern zapouzdřuje požadavek jako objekt, což umožňuje:
- Parametrizovat klienty s různými požadavky
- Zařazovat požadavky do fronty
- Logovat požadavky
- Podporovat operace undo

### UML diagram (zjednodušeně)
```
┌─────────────┐
│  ICommand   │
├─────────────┤
│ +execute()  │
│ +undo()?    │
└──────▲──────┘
       │
       ├──────────────┬──────────────┬──────────────┐
       │              │              │              │
┌──────┴──────┐ ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐
│LoadMapCmd   │ │InitChar  │  │CheckInv  │  │MacroCmd  │
├─────────────┤ │Cmd       │  │Cmd       │  ├──────────┤
│+execute()   │ ├──────────┤  ├──────────┤  │commands[]│
└─────────────┘ │+execute()│  │+execute()│  │+execute()│
                └──────────┘  └──────────┘  └──────────┘
```

## 🎓 Pro školu

Tento projekt demonstruje:
- ✅ Použití návrhového vzoru Command
- ✅ TypeScript best practices
- ✅ SOLID principy (zejména Single Responsibility, Open/Closed)
- ✅ Separation of Concerns
- ✅ Factory pattern (bonus)
- ✅ Macro/Composite Command pattern

---

**Autor:** Pavel Horáček  
**Datum:** 3. února 2026
