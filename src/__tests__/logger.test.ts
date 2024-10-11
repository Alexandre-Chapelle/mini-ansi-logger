import { Logger, Colors } from "../index";
import * as fs from "fs";
import * as path from "path";

function ansiRegex({ onlyFirst = false } = {}): RegExp {
  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:" +
      "(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?" +
      "[0-9A-ORZcf-nqry=><~]|" +
      "[a-zA-Z]|" +
      "(?:\\d{1,4}(?:;\\d{1,4})*)?\\u0007)",
  ].join("|");

  return new RegExp(pattern, onlyFirst ? undefined : "g");
}

function stripAnsi(string: string): string {
  if (typeof string !== "string") {
    throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
  }

  return string.replace(ansiRegex(), "");
}

describe("Logger Class", () => {
  let logger: Logger;
  const logDir = path.join(__dirname, "test-logs");

  beforeEach(() => {
    logger = new Logger({ logPath: logDir });
    if (fs.existsSync(logDir)) {
      fs.rmSync(logDir, { recursive: true, force: true });
    }
  });

  test("should log messages to the console", () => {
    console.log = jest.fn();

    logger.log("Test log message");

    const loggedMessage = (console.log as jest.Mock).mock.calls[0][0];
    const strippedMessage = stripAnsi(loggedMessage);

    expect(strippedMessage).toBe("[LOG] Test log message");
  });

  test("should log messages with custom color", () => {
    console.log = jest.fn();

    logger.log("Test log message", { color: Colors.FgMagenta });

    const loggedMessage = (console.log as jest.Mock).mock.calls[0][0];
    const strippedMessage = stripAnsi(loggedMessage);

    expect(strippedMessage).toBe("[LOG] Test log message");
  });

  test("should write logs to file when logToFile is true", () => {
    logger.info("Test info message", { logToFile: true });

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const fileName = `${day}.${month}.${year}.json`;
    const filePath = path.join(logDir, fileName);

    expect(fs.existsSync(filePath)).toBe(true);

    const data = fs.readFileSync(filePath, "utf8");
    const logs = JSON.parse(data);
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe("Test info message");
  });

  test("should throw an error when isThrow is true", () => {
    expect(() => {
      logger.error("Test error message", { isThrow: true });
    }).toThrow("ERROR Test error message");
  });

  test("should allow updating configuration", () => {
    const newPath = path.join(__dirname, "new-test-logs");
    logger.configure({ logPath: newPath });
    logger.success("Test success message", { logToFile: true });

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const fileName = `${day}.${month}.${year}.json`;
    const filePath = path.join(newPath, fileName);

    expect(fs.existsSync(filePath)).toBe(true);
  });

  afterEach(() => {
    jest.resetAllMocks();

    const directories = [logDir, path.join(__dirname, "new-test-logs")];

    for (const dir of directories) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    }
  });
});
