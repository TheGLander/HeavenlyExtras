# CppkiesModExample

Welcome! This is a small template repository for creating typescript cookie clicker mods!

To start and work on it, just download the repository!

After that, do these simple steps:

- Make sure to have Node.js and npm installed (You can download them [here](https://nodejs.org/download/))
- Do `npm i` to install all the dependencies
- You are almost done! Do modifications to the `src` folder (modify `index.ts`, etc.) and use `npm run build` to rebuild the code!
- You should use some serving thing to easily load your mod locally, some suggestions include:
  - The `serve` CLI, which you can install via `npm i -g serve`, then you can just do `serve -p 5500`!
  - The [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) Visual Studio Code extension, which is easily installed, and then you can just click the _"Go live"_ button!
- After setting up the local server, you can open the console on the cookie clicker website, and type `Game.LoadMod("http://localhost:5500/dist/index.js")`(assuming you are serving on port 5500, change if needed)!
