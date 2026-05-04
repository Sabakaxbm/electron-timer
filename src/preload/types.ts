export interface UpdateAvailable {
  version: string
}

export interface UpdateDownloaded {
  version: string
}

export type UpdateStatus =
  | { status: 'available'; version: string }
  | { status: 'none' }
  | { status: 'error'; message: string }
  | { status: 'timeout' }
