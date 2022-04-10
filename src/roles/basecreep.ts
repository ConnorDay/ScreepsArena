import {
    AnyCreep,
    ATTACK,
    ATTACK_POWER,
    BodyPartConstant,
    CreepActionReturnCode,
    CreepMoveReturnCode,
    DirectionConstant,
    ERR_BUSY,
    ERR_INVALID_TARGET,
    ERR_NOT_OWNER,
    ERR_NO_BODYPART,
    ERR_NO_PATH,
    HEAL,
    OK,
    RANGED_ATTACK,
    RANGED_ATTACK_POWER,
    ResourceConstant,
    TOUGH,
} from "game/constants";
import { MoveToOpts } from "game/path-finder";
import {
    Creep,
    RoomPosition,
    Store,
    Structure,
    StructureTower,
} from "game/prototypes";
import { getRange, getTicks } from "game/utils";
import { match } from "ts-pattern";
import { World } from "../world";

interface possibleDamage {
    melee: number;
    ranged: number;
}

export enum Loadout {
    BRAWLER = "brawler",
    HEALER = "healer",
    ARCHER = "archer",
}

class BaseCreep extends Creep {
    //Extend creep so that we can just pass BaseCreep in to attack/ heal targets
    private _primativeCreep: Creep;
    private _loadout: Loadout;

    private _attackDamageUpdated: number = 0;
    private _possibleDamage: possibleDamage = {
        melee: 0,
        ranged: 0,
    };

    private _dangerUpdated: number = 0;
    private _danger: number = 0;
    constructor(creep: Creep) {
        super();
        this._primativeCreep = creep;
        if (this.hasPart(TOUGH)) {
            this._loadout = Loadout.BRAWLER;
        } else if (this.hasPart(HEAL)) {
            this._loadout = Loadout.HEALER;
        } else {
            this._loadout = Loadout.ARCHER;
        }
    }

    public run() {
        this.moveTo(World.enemyFlag);
    }

    public hasPart(part: BodyPartConstant): boolean {
        return this.body.some((bp) => {
            return bp.type == part;
        });
    }

    public getDamageToTarget(target: AnyCreep | Structure): number {
        const dist = getRange(this, target);
        if (dist > 3) {
            return 0;
        }

        let damage = 0;
        damage += this.possibleDamage.ranged;

        if (dist === 1) {
            damage += this.possibleDamage.melee;
        }

        return damage;
    }

    public get danger(): number {
        if (this._dangerUpdated === getTicks()) {
            return this._danger;
        }

        let damageThreat = 0;
        World.enemies.forEach((enemy) => {
            damageThreat += enemy.getDamageToTarget(this);
        });
        World.enemyTowers.forEach((tower) => {
            damageThreat += tower.getDamageToTarget(this);
        });

        const damagePercent = damageThreat / this.hits;
        const damageTaken = this.hitsMax - this.hits;
        const danger = damageTaken + damageTaken * damagePercent;

        this._danger = danger;
        this._dangerUpdated = getTicks();
        return danger;
    }

    public get possibleDamage(): possibleDamage {
        if (this._attackDamageUpdated === getTicks()) {
            return this._possibleDamage;
        }

        let meleeParts = 0;
        let rangedParts = 0;

        this.body.forEach((part) => {
            if (part.hits > 0) {
                if (part.type === ATTACK) {
                    meleeParts++;
                } else if (part.type === RANGED_ATTACK) {
                    rangedParts++;
                }
            }
        });

        this._possibleDamage = {
            melee: ATTACK_POWER * meleeParts,
            ranged: RANGED_ATTACK_POWER * rangedParts,
        };
        this._attackDamageUpdated = getTicks();
        return this._possibleDamage;
    }

    public get loadout(): Loadout {
        return this._loadout;
    }

    public get targets(): BaseCreep[] {
        let res: BaseCreep[] = [];
        match(this.loadout)
            .with(
                Loadout.BRAWLER,
                () => (res = this.findInRange(World.enemies, 1))
            )
            .with(
                Loadout.ARCHER,
                () => (res = this.findInRange(World.enemies, 3))
            )
            .with(
                Loadout.HEALER,
                () => (res = this.findInRange(World.allies, 3))
            );
        return res;
    }

    public get primitiveCreep(): Creep {
        return this._primativeCreep;
    }

    /////////////////////////////////
    // Mappings to primitive creep //
    /////////////////////////////////

    //Getters//
    public get hits(): number {
        return this._primativeCreep.hits;
    }

    public get hitsMax(): number {
        return this._primativeCreep.hitsMax;
    }

    public get my(): boolean {
        return this._primativeCreep.my;
    }

    public get fatigue(): number {
        return this._primativeCreep.fatigue;
    }

    public get body(): Array<{ type: BodyPartConstant; hits: number }> {
        return this._primativeCreep.body;
    }

    public get store(): Store<ResourceConstant> {
        return this._primativeCreep.store;
    }

    public get x(): number {
        return this._primativeCreep.x;
    }

    public get y(): number {
        return this._primativeCreep.y;
    }

    //Functions//
    public move(direction: DirectionConstant): CreepMoveReturnCode | undefined {
        return this._primativeCreep.move(direction);
    }

    public moveTo(
        target: RoomPosition,
        opts?: MoveToOpts
    ): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | undefined {
        return this._primativeCreep.moveTo(target, opts);
    }

    public rangedAttack(target: AnyCreep | Structure): CreepActionReturnCode {
        return this._primativeCreep.rangedAttack(target);
    }

    public rangedMassAttack(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NO_BODYPART {
        return this._primativeCreep.rangedMassAttack();
    }

    public attack(target: AnyCreep | Structure): CreepActionReturnCode {
        return this._primativeCreep.attack(target);
    }

    public heal(target: AnyCreep): CreepActionReturnCode {
        return this._primativeCreep.heal(target);
    }

    public rangedHeal(target: AnyCreep): CreepActionReturnCode {
        return this._primativeCreep.rangedHeal(target);
    }

    public findInRange<T extends RoomPosition>(
        positions: T[],
        range: number
    ): T[] {
        return this._primativeCreep.findInRange(positions, range);
    }
}

export { BaseCreep };
