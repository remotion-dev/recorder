import { expect, test } from "bun:test";
import { formatLabel } from "../src/helpers";

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

test("Linkbuds S test ", () => {
  expect(
    formatLabel({
      deviceId:
        "50a6694639ca4046a0417487bdf7b7d7ff9ebecdacfdedbb1e475d9249b177c5",
      kind: "audioinput",
      label: "LinkBuds S (Bluetooth)",
      groupId:
        "dae9f3ee3a2cf4de69f8ee812e97abb7838ca7ae6e66184f455d34e184353005",
    }),
  ).toEqual("LinkBuds S");
});
