import { Flag } from "arena";
import { getTicks } from "game";
import { Creep, StructureTower } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import { BaseCreep } from "./roles/basecreep";
import { Tower } from "./tower";

class worldClass {
    private _allies: BaseCreep[] = [];
    private _alliesUpdated: number = 0;
    private _alliesAlive: BaseCreep[] = [];

    private _enemies: BaseCreep[] = [];
    private _enemiesUpdated: number = 0;
    private _enemiesAlive: BaseCreep[] = [];

    myTowers: Tower[] = [];
    enemyTowers: Tower[] = [];
    myStoredFlag: Flag | undefined;
    enemyStoredFlag: Flag | undefined;
    bOttOm: boolean | undefined;

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

    public get myFlag(): Flag {
        return this.myStoredFlag as Flag;
    }
    public get enemyFlag(): Flag {
        return this.enemyStoredFlag as Flag;
    }
}

const World = new worldClass();
export { World };
