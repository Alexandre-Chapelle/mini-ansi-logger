Mini ANSI Logger Documentation

# Mini ANSI Logger

A simple, customizable logger for Node.js applications with ANSI color support.

[![npm version](https://img.shields.io/npm/v/mini-ansi-logger.svg)](https://www.npmjs.com/package/mini-ansi-logger) [![GitHub stars](https://img.shields.io/github/stars/Alexandre-Chapelle/mini-ansi-logger.svg)](https://github.com/Alexandre-Chapelle/mini-ansi-logger) [![license](https://img.shields.io/npm/l/mini-ansi-logger.svg)](https://github.com/Alexandre-Chapelle/mini-ansi-logger/blob/main/LICENSE)

---

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Examples](#examples)
- [License](#license)
- [Contributing](#contributing)
- [Questions](#questions)

## Installation

```
npm install mini-ansi-logger
```

If you are using TypeScript, type definitions are included automatically.

## Features

- Supports multiple log levels: `log`, `info`, `success`, `warn`, `error`
- Customizable colors for log messages using ANSI codes
- Option to log messages to a file with a customizable path
- Configurable logger instances
- TypeScript support with type definitions included

## Usage

### Importing the Logger

```
// CommonJS
const { Logger, Colors } = require('mini-ansi-logger');

// ES Modules
import { Logger, Colors } from 'mini-ansi-logger';
```

### Creating a Logger Instance

```
// Create a new logger instance with default configuration
const logger = new Logger();

// Create a logger with custom configuration
const customLogger = new Logger({ logPath: '/custom/log/path' });
```

### Logging Messages

```
logger.log('This is a general log message');
logger.info('This is an informational message');
logger.success('Operation was successful');
logger.warn('This is a warning message');
logger.error('An error occurred');
```

### Using Custom Colors

```
logger.log('This is a magenta log message', { color: Colors.FgMagenta });
```

### Logging to a File

```
logger.info('This message will be logged to a file', { logToFile: true });
```

## API Reference

### Class: Logger

The `Logger` class provides methods to log messages with different levels and configurations.

#### Constructor

```
new Logger(config?: LoggerConfig)
```

**Parameters:**

- `config` (optional): An object containing configuration options.

#### Methods

- `log(message: string, options?: LogOptions): void`

  Logs a general message.

- `info(message: string, options?: LogOptions): void`

  Logs an informational message.

- `success(message: string, options?: LogOptions): void`

  Logs a success message.

- `warn(message: string, options?: LogOptions): void`

  Logs a warning message.

- `error(message: string, options?: LogOptions): void`

  Logs an error message.

- `configure(config: LoggerConfig): void`

  Updates the logger's configuration.

### Interfaces

#### LoggerConfig

Configuration options for the logger instance.

```
interface LoggerConfig {
  logPath?: string;
}
```

**Properties:**

- `logPath` (optional): A string specifying the directory path where logs will be saved.

#### LogOptions

Options for individual log messages.

```
interface LogOptions {
  name?: string;
  logToFile?: boolean;
  isThrow?: boolean;
  color?: Colors;
}
```

**Properties:**

- `name` (optional): A custom label for the log message.
- `logToFile` (optional): A boolean indicating whether to log the message to a file.
- `isThrow` (optional): If set to `true` in an `error` log, it will throw an exception.
- `color` (optional): A color code from the `Colors` enum to customize the message color.

### Enum: Colors

An enumeration of ANSI color codes for styling console output.

```
enum Colors {
  Reset = '\x1b[0m',
  Bright = '\x1b[1m',
  Dim = '\x1b[2m',
  Underscore = '\x1b[4m',
  Blink = '\x1b[5m',
  Reverse = '\x1b[7m',
  Hidden = '\x1b[8m',

  FgBlack = '\x1b[30m',
  FgRed = '\x1b[31m',
  FgGreen = '\x1b[32m',
  FgYellow = '\x1b[33m',
  FgBlue = '\x1b[34m',
  FgMagenta = '\x1b[35m',
  FgCyan = '\x1b[36m',
  FgWhite = '\x1b[37m',

  BgBlack = '\x1b[40m',
  BgRed = '\x1b[41m',
  BgGreen = '\x1b[42m',
  BgYellow = '\x1b[43m',
  BgBlue = '\x1b[44m',
  BgMagenta = '\x1b[45m',
  BgCyan = '\x1b[46m',
  BgWhite = '\x1b[47m',
}
```

## Configuration

### Logger Configuration

You can configure the logger instance by passing a `LoggerConfig` object when creating a new instance or by using the `configure` method.

```
// Setting configuration during instantiation
const logger = new Logger({ logPath: '/custom/log/path' });

// Updating configuration later
logger.configure({ logPath: '/another/log/path' });
```

### Log Options

You can customize individual log messages using `LogOptions`.

```
logger.info('Custom log message', {
  name: 'CUSTOM',
  logToFile: true,
  color: Colors.FgCyan
});
```

## Examples

### Basic Logging

```
const logger = new Logger();

logger.log('This is a general log message');
logger.info('This is an info message');
logger.success('This is a success message');
logger.warn('This is a warning message');
logger.error('This is an error message');
```

### Customizing Log Messages

```
logger.log('Custom color log message', {
  color: Colors.FgMagenta
});

logger.error('This error will throw an exception', {
  isThrow: true
});
```

### Logging to a File

```
const logger = new Logger({ logPath: './logs' });

logger.warn('This warning will be logged to a file', {
  logToFile: true
});
```

### Using Multiple Logger Instances

```
const logger1 = new Logger({ logPath: './logs/logger1' });
const logger2 = new Logger({ logPath: './logs/logger2' });

logger1.info('Message from logger1', { logToFile: true });
logger2.info('Message from logger2', { logToFile: true });
```

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Alexandre-Chapelle/mini-ansi-logger/blob/main/LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Questions

If you have any questions or need further assistance, feel free to open an issue or contact the maintainer.
