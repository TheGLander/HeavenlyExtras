import {
	Achievement,
	HeavenlyUpgrade,
	hooks,
	injectCode,
	injectCodes,
	miscValues,
	Mod,
	Upgrade,
} from "cppkies"
import { name, version, ccrepo } from "../package.json"

const webPath = true
	? "http://localhost:5500/assets"
	: "https://glander.club/heavenlyExtras"

function getModPath(): string {
	if (!App) return webPath
	const steamMod = App.mods[name]
	if (!steamMod) return webPath
	// This is awful, sorry
	// This finds the second-to-last instance of the forward slash, so
	// ./a/b/c/mods/local/gaming gets local/gaming
	// A lastIndexOf which matches / and \
	function lastIndexOf(str: string, pos?: number): number {
		const forward = str.lastIndexOf("/", pos)
		const backward = str.lastIndexOf("\\", pos)
		return Math.max(forward, backward)
	}
	const splitPoint =
		lastIndexOf(steamMod.dir, lastIndexOf(steamMod.dir) - 1) + 1
	return `../mods/${steamMod.dir.slice(splitPoint)}`
}

function getResource(name: string): string {
	return `${getModPath()}/${name}`
}
new Mod(
	{
		keyname: name,
		version: version,
		icon: ccrepo.icon as [number, number],
		name: ccrepo.name,
	},
	function () {
		miscValues.iconLink = getResource("icons.png")
		new HeavenlyUpgrade(
			"Glass casing",
			"The <b>shimmering veil</b> now has a <b>95%</b> chance not to break, but turning it on costs 7 days of CpS.",
			1,
			[0, 0],
			[-548, 730],
			["Glittering edge"]
		)
		Game.getVeilDefense = injectCode(
			Game.getVeilDefense,
			"return n;",
			'if (Game.Has("Glass casing")) n = 0.95;\n',
			"before"
		)
		if (Game.Upgrades["Shimmering veil [off]"].priceFunc) {
			Game.Upgrades["Shimmering veil [off]"].priceFunc = injectCode(
				Game.Upgrades["Shimmering veil [off]"].priceFunc,
				"Game.unbuffedCps",
				'(Game.Has("Glass casing") ? 7 : 1) *',
				"before"
			)
		}
		if (Game.Upgrades["Shimmering veil [off]"].descFunc) {
			const newFunc = injectCodes(
				Game.Upgrades["Shimmering veil [off]"].descFunc,
				[
					[
						"24*60*60*Game.fps",
						'(Game.Has("Glass casing") ? 7 : 1) *',
						"before",
					],
					[",2)", ', Game.Has("Glass casing") ? 1 : 2)', "replace"],
				]
			)
			Game.Upgrades["Shimmering veil [off]"].descFunc = Game.Upgrades[
				"Shimmering veil [on]"
			].descFunc = newFunc
		}
		const invisibleMilk = new HeavenlyUpgrade(
			"Invisible milk",
			"Milk is <b>5%</b> stronger. Unlocks a new milk selection. <q>blah blah blah...</q>",
			1,
			[1, 0],
			[-48, 334],
			["Fanciful dairy selection"]
		)
		hooks.on("effs", () => ({ milk: invisibleMilk.bought ? 1.05 : 1 }))
		Game.AllMilks.push({
			bname: "No milk",
			name: loc("No milk"),
			icon: [1, 0, miscValues.iconLink],
			pic: getResource("void.png"),
			type: 1,
		})
	}
)
