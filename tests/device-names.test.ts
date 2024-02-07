import { expect, test } from "bun:test";
import { formatLabel } from "../src/helpers";
type SimpleMediaDeviceInfo = Omit<MediaDeviceInfo, "toJSON">;

const exampleDevicesFromMacOs: SimpleMediaDeviceInfo[] = [
  {
    deviceId: "default",
    kind: "audioinput",
    label: "Default - MacBook Pro Microphone (Built-in)",
    groupId: "b19e9eca3ebcf5031b4daa3c37d90d1d2fe321e6df7b70d288b7b068d98e762c",
  },
  {
    deviceId:
      "2d069938f7622f880bc279fc81021f97b469839c8aadbc1dd942393c72700a95",
    kind: "audioinput",
    label: "MacBook Pro Microphone (Built-in)",
    groupId: "b19e9eca3ebcf5031b4daa3c37d90d1d2fe321e6df7b70d288b7b068d98e762c",
  },
  {
    deviceId:
      "85ab9579e48914aeb630250c61ff7986b9f615c92762ce549cb53ebed346c327",
    kind: "audioinput",
    label: "Microsoft Teams Audio Device (Virtual)",
    groupId: "93813575f4c5246a408e2f25764c747a5bb0936f7861a95e4ab67d19ca581b7d",
  },
  {
    deviceId:
      "dc1cdbc69d0aa62f2268026df6613b2d9f3dff499864e3a71485d93177298549",
    kind: "videoinput",
    label: "FaceTime HD Camera (1C1C:B782)",
    groupId: "e0448126bddc405488ab7dc9b2ea1cc0f81152d0ff42a87883acb20bf2639ea3",
  },
  {
    deviceId: "default",
    kind: "audiooutput",
    label: "Default - MacBook Pro Speakers (Built-in)",
    groupId: "b19e9eca3ebcf5031b4daa3c37d90d1d2fe321e6df7b70d288b7b068d98e762c",
  },
  {
    deviceId:
      "1c8284790737f9dcc249bbb4ec195024d9f29dcfe37f6cf83046acb63d975c38",
    kind: "audiooutput",
    label: "C34H89x (DisplayPort)",
    groupId: "787489bddecadddd21f7c6b80061605b128f788e2f191392e32febebeb2f69bf",
  },
  {
    deviceId:
      "87c999d3111e54ea65d26ace5f502d57953b73de0e49905dddc8af4642ab7157",
    kind: "audiooutput",
    label: "MacBook Pro Speakers (Built-in)",
    groupId: "b19e9eca3ebcf5031b4daa3c37d90d1d2fe321e6df7b70d288b7b068d98e762c",
  },
  {
    deviceId:
      "85ab9579e48914aeb630250c61ff7986b9f615c92762ce549cb53ebed346c327",
    kind: "audiooutput",
    label: "Microsoft Teams Audio Device (Virtual)",
    groupId: "93813575f4c5246a408e2f25764c747a5bb0936f7861a95e4ab67d19ca581b7d",
  },
];

