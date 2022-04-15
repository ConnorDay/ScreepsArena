import { ERR_NOT_IN_RANGE } from "game/constants";
import { Creep, Id } from "game/prototypes";
import {
    flipPos,
    getHighestAttackPriority,
    getHighestDanger,
} from "../utility";
import { World } from "../world";
import { BaseCreep, Loadout } from "./basecreep";

export class Skirmisher extends BaseCreep {
    static lonelyArchers: Skirmisher[] = [];
    static lonelyHealers: Skirmisher[] = [];
    static ASquad: boolean = true;
    private _buddy: Skirmisher | undefined;
    public BSquad: boolean = false;
    public retreating: boolean = false;

    constructor(creep: Creep) {
        super(creep);
        // Squad up
        switch (this.loadout) {
            case Loadout.ARCHER:
                if (Skirmisher.lonelyHealers.length > 0) {
                    const temp = Skirmisher.lonelyHealers.pop() as Skirmisher;
                    this._buddy = temp;
                    temp.buddy = this;
                    Skirmisher.ASquad = !Skirmisher.ASquad;
                    this.BSquad = Skirmisher.ASquad;
                    this.buddy.BSquad = Skirmisher.ASquad;
                } else {
                    Skirmisher.lonelyArchers.push(this);
                }
                break;
            case Loadout.HEALER:
                if (Skirmisher.lonelyArchers.length > 0) {
                    const temp = Skirmisher.lonelyArchers.pop() as Skirmisher;
                    this._buddy = temp;
                    temp.buddy = this;
                    Skirmisher.ASquad = !Skirmisher.ASquad;
                    this.BSquad = Skirmisher.ASquad;
                    this.buddy.BSquad = Skirmisher.ASquad;
                } else {
                    Skirmisher.lonelyHealers.push(this);
                }
                break;
        }
    }

    private runHealer() {
        if (this.retreating) {
            if (
                this.findInRange(World.enemies, 4).length == 0 &&
                this.hits === 800 &&
                this.buddy.hits > 700
            ) {
                this.retreating = false;
                this.buddy.retreating = false;
            }
            if (this.BSquad) {
                this.moveTo(World.retreatPos);
            } else {
                this.moveTo(flipPos(World.retreatPos));
            }
        } else {
            this.moveTo(this.buddy, { ignore: [this.buddy.primitiveCreep] });
        }
        let res = this.heal(
            getHighestDanger([this, this.buddy]).primitiveCreep
        );
        if (res === ERR_NOT_IN_RANGE) {
            this.rangedHeal(this.buddy.primitiveCreep);
        }
    }

    private runArcher() {
        if (this.retreating) {
            this.moveTo(this.buddy, { ignore: [this.buddy.primitiveCreep] });
        } else {
            if (
                (this.findInRange(World.enemies, 3).length != 0 &&
                    (this.hits < 500 || this.buddy.hits < 600)) ||
                this.findInRange(World.enemies, 3).length > 3
            ) {
                this.retreating = true;
                this.buddy.retreating = true;
            }
            if (this.BSquad) {
                this.moveTo(World.enemyFlag);
            } else {
                this.moveTo(flipPos(World.enemyFlag));
            }
        }
        if (this.targets.length > 0) {
            this.rangedAttack(
                getHighestAttackPriority(this.targets).primitiveCreep
            );
        }
    }

    public run() {
        switch (this.loadout) {
            case Loadout.HEALER:
                this.runHealer();
                break;
            case Loadout.ARCHER:
                this.runArcher();
                break;
        }
    }

    public set buddy(creep: Skirmisher) {
        this._buddy = creep;
    }

    public get buddy(): Skirmisher {
        return this._buddy as Skirmisher;
    }
}
