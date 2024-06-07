import { makeStreamPayloadMessage } from "@remotion/streaming";

const convertingProgress = "converting-progress" as const;
const transcribingProgress = "transcribing-progress" as const;
const installWhisperProgress = "install-whisper-progress" as const;
const downloadingWhisperModelProgress =
  "downloading-whisper-model-progress" as const;

const messageTypes = {
  "1": { type: convertingProgress },
  "2": { type: transcribingProgress },
  "3": { type: installWhisperProgress },
  "4": { type: downloadingWhisperModelProgress },
} as const;

export type MessageTypeId = keyof typeof messageTypes;
type MessageType = (typeof messageTypes)[MessageTypeId]["type"];

export const formatMap: { [key in MessageType]: "json" | "binary" } = {
  [convertingProgress]: "json",
  [transcribingProgress]: "json",
  [installWhisperProgress]: "json",
  [downloadingWhisperModelProgress]: "json",
};

type StreamingPayload =
  | {
      type: typeof convertingProgress;
      payload: {
        framesConverted: number;
        filename: string;
        progress: number;
      };
    }
  | {
      type: typeof transcribingProgress;
      payload: {
        filename: string;
        progress: number;
      };
    }
  | {
      type: typeof installWhisperProgress;
      payload: Record<string, never>;
    }
  | {
      type: typeof downloadingWhisperModelProgress;
      payload: {
        progressInPercent: number;
      };
    };

export const messageTypeIdToMessageType = (
  messageTypeId: MessageTypeId,
): MessageType => {
  const types = messageTypes[messageTypeId];
  if (!types) {
    throw new Error(`Unknown message type id ${messageTypeId}`);
  }

  return types.type;
};

const messageTypeToMessageId = (messageType: MessageType): MessageTypeId => {
  const id = (Object.keys(messageTypes) as unknown as MessageTypeId[]).find(
    (key) => messageTypes[key].type === messageType,
  ) as MessageTypeId;

  if (!id) {
    throw new Error(`Unknown message type ${messageType}`);
  }

  return id;
};

export type StreamingMessage = {
  successType: "error" | "success";
  message: StreamingPayload;
};

export type OnMessage = (options: StreamingMessage) => void;

export type OnStream = (payload: StreamingPayload) => void;

export const makeStreamPayload = ({
  message,
}: {
  message: StreamingPayload;
}) => {
  const body = new TextEncoder().encode(JSON.stringify(message.payload));

  return makeStreamPayloadMessage({
    body,
    nonce: messageTypeToMessageId(message.type),
    status: 0,
  });
};
