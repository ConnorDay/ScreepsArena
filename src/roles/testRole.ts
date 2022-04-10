<<<<<<< HEAD
import { BaseCreep } from "./basecreep";

export class TestRole extends BaseCreep {
    public run(): void {
        this.speak();
    }

    private speak(): void {
        console.log("i'm a private test creep :)");
    }
=======
import { BaseCreep } from "../basecreep";

export class TestRole extends BaseCreep {
	public run(): void {
		this.speak();
	}

	private speak(): void {
		console.log("i'm a private test creep :)");
	}
>>>>>>> fa1af1a (commit)
}
