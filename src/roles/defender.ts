import { Creep, Id, RoomPosition } from "game/prototypes";
import {} from "game/visual";
import { getHighestAttackPriority } from "../utility";
import { World } from "../world";
import { BaseCreep, Loadout } from "./basecreep";

export class Defender extends BaseCreep {
    public static firstHealer: BaseCreep;
    public static secondHealer: BaseCreep;
    public static brawler: BaseCreep;
    public static archer: BaseCreep;

    constructor(creep: Creep) {
        super(creep);

        // Don the mantle
        switch (this.loadout) {
            case Loadout.ARCHER:
                Defender.archer = this;
                break;
            case Loadout.BRAWLER:
                Defender.brawler = this;
                break;
            case Loadout.HEALER:
                if (Defender.firstHealer === undefined) {
                    Defender.firstHealer = this;
                } else {
                    //I don't know if we'll ever need the second healer, but might as well populate it
                    Defender.secondHealer = this;
                }
                break;
        }
    }

    private runBrawler() {
        // Get on top of flag
        this.moveTo(World.myFlag);
        // Attack nearby
        let target = getHighestAttackPriority(this.targets);
        if (target) {
            this.attack(target.primitiveCreep);
        }
    }

    private runHealer() {
        let moveTarget: RoomPosition;
        // Get to around brawler
        if (World.bOttOm) {
            if (Defender.firstHealer.id === this.id) {
                moveTarget = { x: World.myFlag.x + 1, y: World.myFlag.y };
            } else {
                moveTarget = { x: World.myFlag.x, y: World.myFlag.y + 1 };
            }
        } else {
            if (Defender.firstHealer.id === this.id) {
                moveTarget = { x: World.myFlag.x - 1, y: World.myFlag.y };
            } else {
                moveTarget = { x: World.myFlag.x, y: World.myFlag.y - 1 };
            }
        }

        //Give up their life for the flag
        if (!Defender.brawler.exists && !Defender.archer.exists) {
            if (this.id === Defender.firstHealer.id) {
                moveTarget = World.myFlag as RoomPosition;
            } else if (!Defender.firstHealer.exists) {
                moveTarget = World.myFlag as RoomPosition;
            }
        }

        this.moveTo(moveTarget);

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
        let moveTarget: RoomPosition;
        if (World.bOttOm) {
            moveTarget = { x: World.myFlag.x + 1, y: World.myFlag.y + 1 };
        } else {
            moveTarget = { x: World.myFlag.x - 1, y: World.myFlag.y - 1 };
        }

        // Move onto the flag if the brawler is dead
        if (!Defender.brawler.exists) {
            moveTarget = World.myFlag as RoomPosition;
        }

        this.moveTo(moveTarget);

        // Attack nearby
        let target = getHighestAttackPriority(this.targets);
        if (target) {
            this.rangedAttack(target.primitiveCreep);
        }
    }

    public run() {
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
