import { Flag } from "arena";
import { getTicks } from "game";
import {
    Creep,
    GameObject,
    RoomPosition,
    StructureTower,
} from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import { BaseCreep } from "./roles/basecreep";
import { Tower } from "./tower";

export class worldClass {
    private _allies: BaseCreep[] = [];
    private _alliesUpdated: number = 0;
    private _alliesAlive: BaseCreep[] = [];

    private _enemies: BaseCreep[] = [];
    private _enemiesUpdated: number = 0;
    private _enemiesAlive: BaseCreep[] = [];

    private _myTowers: Tower[] = [];
    private _myTowersUpdated: number = 0;
    private _myTowersStanding: Tower[] = [];

    private _enemyTowers: Tower[] = [];
    private _enemyTowersUpdated: number = 0;
    private _enemyTowersStanding: Tower[] = [];

    myStoredFlag: Flag | undefined;
    enemyStoredFlag: Flag | undefined;
    bOttOm: boolean | undefined;
    attackPos: RoomPosition = { x: 0, y: 0 };
    retreatPos: RoomPosition = { x: 0, y: 0 };

    public get allies(): BaseCreep[] {
        if (this._alliesUpdated === getTicks()) {
            return this._alliesAlive;
        }
        this._alliesUpdated = getTicks();
        this._alliesAlive = this._allies.filter((c) => c.exists);
        return this._alliesAlive;
    }
    public set allies(a: BaseCreep[]) {
        this._allies = a;
    }

    public get enemies(): BaseCreep[] {
        if (this._enemiesUpdated === getTicks()) {
            return this._enemiesAlive;
        }
        this._enemiesUpdated = getTicks();
        this._enemiesAlive = this._enemies.filter((c) => c.exists);
        return this._enemiesAlive;
    }
    public set enemies(a: BaseCreep[]) {
        this._enemies = a;
    }

    public get myTowers(): Tower[] {
        if (this._myTowersUpdated === getTicks()) {
            return this._myTowersStanding;
        }
        this._myTowersUpdated = getTicks();
        this._myTowersStanding = this._myTowers.filter((t) => t.exists);
        return this._myTowersStanding;
    }
    public set myTowers(towers: Tower[]) {
        this._myTowers = towers;
    }

    public get enemyTowers(): Tower[] {
        if (this._enemyTowersUpdated === getTicks()) {
            return this._enemyTowersStanding;
        }
        this._enemyTowersUpdated = getTicks();
        this._enemyTowersStanding = this._enemyTowers.filter((t) => t.exists);
        return this._enemyTowersStanding;
    }
    public set enemyTowers(towers: Tower[]) {
        this._enemyTowers = towers;
    }

    public get myFlag(): Flag {
        return this.myStoredFlag as Flag;
    }
    public get enemyFlag(): Flag {
        return this.enemyStoredFlag as Flag;
    }
}

const World = new worldClass();
export { World };