const exampleDevicesFromWindows: SimpleMediaDeviceInfo[] = [
  {
    deviceId: "default",
    kind: "audioinput",
    label: "Default - Microphone (Logitech StreamCam) (046d:0893)",
    groupId: "601830fbbe679ed0dc018b5bfa9e4d6e67a770bbb13a4a1a2ef5a0a8995f662c",
  },
  {
    deviceId: "communications",
    kind: "audioinput",
    label: "Communications - Microphone (Logitech StreamCam) (046d:0893)",
    groupId: "601830fbbe679ed0dc018b5bfa9e4d6e67a770bbb13a4a1a2ef5a0a8995f662c",
  },
  {
    deviceId:
      "3a49e15e6f97487e9e35d23c2601f8457ff469b38cde9222db5ff064d0060384",
    kind: "audioinput",
    label: "HDMI (2- Cam Link 4K) (0fd9:007b)",
    groupId: "6e4e547aa79c0b075ef4ac9679cf369c12e901fb0ab234c26d086f23575ef91f",
  },
  {
    deviceId:
      "75866698d7a90281a22f21cb7d8c0d6ed088fab0fc73231bc7036d41c624f39b",
    kind: "audioinput",
    label: "Line (Elgato Sound Capture)",
    groupId: "cf31213a1dbe36cafd2b8cba4e0d144a78f922b7f4b67b9fcb4f1eb60f524540",
  },
  {
    deviceId:
      "6d9c71a3601f0bcaad551c44414d5ee3875a9ef2d8f0e8ae04c68871d6d3f857",
    kind: "audioinput",
    label: "Game Capture HD60 X (Game Capture HD60 X) (0fd9:0082)",
    groupId: "011ae12697417f1648b14b756cefa1af42933bada030d62303f1047aac2b787e",
  },
  {
    deviceId:
      "d6ac77a6d09ee496183b49b7ca75e37be93304aabc5c3e8f37b23d4de068fc4a",
    kind: "audioinput",
    label: "Microphone (6- RODE NT-USB) (19f7:0003)",
    groupId: "cc002cc139e4cc9b60a69a2339c31dd145dcd7046a33c78598edc41d8f4c29df",
  },
  {
    deviceId:
      "16dafab7166f59172d162b1ec820e7b59340eac48a30172d6370bc3ff28940ff",
    kind: "audioinput",
    label: "Microphone (Logitech StreamCam) (046d:0893)",
    groupId: "601830fbbe679ed0dc018b5bfa9e4d6e67a770bbb13a4a1a2ef5a0a8995f662c",
  },
  {
    deviceId:
      "ca8e564026fcbac1d5627068cf8b532f3706bbf3bb258f1e319431817aaf6b73",
    kind: "videoinput",
    label: "Logitech StreamCam (046d:0893)",
    groupId: "601830fbbe679ed0dc018b5bfa9e4d6e67a770bbb13a4a1a2ef5a0a8995f662c",
  },
  {
    deviceId:
      "c142f209ad4c723a2476354cc7d294762a4fb8fb28e168f7ad7d662f660aeff5",
    kind: "videoinput",
    label: "Game Capture HD60 X (0fd9:0082)",
    groupId: "011ae12697417f1648b14b756cefa1af42933bada030d62303f1047aac2b787e",
  },
  {
    deviceId:
      "a02a07ff4c54861f16cb544b53b7e0dc5c94ceeb32d6aad96c74c94e6152c63e",
    kind: "videoinput",
    label: "Cam Link 4K (0fd9:007b)",
    groupId: "6e4e547aa79c0b075ef4ac9679cf369c12e901fb0ab234c26d086f23575ef91f",
  },
  {
    deviceId:
      "9276bdff65d92deceae4c3df7e50d84efdff22ab4ec60124344c51358e3c8c2a",
    kind: "videoinput",
    label: "Logi Capture",
    groupId: "64be8f1d48d8eead2eea1fc92d281c320cdcbaf17f0b3f701b9eef88a0e0eba1",
  },
  {
    deviceId:
      "50f712f1a8c30cbe8a02f9ab13b33c32c01204210a34db27572bd1f928c96860",
    kind: "videoinput",
    label: "LUMIX Webcam Software",
    groupId: "5a694a5713c75196c50dfbe3606d92bcd7d02c7d2e6c0a60a7f5adc95480c0c5",
  },
  {
    deviceId:
      "49659e5373dc3800ae9e4bdd9a44d28d4f2b62ca78fd2e3cb2b2ab6462765860",
    kind: "videoinput",
    label: "OBS Virtual Camera",
    groupId: "fdb8f7cd0527c97096de31cc9da100bd2510e37df0c519a8c9a8f7c5e7db9068",
  },
  {
    deviceId:
      "97278b8041976bec4d5c871f478d45844fff66ffbde95cd6adcedf3f9703f51a",
    kind: "videoinput",
    label: "Elgato Screen Link",
    groupId: "fc06fee6c00e6f47c751109a9ad273cac0f7c73a91f7af2c1b65ad29528224d5",
  },
  {
    deviceId: "default",
    kind: "audiooutput",
    label: "Default - 4 - P27q-20 (AMD High Definition Audio Device)",
    groupId: "02c877482d3b49f2b6e149672386c9eb95669cccb39a6c18b61686868e06f933",
  },
  {
    deviceId: "communications",
    kind: "audiooutput",
    label: "Communications - Speakers (6- RODE NT-USB) (19f7:0003)",
    groupId: "cc002cc139e4cc9b60a69a2339c31dd145dcd7046a33c78598edc41d8f4c29df",
  },
  {
    deviceId:
      "8afd524fffa9854afd8627b5ce98715ab68f68355f4a86bb49770baba9a94a91",
    kind: "audiooutput",
    label: "4 - P27q-20 (AMD High Definition Audio Device)",
    groupId: "02c877482d3b49f2b6e149672386c9eb95669cccb39a6c18b61686868e06f933",
  },
  {
    deviceId:
      "54a6009df5d18a7f3c2752d0666c4206df867bef8c206d24141f6c51065f440c",
    kind: "audiooutput",
    label: "Realtek Digital Output (Realtek(R) Audio)",
    groupId: "342675f34dcf8af4cd3cfee0e158ab6bbb02c7a320624c48da8d2bef648f4f7d",
  },
  {
    deviceId:
      "55cff10ebabfa0bb6a1c2304bf263102865ca92d1d0fff6a5b84fecc2bb2f004",
    kind: "audiooutput",
    label: "Speakers (6- RODE NT-USB) (19f7:0003)",
    groupId: "cc002cc139e4cc9b60a69a2339c31dd145dcd7046a33c78598edc41d8f4c29df",
  },
];

