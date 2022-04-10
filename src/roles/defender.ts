import { Creep } from "game/prototypes";
import { match, P } from "ts-pattern";
import { BaseCreep, Loadout } from "./basecreep";

class Defender extends BaseCreep {
    constructor(creep: Creep) {
        super(creep);
    }

    private run_brawler() {}

    private run_healer() {}

    private run_archer() {}

    public run() {
        match(this.loadout)
            .with(Loadout.BRAWLER, () => this.run_brawler())
            .with(Loadout.HEALER, () => this.run_healer())
            .with(Loadout.ARCHER, () => this.run_archer());
    }
}
