import { Creep, Id } from "game/prototypes";
import { getHighestAttackPriority, getHighestDanger } from "../utility";
import { World } from "../world";
import { BaseCreep, Loadout } from "./basecreep";

export class Skirmisher extends BaseCreep {
    static lonelyArchers: Skirmisher[];
    static lonelyHealers: Skirmisher[];
    static ASquad: boolean = true;
    private _BSquad: boolean = false;
    private _buddy: Skirmisher | undefined;
    public retreating: boolean = false;

    constructor(creep: Creep) {
        super(creep);
        // Squad up
        switch (this.loadout) {
            case Loadout.ARCHER:
                if (Skirmisher.lonelyHealers.length > 0) {
                    const temp = Skirmisher.lonelyHealers.pop() as Skirmisher;
                    this.buddy = temp;
                    temp.buddy = this;
                    Skirmisher.ASquad = !Skirmisher.ASquad;
                    this._BSquad = Skirmisher.ASquad;
                    (<Skirmisher>this.buddy)._BSquad = Skirmisher.ASquad;
                } else {
                    Skirmisher.lonelyArchers.push(this);
                }
                break;
            case Loadout.HEALER:
                if (Skirmisher.lonelyArchers.length > 0) {
                    const temp = Skirmisher.lonelyArchers.pop() as Skirmisher;
                    this._buddy = temp;
                    temp._buddy = this;
                    Skirmisher.ASquad = !Skirmisher.ASquad;
                    this._BSquad = Skirmisher.ASquad;
                    (<Skirmisher>this.buddy)._BSquad = Skirmisher.ASquad;
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
                this.hits > 600 &&
                this.buddy.hits > 600
            ) {
                this.retreating = false;
                this.buddy.retreating = false;
            }
            this.moveTo(World.retreatPos);
        } else {
            this.moveTo(this.buddy);
        }
        this.heal(getHighestDanger([this, this.buddy]).primitiveCreep);
    }

    private runArcher() {
        if (this.retreating) {
            this.moveTo(this.buddy);
        } else {
            if (
                (this.findInRange(World.enemies, 3).length != 0 &&
                    this.hits < 500) ||
                this.buddy.hits < 600
            ) {
                this.retreating = true;
                this.buddy.retreating = true;
            }
            this.moveTo(World.attackPos);
        }
        this.rangedAttack(
            getHighestAttackPriority(this.targets).primitiveCreep
        );
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
