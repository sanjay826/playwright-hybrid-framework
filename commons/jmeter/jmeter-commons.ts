import { exec } from "child_process";

export class JMeterCommons {
  // Common method to run any command from command line (cmd)
  runCommand(command: string): Promise<string> {
    //method to run any command from cmd

    return new Promise((resolve, reject) => {
      // new promise to get output from command or error if command is invalid

      exec(command, (error, stdout, stderr) => {
        // command to execute , error => invalid command , stdout => output of the command , stderr => error in command execution
        if (error) {
          reject(`Error executing command: ${error.message}`);
        } else {
          resolve(stdout);
        }
        console.log(`Command executed Successfully: ${command}`);
      });
    });
  }
  // Common method to run the JMeter test plan
  async runJMeterTestPlan(testPlanPath: string): Promise<void> {
    // method to run the JMeter test plan
    console.log("Execution started for JMeter test plan" + testPlanPath);

    // Store the path of JMETER folder structure
    const projectRoot = process.cwd(); // Get the current working directory as the project root
    const jmeterBasePath = `${projectRoot}/tests/load/jmeter`; // /path to jmeter folder
    const jmeterToolPath = `${jmeterBasePath}/bin/jmeter.bat`; // path to jmeter tool
    const jmeterTestPlanPath = `${jmeterBasePath}/testplans/${testPlanPath}`; // Full path to the JMeter test plan

    // Add the folder structure to store the test results
    const jmeterResultsPath = `${jmeterBasePath}/results/TestResults_${Date.now()}.csv`; // Folder to store the test results
    const jmeterHtmlReportPath = `${jmeterBasePath}/report-output`; // Folder to store the HTML test results

    // command to run JMETER test plan and generate the test results in CSV format
    const command = `"${jmeterToolPath}" -n -t "${jmeterTestPlanPath}" -l "${jmeterResultsPath}"`; // Command to run the JMeter test plan and generate results
    console.log(`Executing the JMeter test plan with command: ${command}`);
    await this.runCommand(command); // Execute the command and wait for it to complete

    // Command to generate the HTML report from the test results generated in CSV format
    const htmlReportCommand = `"${jmeterToolPath}" -g "${jmeterResultsPath}" -o "${jmeterHtmlReportPath}"`; // Command to generate HTML report
    console.log(
      `Executing the JMeter HTML report generation with command: ${htmlReportCommand}`,
    );
    await this.runCommand(htmlReportCommand); // Execute the command to generate the HTML report
  }
}
