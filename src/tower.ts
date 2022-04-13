import { AnyCreep, ResourceConstant, ScreepsReturnCode } from "game/constants";
import {
    RoomPosition,
    Store,
    Structure,
    StructureTower,
} from "game/prototypes";
import { findClosestByPath, findClosestByRange, getRange } from "game/utils";
import { Defender } from "./roles";
import { BaseCreep } from "./roles/basecreep";
import { getHighestAttackPriority, getHighestDanger } from "./utility";
import { World } from "./world";

export class Tower {
    private _primitiveTower: StructureTower;
    private static _brawlerHealed: number = 0;
    constructor(tower: StructureTower) {
        this._primitiveTower = tower;
    }

    /**
     * Priority:
     *  1. Heal the brawler if it has 400 missing health
     *  2. Attack any enemy creep that's within 5 tiles of the flag
     *  3. Heal any allied creep that's within 50 tiles of the tower and while energy is > 50%
     *  4. Attack any enemy creep that's within 50 tiles and while energy == 100%?
     */
    public run() {
        const close: BaseCreep[] = [];
        const targets: BaseCreep[] = [];

        //Populate $close and $targets
        World.enemies.forEach((c) => {
            const dist = getRange(this, c);
            if (dist <= 5) {
                close.push(c);
            } else if (dist <= 50) {
                //Should $targets also contain all of $close?
                targets.push(c);
            }
        });

        //Priority 1
        if ((this.store.getUsedCapacity("energy") as number) >= 10) {
            if (Defender.brawler && Defender.brawler.exists) {
                const brawler = Defender.brawler;
                const missingHealth = brawler.hitsMax - brawler.hits;
                if (missingHealth >= 400) {
                    this.heal(brawler.primitiveCreep);
                }
            }
        }

        //Priority 2
        if (
            close.length > 0 &&
            (this.store.getUsedCapacity("energy") as number) >= 20
        ) {
            const target = findClosestByPath(World.myFlag, close);
            this.attack(target.primitiveCreep);
            return;
        }

        //Priority 3
        if ((this.store.getUsedCapacity("energy") as number) >= 40) {
            const healTargets = this.findInRange(World.allies, 20);
            const target = getHighestDanger(healTargets);

            if (target && target.danger > 0) {
                this.heal(target.primitiveCreep);
            }
        }

        //Priority 4
        if (this.store.getUsedCapacity("energy") === 50) {
            const target = getHighestAttackPriority(targets);
            if (target) {
                this.attack(target.primitiveCreep);
            }
            return;
        }

        return; // c:
    }

    public getDamageToTarget(target: AnyCreep | BaseCreep | Structure): number {
        const dist = getRange(this, target);
        if (dist <= 5) {
            return 600;
        } else if (dist > 50) {
            return 0;
        } else if (dist >= 20) {
            return 150;
        }

        return 600 - (dist / 15) * 450;
    }

    /////////////////////////////////
    // Mappings to primitive tower //
    /////////////////////////////////

    //Getters//
    public get my(): boolean {
        return this._primitiveTower.my;
    }

    public get hits(): number {
        return this._primitiveTower.hits;
    }

    public get hitsMax(): number {
        return this._primitiveTower.hitsMax;
    }

    public get x(): number {
        return this._primitiveTower.x;
    }

    public get y(): number {
        return this._primitiveTower.y;
    }

    //Get rid of this entirely? just replace with energy/ max energy/ missing energy?
    public get store(): Store<ResourceConstant> {
        return this._primitiveTower.store;
    }

    public get cooldown(): number {
        return this._primitiveTower.cooldown;
    }

    //functions//
    public attack(target: AnyCreep | Structure): ScreepsReturnCode {
        return this._primitiveTower.attack(target);
    }

    public heal(target: AnyCreep): ScreepsReturnCode {
        return this._primitiveTower.heal(target);
    }

    public findInRange<T extends RoomPosition>(
        positions: T[],
        range: number
    ): T[] {
        return this._primitiveTower.findInRange(positions, range);
    }
}
