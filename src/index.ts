import { Achievement, gardenEffects, hooks, Mod, Upgrade } from "cppkies"
import { name, version, ccrepo } from "../package.json"

new Mod(
	{
		keyname: name,
		version: version,
		icon: ccrepo.icon as [number, number],
		name: ccrepo.name,
	},
	function () {
		// Read the docs at https://cppkies.js.org/
		new Upgrade("Hello, World!", "My first upgrade!", 7, [10, 5])

		Game.Unlock("Hello, World!")

		new Achievement(
			"Hello, New World!",
			"Buy the <b>Hello, World!</b> upgrade!",
			[10, 5]
		)

		hooks.on("check", () => {
			if (Game.Has("Hello, World!")) Game.Win("Hello, New World!")
		})
		console.log(gardenEffects)
	}
)
