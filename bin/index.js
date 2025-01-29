#!/usr/bin/env node

import fs from "fs";
import os from "os";
import path from "path";
import inquirer from "inquirer";
import { spawn } from "child_process";
import {
  directoriesList,
  newDirQuestion,
  projectsList,
  WSL,
  updateConfigConfirmation,
  updateConfigOptions,
} from "./questions.js";
import SearchBox from "inquirer-search-list";

inquirer.registerPrompt("search-list", SearchBox);

const CONFIG_PATH = path.join(os.homedir(), "/pmanrc.json");
const configExists = fs.existsSync(CONFIG_PATH);

const readConfig = () => {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
};

const openProject = (projectPath, config) => {
  if (config.wsl) {
    spawn("wt.exe", ["-w", "0", "nt", "wsl", "--cd", projectPath], {
      shell: true,
      stdio: "inherit",
    });
  } else if (os.platform() === "darwin") {
    let terminal = process.env.TERM_PROGRAM;
    if (terminal === "Apple_Terminal") {
      terminal = "Terminal";
    }
    spawn("open", ["-a", terminal, projectPath], {
      shell: true,
      stdio: "inherit",
    });
  } else {
    console.log(`Platform not supported yet. (${os.platform()})`);
    return;
  }

  console.log("Project opened in a new tab. You can close this tab now.");
};

const start = () => {
  const config = readConfig();

  inquirer
    .prompt([
      updateConfigConfirmation,
      updateConfigOptions,
      {
        ...directoriesList("editDir", config),
        when: (answers) =>
          answers.updateConfig && answers.updateOption.startsWith("Edit"),
      },
      {
        ...newDirQuestion,
        when: (answers) =>
          answers.updateConfig &&
          (answers.updateOption.startsWith("Add") ||
            answers.updateOption.startsWith("Edit")),
      },
      {
        ...directoriesList("removeDir", config),
        when: (answers) =>
          answers.updateConfig && answers.updateOption.startsWith("Remove"),
      },
      {
        ...directoriesList("directory", config),
        when: (answers) => !answers.updateConfig,
      },
      projectsList(config.limit),
    ])
    .then((answers) => {
      if (answers.updateConfig) {
        switch (answers.updateOption.split(" ")[0]) {
          case "Add":
            config.projectsDirs.push(answers.newDir);
            console.log("Added " + answers.newDir);

            break;
          case "Edit":
            const oldDir = config.projectsDirs.indexOf(answers.editDir);
            config.projectsDirs[oldDir] = answers.newDir;
            console.log(`${answers.editDir} updated to ${answers.newDir}`);

            break;
          case "Remove":
            const selectedDir = config.projectsDirs.indexOf(answers.removeDir);
            config.projectsDirs.splice(selectedDir, 1);
            console.log("Removed " + answers.removeDir);

            break;
          case "Open":
            console.info(`Your config file is located at: ${CONFIG_PATH}`);
            break;
        }
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        start(config);
      } else {
        openProject(path.join(answers.directory, answers.project), config);
      }
    });
};

if (configExists) {
  start();
} else {
  inquirer.prompt([newDirQuestion, WSL]).then((answers) => {
    fs.writeFileSync(
      CONFIG_PATH,
      JSON.stringify(
        {
          projectsDirs: [answers.newDir],
          wsl: answers.wsl,
          limit: 0,
        },
        null,
        2
      )
    );
    start();
  });
}
