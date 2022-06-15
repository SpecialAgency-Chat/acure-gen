import Acure from "./module";
import ora from "ora";
import chalk from "chalk";

(async () => {
  let spinner: ora.Ora = ora("Getting email address...");
  spinner.start();
  const email = await Acure.newMail();
  spinner.succeed(`Got email address: ${email}`);
  spinner = ora("Request blank mail...").start();
  await Acure.requestBlankMail(email);
  spinner.succeed("Request blank mail success");
  spinner = ora("Checking mail inbox...").start();
  const url = await Acure.findRegistMail(email);
  spinner.succeed(`Found regist url: ${url}`);
  spinner = ora("Registering...").start();
  await Acure.regist(url, email, () => {
    spinner.text = "Registering... (1/4)";
  }, () => {
    spinner.text = "Registering... (2/4)";
  }, () => {
    spinner.text = "Registering... (3/4)";
  }, () => {
    spinner.succeed("Regist success! (4/4)");
    console.log(`Email: ${email}`);
    console.log("Password: KohnoseLami1234");
    process.exit(0);
  });
})();