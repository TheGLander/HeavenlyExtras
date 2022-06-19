#!/usr/bin/env node

const fs = require("fs")
const os = require("os")
const path = require("path")
const { execSync } = require("child_process")

function copyDir(src, dest) {
	fs.mkdirSync(dest, { recursive: true })
	const entries = fs.readdirSync(src, { withFileTypes: true })

	for (const entry of entries) {
		const srcPath = path.join(src, entry.name)
		const destPath = path.join(dest, entry.name)

		entry.isDirectory()
			? copyDir(srcPath, destPath)
			: fs.copyFileSync(srcPath, destPath)
	}
}
const dir = fs.mkdtempSync(os.tmpdir() + path.sep)
function exists(file) {
	try {
		fs.statSync(file)
		return true
	} catch {
		return false
	}
}

copyDir("assets", dir)
fs.copyFileSync("dist/index.js", path.join(dir, "main.js"))

const package = JSON.parse(fs.readFileSync("package.json", "utf-8"))

const [major, minor, patch] = package.version
	.split(".")
	.map(val => parseInt(val))

function padTo2Digits(num) {
	return num.toString().padStart(2, "0")
}

function formatDate(date) {
	return [
		padTo2Digits(date.getDate()),
		padTo2Digits(date.getMonth() + 1),
		date.getFullYear(),
	].join("/")
}

const infoTxt = {
	Name: package.ccrepo?.name ?? package.name,
	ID: package.name,
	Author: package.author,
	Description: package.description,
	Version: major * 1_000_000_000 + minor * 1_000_000 + patch * 1_000,
	GameVersion: 2.048,
	Date: formatDate(new Date()),
}

fs.writeFileSync(path.join(dir, "info.txt"), JSON.stringify(infoTxt), "utf-8")

if (exists("mod.zip")) fs.rmSync("mod.zip")

execSync(`zip -r mod.zip "${dir}"`)

fs.rmSync(dir, { recursive: true })
