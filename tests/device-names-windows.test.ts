import { expect, test } from "bun:test";
import { formatDeviceLabel } from "../src/helpers/format-device-label";
type SimpleMediaDeviceInfo = Omit<MediaDeviceInfo, "toJSON">;

const logiStreamCamDefault: SimpleMediaDeviceInfo = {
  deviceId: "default",
  kind: "audioinput",
  label: "Default - Microphone (Logitech StreamCam) (046d:0893)",
  groupId: "601830fbbe679ed0dc018b5bfa9e4d6e67a770bbb13a4a1a2ef5a0a8995f662c",
};

const logiStreamCamCommunicationMic: SimpleMediaDeviceInfo = {
  deviceId: "communications",
  kind: "audioinput",
  label: "Communications - Microphone (Logitech StreamCam) (046d:0893)",
  groupId: "601830fbbe679ed0dc018b5bfa9e4d6e67a770bbb13a4a1a2ef5a0a8995f662c",
};

const hdmiMicrophone: SimpleMediaDeviceInfo = {
  deviceId: "3a49e15e6f97487e9e35d23c2601f8457ff469b38cde9222db5ff064d0060384",
  kind: "audioinput",
  label: "HDMI (2- Cam Link 4K) (0fd9:007b)",
  groupId: "6e4e547aa79c0b075ef4ac9679cf369c12e901fb0ab234c26d086f23575ef91f",
};

const elgatoSoundCapture: SimpleMediaDeviceInfo = {
  deviceId: "75866698d7a90281a22f21cb7d8c0d6ed088fab0fc73231bc7036d41c624f39b",
  kind: "audioinput",
  label: "Line (Elgato Sound Capture)",
  groupId: "cf31213a1dbe36cafd2b8cba4e0d144a78f922b7f4b67b9fcb4f1eb60f524540",
};

const gameCaptureMicrophone: SimpleMediaDeviceInfo = {
  deviceId: "6d9c71a3601f0bcaad551c44414d5ee3875a9ef2d8f0e8ae04c68871d6d3f857",
  kind: "audioinput",
  label: "Game Capture HD60 X (Game Capture HD60 X) (0fd9:0082)",
  groupId: "011ae12697417f1648b14b756cefa1af42933bada030d62303f1047aac2b787e",
};

const rodeNtUsbMicrophone: SimpleMediaDeviceInfo = {
  deviceId: "d6ac77a6d09ee496183b49b7ca75e37be93304aabc5c3e8f37b23d4de068fc4a",
  kind: "audioinput",
  label: "Microphone (6- RODE NT-USB) (19f7:0003)",
  groupId: "cc002cc139e4cc9b60a69a2339c31dd145dcd7046a33c78598edc41d8f4c29df",
};

const logitechStreamCamMicrophone: SimpleMediaDeviceInfo = {
  deviceId: "16dafab7166f59172d162b1ec820e7b59340eac48a30172d6370bc3ff28940ff",
  kind: "audioinput",
  label: "Microphone (Logitech StreamCam) (046d:0893)",
  groupId: "601830fbbe679ed0dc018b5bfa9e4d6e67a770bbb13a4a1a2ef5a0a8995f662c",
};

const logitechStreamCamVideo: SimpleMediaDeviceInfo = {
  deviceId: "ca8e564026fcbac1d5627068cf8b532f3706bbf3bb258f1e319431817aaf6b73",
  kind: "videoinput",
  label: "Logitech StreamCam (046d:0893)",
  groupId: "601830fbbe679ed0dc018b5bfa9e4d6e67a770bbb13a4a1a2ef5a0a8995f662c",
};

const gameCaptureHD60XVideo: SimpleMediaDeviceInfo = {
  deviceId: "c142f209ad4c723a2476354cc7d294762a4fb8fb28e168f7ad7d662f660aeff5",
  kind: "videoinput",
  label: "Game Capture HD60 X (0fd9:0082)",
  groupId: "011ae12697417f1648b14b756cefa1af42933bada030d62303f1047aac2b787e",
};

const camLink4KVideo: SimpleMediaDeviceInfo = {
  deviceId: "a02a07ff4c54861f16cb544b53b7e0dc5c94ceeb32d6aad96c74c94e6152c63e",
  kind: "videoinput",
  label: "Cam Link 4K (0fd9:007b)",
  groupId: "6e4e547aa79c0b075ef4ac9679cf369c12e901fb0ab234c26d086f23575ef91f",
};

const logiCaptureVideo: SimpleMediaDeviceInfo = {
  deviceId: "9276bdff65d92deceae4c3df7e50d84efdff22ab4ec60124344c51358e3c8c2a",
  kind: "videoinput",
  label: "Logi Capture",
  groupId: "64be8f1d48d8eead2eea1fc92d281c320cdcbaf17f0b3f701b9eef88a0e0eba1",
};

const lumixWebcamVideo: SimpleMediaDeviceInfo = {
  deviceId: "50f712f1a8c30cbe8a02f9ab13b33c32c01204210a34db27572bd1f928c96860",
  kind: "videoinput",
  label: "LUMIX Webcam Software",
  groupId: "5a694a5713c75196c50dfbe3606d92bcd7d02c7d2e6c0a60a7f5adc95480c0c5",
};

