import { Flag } from "arena";
import { Creep, StructureTower } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import { BaseCreep } from "./roles/basecreep";
import { Tower } from "./tower";

class worldClass {
    allies: BaseCreep[] = [];
    enemies: BaseCreep[] = [];
    myTowers: Tower[] = [];
    enemyTowers: Tower[] = [];
    myStoredFlag: Flag | undefined;
    enemyStoredFlag: Flag | undefined;
    bOttOm: boolean | undefined;

    public get myFlag(): Flag {
        return this.myStoredFlag as Flag;
    }
    public get enemyFlag(): Flag {
        return this.enemyStoredFlag as Flag;
    }
}

const World = new worldClass();
export { World };
