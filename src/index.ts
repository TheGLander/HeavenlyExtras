import {
	Achievement,
	CookieUpgrade,
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
		//#region Glass casing
		new HeavenlyUpgrade(
			"Glass casing",
			"The <b>shimmering veil</b> is very resistent, and has a <b>95%</b> chance not to break, but turning it on costs 7 days of CpS. <q>made from the sturdiest glass around. which also happens to be the glass that shatters into a million razor sharp pieces. just be careful</q>",
			150_000_000_000_000_000,
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
		//#endregion
		//#region Invisible milk
		const invisibleMilk = new HeavenlyUpgrade(
			"Invisible milk",
			"Milk is <b>5%</b> stronger. Unlocks a new milk selection. <q>it's like its not even there!</q>",
			3_000_000,
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
			requirement() {
				return invisibleMilk.bought
			},
		} as Game.Milk)
		const milkSelector = Game.Upgrades["Milk selector"] as Game.SelectorSwitch
		milkSelector.choicesFunction = injectCode(
			milkSelector.choicesFunction,
			"if (it.rank && it.rank>maxRank) choices[i]=0;",
			"\n;if (it.requirement && !it.requirement()) choices[i] = 0;\n",
			"after"
		)
		//#endregion
		//#region Cookie cookie
		const unshackledFEHU = Game.Upgrades[
			"Unshackled fractal engines"
		] as Game.HeavenlyUpgrade
		function countCookieUpgrades(): number {
			return Game.cookieUpgrades.filter(val => val.bought).length
		}
		const cookieCookie = new HeavenlyUpgrade(
			"Cookie cookie",
			() =>
				`Cookie production <b>+1%</b> per cookie upgrade. Current boost: <b>+${countCookieUpgrades()}%</b><q>a cookie which's chocolate chips have been replaced with cookies, which's chocolate chips have also been replaced with cookies, and so on.</q>`,
			5_000_000_000_000_000,
			[2, 0],
			[unshackledFEHU.posX, unshackledFEHU.posY + 106],
			["Unshackled fractal engines"]
		)
		cookieCookie.pseudoCookie = true
		cookieCookie.power = countCookieUpgrades
		Game.cookieUpgrades.push(cookieCookie)
		//#endregion
		//#region Super "egg"
		new HeavenlyUpgrade(
			'super "egg"',
			'The "egg" upgrade also gives <b>0.09%</b> of Prestige Level as CpS. <q>hey, it\'s super "egg"</q>',
			9_000_000_000_000_000,
			[0, 1],
			[-668, 174],
			["Starspawn"]
		)
		Game.CalculateGains = injectCode(
			Game.CalculateGains,
			`Game.cookiesPs+=9;Game.cookiesPsByType['"egg"']=9;`,
			`const eggCps = 9 + (Game.Has('super "egg"') ? 0.0009 * Game.prestige : 0)
			Game.cookiesPs += eggCps;
			Game.cookiesPsByType['"egg"'] = eggCps;`,
			"replace"
		)
		//#endregion
		//#region Lump booster
		const lumpBoosterHU = new HeavenlyUpgrade(
			"Lump booster",
			"Unlocks the <b>lump booster</b>, which boosts the amount of time for a lump to ripe (not fall) by <b>half</b>, at the expense of <b>-95%</b>.<q>using almost all of your power and resources, you've managed to significantly speed up the growth of your sugar lumps!</q>",
			800_000_000_000,
			[2, 1],
			[121, -1420],
			["Sucralosia Inutilis"]
		)
		const lumpBoosterOn = new Upgrade(
			"Lump booster [on]",
			"The lump booster is <b>on</b>, <b>halving</b> lump ripe time, in exchange for <b>-95%</b> of CpS.",
			() => Game.unbuffedCps * 60 * 60 * 24,
			[2, 1],
			Game.computeLumpTimes
		) as Game.LayeredSwitch
		lumpBoosterOn.pool = "toggle"
		lumpBoosterOn.toggleInto = "Lump booster [off]"
		const lumpBoosterOff = new Upgrade(
			"Lump booster [off]",
			"Turning this on will <b>half</b> the time required for a sugar lump to mature, but takes up <b>-95%</b> of CpS.",
			() => Game.unbuffedCps * 60 * 60 * 24,
			[2, 2],
			Game.computeLumpTimes
		) as Game.LayeredSwitch
		lumpBoosterOff.pool = "toggle"
		lumpBoosterOff.toggleInto = "Lump booster [on]"
		lumpBoosterOn.order = lumpBoosterOff.order = 40100
		Game.computeLumpTimes = injectCode(
			Game.computeLumpTimes,
			null,
			`\n;if (Game.Has("Lump booster [off]")) {
				Game.lumpMatureAge /= 2;
				Game.lumpRipeAge /= 2;
			}`,
			"after"
		)
		hooks.on("cps", cps => (lumpBoosterOff.bought ? 0.05 : 1) * cps)
		hooks.on("reincarnate", () => {
			if (lumpBoosterHU.bought) {
				lumpBoosterOn.earn()
				lumpBoosterOff.unlock()
				Game.computeLumpTimes()
			}
		})
		//#endregion
	}
)
