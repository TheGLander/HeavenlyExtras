import Cppkies from "cppkies"

Cppkies.onLoad.push(() => {
	new Cppkies.Upgrade("Hello, World!", "My first upgrade!", 7, [10, 5])

	Game.Unlock("Hello, World!")

	new Cppkies.Achievement(
		"Hello, New World!",
		"Buy the <b>Hello, World!</b> upgrade!",
		[10, 5]
	)

	Cppkies.on("check", () => {
		if (Game.Has("Hello, World!")) Game.Win("Hello, New World!")
	})
})
