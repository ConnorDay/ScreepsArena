import { Creep } from "game/prototypes";
import { BaseCreep } from "./basecreep";
import { TestRole } from "./testRole";

interface rosterEntry {
    role: any;
    count: number;
}

const roster: rosterEntry[] = [
    {
        role: TestRole,
        count: 7,
    },
];

export function assignCreep(creep: Creep): BaseCreep {
    for (let entry of roster) {
        if (entry.count > 0) {
            entry.count--;
            return new entry.role(creep);
        }
    }
    return new BaseCreep(creep);
}