const obsVirtualCameraVideo: SimpleMediaDeviceInfo = {
  deviceId: "49659e5373dc3800ae9e4bdd9a44d28d4f2b62ca78fd2e3cb2b2ab6462765860",
  kind: "videoinput",
  label: "OBS Virtual Camera",
  groupId: "fdb8f7cd0527c97096de31cc9da100bd2510e37df0c519a8c9a8f7c5e7db9068",
};

const elgatoScreenLinkVideo: SimpleMediaDeviceInfo = {
  deviceId: "97278b8041976bec4d5c871f478d45844fff66ffbde95cd6adcedf3f9703f51a",
  kind: "videoinput",
  label: "Elgato Screen Link",
  groupId: "fc06fee6c00e6f47c751109a9ad273cac0f7c73a91f7af2c1b65ad29528224d5",
};

const p27q20Default: SimpleMediaDeviceInfo = {
  deviceId: "default",
  kind: "audiooutput",
  label: "Default - 4 - P27q-20 (AMD High Definition Audio Device)",
  groupId: "02c877482d3b49f2b6e149672386c9eb95669cccb39a6c18b61686868e06f933",
};

const communicationsSpeakers: SimpleMediaDeviceInfo = {
  deviceId: "communications",
  kind: "audiooutput",
  label: "Communications - Speakers (6- RODE NT-USB) (19f7:0003)",
  groupId: "cc002cc139e4cc9b60a69a2339c31dd145dcd7046a33c78598edc41d8f4c29df",
};

const realtekDigitalOutput: SimpleMediaDeviceInfo = {
  deviceId: "54a6009df5d18a7f3c2752d0666c4206df867bef8c206d24141f6c51065f440c",
  kind: "audiooutput",
  label: "Realtek Digital Output (Realtek(R) Audio)",
  groupId: "342675f34dcf8af4cd3cfee0e158ab6bbb02c7a320624c48da8d2bef648f4f7d",
};

const speakersRodeNtUsb: SimpleMediaDeviceInfo = {
  deviceId: "55cff10ebabfa0bb6a1c2304bf263102865ca92d1d0fff6a5b84fecc2bb2f004",
  kind: "audiooutput",
  label: "Speakers (6- RODE NT-USB) (19f7:0003)",
  groupId: "cc002cc139e4cc9b60a69a2339c31dd145dcd7046a33c78598edc41d8f4c29df",
};

test("Test for logiStreamCamDefault", () => {
  expect(formatDeviceLabel(logiStreamCamDefault)).toEqual("Logitech StreamCam");
});

test("Test for logiStreamCamCommunicationMic", () => {
  expect(formatDeviceLabel(logiStreamCamCommunicationMic)).toEqual(
    "Logitech StreamCam",
  );
});

test("Test for HDMI Microphone", () => {
  expect(formatDeviceLabel(hdmiMicrophone)).toEqual("Cam Link 4K");
});

test("Test for Line Microphone", () => {
  expect(formatDeviceLabel(elgatoSoundCapture)).toEqual("Elgato Sound Capture");
});

test("Test for Game Capture HD60 X Microphone", () => {
  expect(formatDeviceLabel(gameCaptureMicrophone)).toEqual(
    "Game Capture HD60 X",
  );
});

test("Test for RODE NT-USB Microphone", () => {
  expect(formatDeviceLabel(rodeNtUsbMicrophone)).toEqual("RODE NT-USB");
});

test("Test for Logitech StreamCam Microphone", () => {
  expect(formatDeviceLabel(logitechStreamCamMicrophone)).toEqual(
    "Logitech StreamCam",
  );
});

test("Test for Logitech StreamCam Video", () => {
  expect(formatDeviceLabel(logitechStreamCamVideo)).toEqual(
    "Logitech StreamCam",
  );
});

test("Test for Game Capture HD60 X Video", () => {
  expect(formatDeviceLabel(gameCaptureHD60XVideo)).toEqual(
    "Game Capture HD60 X",
  );
});

test("Test for Cam Link 4K Video", () => {
  expect(formatDeviceLabel(camLink4KVideo)).toEqual("Cam Link 4K");
});

test("Test for Logi Capture Video", () => {
  expect(formatDeviceLabel(logiCaptureVideo)).toEqual("Logi Capture");
});

test("Test for LUMIX Webcam Video", () => {
  expect(formatDeviceLabel(lumixWebcamVideo)).toEqual("LUMIX Webcam Software");
});

test("Test for OBS Virtual Camera Video", () => {
  expect(formatDeviceLabel(obsVirtualCameraVideo)).toEqual(
    "OBS Virtual Camera",
  );
});

test("Test for Elgato Screen Link Video", () => {
  expect(formatDeviceLabel(elgatoScreenLinkVideo)).toEqual(
    "Elgato Screen Link",
  );
});

test("Test for Default Audio Output", () => {
  expect(formatDeviceLabel(p27q20Default)).toEqual(
    "AMD High Definition Audio Device",
  );
});

test("Test for Communications Speakers", () => {
  expect(formatDeviceLabel(communicationsSpeakers)).toEqual("RODE NT-USB");
});

test("Test for Realtek Digital Output", () => {
  expect(formatDeviceLabel(realtekDigitalOutput)).toEqual("Realtek(R) Audio");
});

test("Test for Speakers RODE NT-USB", () => {
  expect(formatDeviceLabel(speakersRodeNtUsb)).toEqual("RODE NT-USB");
});
