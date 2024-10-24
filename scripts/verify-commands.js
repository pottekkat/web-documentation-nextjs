// @ts-check
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const { exit } = require("process");
const core = require("@actions/core");

(async () => {
  const branch = process.argv[process.argv.length - 1];
  const production = branch.toLowerCase() === "main";

  console.log(`Checking commands for branch: ${branch}`);

  const pkgUrl = `https://raw.githubusercontent.com/estruyf/vscode-front-matter/${production ? "main" : "beta"
    }/package.json`;

  const response = await fetch(pkgUrl);
  if (!response.ok) {
    return;
  }

  let contents = await response.text();

  if (!contents) {
    console.log("No contents found");
    exit(1);
  }

  const pkg = JSON.parse(contents);
  const commands = pkg.contributes.commands;
  const commandPalette = pkg.contributes.menus.commandPalette;
  const commandKeys = commands.map((c) => c.command).sort();

  const commandsPath = path.resolve(__dirname, "../content/docs/commands.md");
  const commandsFile = fs.readFileSync(commandsPath, "utf8");

  const missingCommands = [];

  for (const key of commandKeys) {
    const cp = commandPalette.find((c) => c.command === key);

    if (cp && cp.when === "false") {
      continue;
    }

    if (!commandsFile.includes(key)) {
      missingCommands.push(key);
    }
  }

  if (missingCommands.length > 0) {
    core.summary
      .addHeading(`Missing commands`)
      .addRaw(`\n ${missingCommands.map((s) => `- ${s}\n`).join("")}`)
      .write();
  }
})();
