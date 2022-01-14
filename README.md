# BitBurnerTS

This project contains the files I am writing for playing [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/). I have configured this project to use TypeScript. 

## How to use this project

You can copy my repo and just delete the contents of the ts/ and js/ folders, which contain my scripts. You don't want them. Write your own.

Leave the types/ folder because it contains the types needed for the game.

When you want to use a type, you'll need to import it, at least with my configuration.

```ts
  import { NS } from "../types/NetscriptDefinitions";
  
  export async function main(ns: NS) : Promise<void> {
    ...
  }
```

You'll need npm. Just run npm install to install the dependencies. Then just use

tsc -w

to watch your changes and compile. 

If you use the VSCode extension for Bitburner, you can have it automatically upload your outputted JS files to the game.
