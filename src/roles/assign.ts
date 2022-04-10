import { Creep } from "game/prototypes";
import { BaseCreep, Loadout } from "./basecreep";
import { Defender } from "./defender";

interface rosterEntry {
    role: any;
    my: boolean;
    composition: {
        [key in Loadout]: number;
    };
}

const roster: rosterEntry[] = [
    {
        role: Defender,
        my: true,

        composition: {
            archer: 1,
            brawler: 1,
            healer: 2,
        },
    },
];

export function assignCreep(creep: BaseCreep): BaseCreep {
    for (let entry of roster) {
        if (entry.composition[creep.loadout] > 0) {
            entry.composition[creep.loadout]--;
            return new entry.role(creep); //This needs to be updated to the creep.primitave
        }
    }
    return new BaseCreep(creep);
}
