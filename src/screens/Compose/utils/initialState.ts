import { createRef } from 'react'
import { ComposeState } from './types'

const composeInitialState: Omit<ComposeState, 'timestamp'> = {
  type: undefined,
  dirty: false,
  posting: false,
  spoiler: {
    active: false,
    count: 0,
    raw: '',
    formatted: undefined,
    selection: { start: 0 }
  },
  text: {
    count: 0,
    raw: '',
    formatted: undefined,
    selection: { start: 0 }
  },
  tag: undefined,
  poll: {
    active: false,
    total: 2,
    options: [],
    multiple: false,
    expire: '86400'
  },
  attachments: {
    sensitive: false,
    uploads: []
  },
  visibility: 'public',
  visibilityLock: false,
  replyToStatus: undefined,
  textInputFocus: {
    current: 'text',
    refs: { text: createRef(), spoiler: createRef() },
    isFocused: { text: createRef(), spoiler: createRef() }
  }
}

export default composeInitialState
