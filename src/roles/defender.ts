import { Creep, Id } from "game/prototypes";
import { circle, text } from "game/visual";
import { World } from "../world";
import { BaseCreep, Loadout } from "./basecreep";

class Defender extends BaseCreep {
    static firstHealer: Id<Creep> | undefined;

    constructor(creep: Creep) {
        super(creep);
        // Don the mantle
        if (
            Defender.firstHealer === undefined &&
            this.loadout === Loadout.HEALER
        ) {
            Defender.firstHealer = this.id;
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
            if (Defender.firstHealer === this.id) {
                this.moveTo({ x: World.myFlag.x + 1, y: World.myFlag.y });
            } else {
                this.moveTo({ x: World.myFlag.x, y: World.myFlag.y + 1 });
            }
        } else {
            if (Defender.firstHealer === this.id) {
                this.moveTo({ x: World.myFlag.x - 1, y: World.myFlag.y });
            } else {
                this.moveTo({ x: World.myFlag.x, y: World.myFlag.y - 1 });
            }
        }

        // Heal friends
        let targets = this.targets.map((c) => {
            const ret = { creep: c, danger: c.danger };
            switch (c.loadout) {
                case Loadout.BRAWLER:
                    ret.danger *= 2;
                    break;
                case Loadout.HEALER:
                    ret.danger *= 1.5;
                    break;
            }
            return ret;
        });
        let toHeal = targets.sort((prev, next) => {
            return next.danger - prev.danger;
        })[0]?.creep.primitiveCreep;
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
        text(
            `${this.danger}`,
            { x: this.x, y: this.y - 0.5 },
            {
                font: "0.5",
                opacity: 0.7,
            }
        );
        switch (this.loadout) {
            case Loadout.BRAWLER:
                this.runBrawler();
                break;
            case Loadout.HEALER:
                this.runHealer();
                break;
            case Loadout.ARCHER:
                this.runArcher();
                break;
        }
    }
}

export { Defender };
