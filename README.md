# Bambu Node

A node.js library for connecting to and receiving data from Bambu Lab printers through
their MQTT servers.

- Every command & response field is documented & typed.
- Easily (and safely\*) construct commands & manage responses.
- Full async support! `client#executeCommand` waits until the command completion is
  verified by the printer.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- NPM
- TypeScript

> [!CAUTION]  
> TypeScript is highly recommended for this package due to the type safety it provides.
> This is especially important in use cases like this project where the library
> communicates with external hardware which can very well come with property damage. And
> even with TypeScript, I am not liable for any such damages as stated in the
> [license](LICENSE).

### Installation

```bash
npm install bambu-node
```

### Example Usage

```typescript
import { BambuClient, Fan, UpdateFanCommand } from "bambu-node"

// define a printer connection
const client = new BambuClient({
	host: "your_printers_ip",
	accessToken: "your_printers_access_token",
	serialNumber: "your_printers_sn",
})

// more about the available events below
client.on("printer:statusUpdate", (oldStatus, newStatus) => {
	console.log(`The printers status has changed from ${oldStatus} to ${newStatus}!`)
})

// connect to the printer
await client.connect()

// update the speed of the auxiliary fan to 100%
await client.executeCommand(new UpdateFanCommand({ fan: Fan.AUXILIARY_FAN, speed: 100 }))

// we don't want to do anything else => we close the connection
// (can be kept open indefinitely if needed)
await client.disconnect()
```

## API

#### Legend

<u>Unnamed things inside classes</u>: Other classes that extend that class.

Every method, command and response is documented in JSDoc, so only events & utility
classes are documented here.

- Bambu Node
  - [Class: `BambuClient`](#class-bambuclient)
    - Method: `BambuClient.connect()`
    - Method: `BambuClient.disconnect()`
    - Method: `BambuClient.subscribe(topic)`
    - Method: `BambuClient.executeCommand(command)`
    - [Event: `message`](#message)
    - [Event: `rawMessage`](#rawmessage)
    - [Event: `printer:dataUpdate`](#printerdataupdate)
    - [Event: `printer:statusUpdate`](#printerstatusupdate)
    - [Event: `job:start`](#jobstart)
    - [Event: `job:pause`](#jobpause)
    - [Event: `job:unpause`](#jobunpause)
    - [Event: `job:finish`](#jobfinish)
    - [Event: `job:finish:success`](#jobfinishsuccess)
    - [Event: `job:finish:failed`](#jobfinishfailed)
    - [Event: `job:finish:unexpected`](#jobfinishunexpected)
  - [Class: `Job`](#class-job)
    - Method: `Job.update(data)`
    - Getter: `Job.data`
  - Class: `AbstractCommand`
    - Class: `GCodeCommand`
      - `GCodeFileCommand`
      - `GCodeLineCommand`
    - `GetVersionCommand`
    - `PushAllCommand`
    - `UpdateFanCommand`
    - `UpdateLightCommand`
    - `UpdateSpeedCommand`
    - `UpdateStateCommand`
    - `UpdateTempCommand`
  - _Command Responses_
    - info
      - Class: `InfoMessageCommand`
        - `GetVersionResponse`
    - mcPrint
      - Class: `McPrintMessageCommand`
        - `PushInfoResponse`
    - print
      - Class: `PrintMessageCommand`
        - `GCodeFileResponse`
        - `GCodeLineResponse`
        - `ProjectFileResponse`
        - `PushAllResponse`
          - `PushStatusResponse`
        - `UpdateFanResponse`
        - `UpdateLightResponse`
        - `UpdateSpeedResponse`
        - `UpdateStateResponse`
        - `UpdateTempResponse`

### Class: BambuClient

Responsible for managing the connection and messages to/from the printer.

#### Events

##### `rawMessage`

Triggered whenever a new message is received from the MQTT broker.

#### `message`

Triggered whenever a new <u>known</u> message is received from the MQTT broker.

#### `printer:dataUpdate`

Triggered whenever new data is received from the printer and is merged into the data class
field.

#### `printer:statusUpdate`

Triggered whenever the printer's status changes to a new status.

#### `job:start`

Triggered whenever a new printing job starts.

#### `job:pause`

Triggered whenever the current print job is paused.

#### `job:unpause`

Triggered whenever the current print job is resumed.

#### `job:finish`

Triggered whenever the current print job finishes.

##### `job:finish:success`

Triggered whenever the current print job finishes without errors.

##### `job:finish:failed`

Triggered whenever the current print job finishes without errors.

##### `job:finish:unexpected`

Triggered whenever the current print job finishes unexpectedly. This is only included as a
proof of concept and is 99% bound to never happen.

### Class: Job

Responsible for managing the data about the current print job. It collects historical
data, error codes, etc. It is included in every event starting with `job:`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what
you would like to change.

## License

[MIT © Márk Böszörményi, Aaron Scherer](LICENSE)
