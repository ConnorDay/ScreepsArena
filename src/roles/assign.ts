import { Creep } from "game/prototypes";
import { BaseCreep } from "../basecreep";
import { TestRole } from "./testRole";

const roster = [
    {
        role: BaseCreep,
    },
];

export function assignCreep(creep: Creep): BaseCreep {
    return new TestRole(creep);
}
