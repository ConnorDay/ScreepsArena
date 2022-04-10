import { BaseCreep } from "./basecreep";

export class TestRole extends BaseCreep {
    public run(): void {
        this.speak();
    }

    private speak(): void {
        console.log("i'm a private test creep :)");
    }
}
