import { Flag } from "arena/prototypes";
import { Creep, StructureTower } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";
import { BaseCreep } from "./roles/basecreep";
import { Tower } from "./tower";
import { World } from "./world";

export function init() {
    const creeps = getObjectsByPrototype(Creep).map((c) => new BaseCreep(c));
    World.allies = creeps.filter((c) => c.my);
    World.enemies = creeps.filter((c) => !c.my);

    const towers = getObjectsByPrototype(StructureTower).map(
        (t) => new Tower(t)
    );
    World.myTowers = towers.filter((t) => t.my);
    World.enemyTowers = towers.filter((t) => !t.my);

    const flags = getObjectsByPrototype(Flag);
    World.myStoredFlag = flags.find((f) => f.my);
    World.enemyStoredFlag = flags.find((f) => !f.my);
    if (World.myFlag.x > 10) {
        World.bOttOm = true;
    } else {
        World.bOttOm = false;
    }
}