test("remove usb identifier ", () => {
  expect(
    formatLabel({
      deviceId:
        "dc1cdbc69d0aa62f2268026df6613b2d9f3dff499864e3a71485d93177298549",
      kind: "videoinput",
      label: "FaceTime HD Camera (1C1C:B782)",
      groupId:
        "e0448126bddc405488ab7dc9b2ea1cc0f81152d0ff42a87883acb20bf2639ea3",
    }),
  ).toEqual("FaceTime HD Camera");
});

test("remove Speaker tag ", () => {
  expect(
    formatLabel({
      deviceId:
        "4d1eadce39fe6b8f80ccb8289da7b75c2ad498b49d908309bb03d498d36cdecd",
      kind: "audiooutput",
      label: "6- RODE NT-USB (19f7:0003)",
      groupId:
        "ff79c7568dede39d6f434e7b3f25be43225468a5a111ece2f810e25b1b185d42",
    }),
  ).toEqual("RODE NT-USB");
});

test("remove (Built-in) ", () => {
  expect(
    formatLabel({
      deviceId: "default",
      kind: "audioinput",
      label: "Default - MacBook Pro Microphone (Built-in)",
      groupId:
        "b19e9eca3ebcf5031b4daa3c37d90d1d2fe321e6df7b70d288b7b068d98e762c",
    }),
  ).toEqual("Default - MacBook Pro Microphone");
});

test("remove (Virtual) ", () => {
  expect(
    formatLabel({
      deviceId:
        "85ab9579e48914aeb630250c61ff7986b9f615c92762ce549cb53ebed346c327",
      kind: "audioinput",
      label: "Microsoft Teams Audio Device (Virtual)",
      groupId:
        "93813575f4c5246a408e2f25764c747a5bb0936f7861a95e4ab67d19ca581b7d",
    }),
  ).toEqual("Microsoft Teams Audio Device");
});

test("Simple label should stay unaffected ", () => {
  expect(
    formatLabel({
      deviceId:
        "931f56f2372d9681293bad225147f488dc7f49c4bf319d55abf01afbb601b1bd",
      kind: "videoinput",
      label: "LUMIX Webcam Software",
      groupId:
        "30f1fb14b04c7c76a0c73775b2c1eb46361215dd6f6c4c4e94f0c9c777382f01",
    }),
  ).toEqual("LUMIX Webcam Software");
});
