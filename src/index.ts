import * as fs from "fs";
import * as path from "path";

/**
 * ANSI color codes for styling console output.
 */
export enum Colors {
  Reset = "\x1b[0m",
  Bright = "\x1b[1m",
  Dim = "\x1b[2m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
  Hidden = "\x1b[8m",

  FgBlack = "\x1b[30m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgBlue = "\x1b[34m",
  FgMagenta = "\x1b[35m",
  FgCyan = "\x1b[36m",
  FgWhite = "\x1b[37m",

  BgBlack = "\x1b[40m",
  BgRed = "\x1b[41m",
  BgGreen = "\x1b[42m",
  BgYellow = "\x1b[43m",
  BgBlue = "\x1b[44m",
  BgMagenta = "\x1b[45m",
  BgCyan = "\x1b[46m",
  BgWhite = "\x1b[47m",
}

type LogLevel = "log" | "info" | "success" | "warn" | "error";

const levelToColor: Record<LogLevel, string> = {
  log: Colors.FgWhite,
  info: Colors.FgBlue,
  success: Colors.FgGreen,
  warn: Colors.FgYellow,
  error: Colors.FgRed,
};

const levelToConsoleMethod: Record<LogLevel, (...data: any[]) => void> = {
  log: (...data: any[]) => console.log(...data),
  info: (...data: any[]) => console.info(...data),
  success: (...data: any[]) => console.info(...data),
  warn: (...data: any[]) => console.warn(...data),
  error: (...data: any[]) => console.error(...data),
};

/**
 * Formats the log message with color and label.
 */
function formatMessage(color: string, label: string, message: string): string {
  return `${color}[${label}]${Colors.Reset} ${message}`;
}

/**
 * Options for logging functions.
 */
export interface LogOptions {
  name?: string;
  logToFile?: boolean;
  isThrow?: boolean;
  color?: Colors;
}

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  trace: string;
}

/**
 * Configuration for the logger.
 */
export interface LoggerConfig {
  logPath?: string;
}

export class Logger {
  private config: LoggerConfig;

  constructor(config?: LoggerConfig) {
    this.config = config || {};
  }

  /**
   * Updates the logger's configuration.
   * @param config Logger configuration options.
   */
  public configure(config: LoggerConfig) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Logs the message to the console and optionally to a file.
   */
  private logMessage(
    level: LogLevel,
    message: string,
    options?: LogOptions
  ): void {
    const name = options?.name || level.toUpperCase();
    const color = options?.color || levelToColor[level];
    const consoleMethod = levelToConsoleMethod[level];

    consoleMethod(formatMessage(color, name, message));

    if (options?.logToFile) {
      this.writeLogToFile({
        level: name,
        message,
        timestamp: new Date().toISOString(),
        trace: new Error().stack || "",
      });
    }

    if (level === "error" && options?.isThrow) {
      throw new Error(`${name} ${message}`);
    }
  }

  /**
   * Writes the log entry to a file.
   */
  private writeLogToFile(logEntry: LogEntry): void {
    try {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();

      const fileName = `${day}.${month}.${year}.json`;
      const logsDir = this.config.logPath || path.join(process.cwd(), "logs");

      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      const filePath = path.join(logsDir, fileName);

      let logs: LogEntry[] = [];

      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf8");
        logs = JSON.parse(data);
      }

      logs.push(logEntry);

      fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error("Error writing log to file:", error);
    }
  }

  /**
   * Logs a general message.
   */
  public log(message: string, options?: LogOptions): void {
    this.logMessage("log", message, options);
  }

  /**
   * Logs an informational message.
   */
  public info(message: string, options?: LogOptions): void {
    this.logMessage("info", message, options);
  }

  /**
   * Logs a success message.
   */
  public success(message: string, options?: LogOptions): void {
    this.logMessage("success", message, options);
  }

  /**
   * Logs a warning message.
   */
  public warn(message: string, options?: LogOptions): void {
    this.logMessage("warn", message, options);
  }

  /**
   * Logs an error message.
   */
  public error(message: string, options?: LogOptions): void {
    this.logMessage("error", message, options);
  }
}
