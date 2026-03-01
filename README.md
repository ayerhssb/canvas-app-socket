# Canvas Socket Server

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction
This repository contains the WebSocket server for the Canvas - Whiteboard Collaboration App. The server is built using Express and Socket.io to enable real-time communication between users on the collaborative whiteboard application.

## Features
- Real-time communication using WebSocket
- Built with Express and Socket.io

## Technologies
- Express
- Socket.io
- TypeScript

## Installation
To set up this project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/harshbansal8705/canvas-socket.git
    cd canvas-socket
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and add the necessary environment variables:
    ```plaintext
    JWT_SECRET=<your-secret-key>
    ```

## Usage
1. Start the WebSocket server:
    ```bash
    node index.js
    ```
    or
    ```bash
    ts-node index.ts
    ```

## Project Structure
```plaintext
canvas-socket/
├── .gitignore
├── index.js
├── index.ts
├── package-lock.json
├── package.json
├── tsconfig.json
└── .env
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.
