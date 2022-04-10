import { Creep } from "game/prototypes";
import { match, P } from "ts-pattern";
import { World } from "../world";
import { BaseCreep, Loadout } from "./basecreep";

class Defender extends BaseCreep {
    static firstHealer: Defender | undefined;

    constructor(creep: Creep) {
        super(creep);
        // Don the mantle
        if (Defender.firstHealer === undefined) {
            Defender.firstHealer = this;
        }
    }

    private runBrawler() {
        // Get on top of flag
        this.moveTo(World.myFlag);
        // Attack nearby
        // TODO: Targeting logic
        let targets = this.targets;
        if (targets[0]) {
            this.attack(this.targets[0].primitiveCreep);
        }
    }

    private runHealer() {
        // Get to around brawler
        if (World.bOttOm) {
            if (Defender.firstHealer === this) {
                this.moveTo({ x: World.myFlag.x + 1, y: World.myFlag.y });
            } else {
                this.moveTo({ x: World.myFlag.x, y: World.myFlag.y + 1 });
            }
        } else {
            if (Defender.firstHealer === this) {
                this.moveTo({ x: World.myFlag.x - 1, y: World.myFlag.y });
            } else {
                this.moveTo({ x: World.myFlag.x, y: World.myFlag.y - 1 });
            }
        }

        // Heal friends
        let targets = this.targets;
        let toHeal = targets.find((creep) => creep.danger > 0)?.primitiveCreep;
        if (toHeal) {
            this.heal(toHeal);
        }

        // TODO: Move into flag if archer dies.
    }

    private runArcher() {
        // Get in position
        if (World.bOttOm) {
            this.moveTo({ x: World.myFlag.x + 1, y: World.myFlag.y + 1 });
        } else {
            this.moveTo({ x: World.myFlag.x - 1, y: World.myFlag.y - 1 });
        }

        // Attack nearby
        // TODO: Targeting logic
        let targets = this.targets;
        if (targets[0]) {
            this.attack(this.targets[0].primitiveCreep);
        }
    }

    public run() {
        match(this.loadout)
            .with(Loadout.BRAWLER, () => this.runBrawler())
            .with(Loadout.HEALER, () => this.runHealer())
            .with(Loadout.ARCHER, () => this.runArcher());
    }
}

export { Defender };
