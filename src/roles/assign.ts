import { Creep } from "game/prototypes";
import { BaseCreep, Loadout } from "./basecreep";
import { TestRole } from "./testRole";

interface rosterEntry {
    role: any;
    count: number;
    my: boolean;
    composition: {
        [key in Loadout]: number;
    };
}

const roster: rosterEntry[] = [
    {
        role: TestRole,
        count: 7,
        my: true,

        composition: {
            archer: 2,
            brawler: 0,
            healer: 1,
        },
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
