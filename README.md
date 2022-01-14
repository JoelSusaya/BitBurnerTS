# BitBurnerTS

This project contains the files I am writing for playing [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/). I have configured this project to use TypeScript. It plays well with the VSCode plugin and API Server of the Steam version of the game.

## How to use this project

You can copy my repo and just delete the contents of the ts/ and js/ folders, which contain my scripts. You don't want them. Write your own.

Leave the types/ folder because it contains the types needed for the game.

When you want to use a type, you'll need to import it, at least with my configuration. I have strict on and no implicit any, so you can disable any of those is you want.

JavaScript:
```js
/** @param {NS} ns **/
export async function main(ns) {
  ...
}
```

TypeScript:

```ts
  import { NS } from "../types/NetscriptDefinitions";
  
  export async function main(ns: NS) : Promise<void> {
    ...
  }
```

You'll need npm. Just run npm install to install the dependencies. Then just use

```bash
tsc -w
```

to watch your changes and compile. 

If you use the VSCode extension for Bitburner, you can have it automatically upload your outputted JS files to the game.

### Handling Args

If you keep things strict, you'll need to handle args carefully, because args have a type of string | number | boolean. If you want to assign to a string type, you'll need to force a type change or check the type before assignment. I am dumb, so here's my solution:

```ts
  import { NS } from "../types/NetscriptDefinitions";
  
  export async function main(ns: NS) : Promise<void> {
    let arg0 = "";
    
    if (typeof (ns.args[0]) == "string")) {
      arg0 = ns.args[0];
    }
    else {
      ns.tprint("Error: Argument 0 is not a string!");
      ns.kill(SCRIPT_NAME, HOST_SERVER, ns.args[0].toString());
    }
    
  }
```

Declare a variable of the type you want, check to see if the argument is the right type, then assign it to your variable.

### Import Modules

In order to import compiled modules, a bit of tomfoolery is required. In the tsconfig.json, we need the following:

```json
    "compilerOptions": {
      ...
      "outDir": "js",
      "paths": {
          "js/*": ["ts/*"]
      }
    }
    "include": [
      "types/**/*.d.ts",
      "ts/**/*"
    ]
```

The include section tells the compiler where to look for ts files. The paths section tells the compiler that if it sees a /js/* path while compiling, to treat it as a /ts/* path. Then in our TypeScript file, we can use:

```ts
import { CONSTANTS  }   from "js/common/constants";
```

to import

```ts
export class CONSTANTS {
    static readonly SCRIPT_DIRECTORY = "js/";
}
```

This will allow the game to properly call the right import file while still compiling properly. I have seen other solutions as well. 

The reason this seems to hapen with my configuration is that the relative pathing gets messed up. If I run js/simpleHack.js, the ./common/constants path will not work, but a path from the base directory will work.
