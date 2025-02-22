import type { IncomingMessageData, PrinterData } from "./types"
import type { PrinterStatus } from "./responses"
import type { Job } from "./Job"

export interface BambuClientEvents {
	message: [topic: string, key: string, data: IncomingMessageData]
	rawMessage: [topic: string, payload: Buffer]
	"printer:dataUpdate": [data: PrinterData]
	"printer:statusUpdate": [oldStatus: PrinterStatus, newStatus: PrinterStatus]
	"job:start": [job: Job]
	"job:pause": [job: Job]
	"job:unpause": [job: Job]
	"job:finish": [job: Job]
	"job:finish:success": [job: Job]
	"job:finish:failed": [job: Job]
	"job:finish:unexpected": [job: Job]
}
