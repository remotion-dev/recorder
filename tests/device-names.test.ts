type SimpleMediaDeviceInfo = Omit<MediaDeviceInfo, "toJSON">;

const devices: SimpleMediaDeviceInfo[] = [
  {
    deviceId: "default",
    kind: "audioinput",
    label: "Default - Microphone (Logitech StreamCam) (046d:0893)",
    groupId: "157bcd4ef432f9d148945572a10a534cad551829fa22bac0fb23a6738c7718f8",
  },
  {
    deviceId: "communications",
    kind: "audioinput",
    label: "Communications - Microphone (Logitech StreamCam) (046d:0893)",
    groupId: "157bcd4ef432f9d148945572a10a534cad551829fa22bac0fb23a6738c7718f8",
  },
  {
    deviceId:
      "698e00ea508d635fff106bca6fbf2441334d333f0a8a4c5d0b18ba9e4a48cc75",
    kind: "audioinput",
    label: "HDMI (2- Cam Link 4K) (0fd9:007b)",
    groupId: "6ce5732d7d1cb242d777c9c64c9ee87868a67af1b4d6c040e8728192c1fd8eb9",
  },
  {
    deviceId:
      "0542e1ad02f2540cb3d98564f8493d2cee36060e8ddc4f972441297e09f0eebd",
    kind: "audioinput",
    label: "Line (Elgato Sound Capture)",
    groupId: "57f1c4c1e7f85bf6225660078d14eb5b7b516afe67f4b1b75813f3bfb21636c2",
  },
  {
    deviceId:
      "4e3bbe6d8196f774978676235abb52e8423639a1f9cafce76249f66527749bb2",
    kind: "audioinput",
    label: "Game Capture HD60 X (Game Capture HD60 X) (0fd9:0082)",
    groupId: "36d48072aece2a97e84cabe3a00bd2063482fbe7e176d09478f1109ffaa12b24",
  },
  {
    deviceId:
      "f705e909b1036b4495913f4de3e1be03317512d73a3ce7c376a0fe01132e034f",
    kind: "audioinput",
    label: "Microphone (6- RODE NT-USB) (19f7:0003)",
    groupId: "ff79c7568dede39d6f434e7b3f25be43225468a5a111ece2f810e25b1b185d42",
  },
  {
    deviceId:
      "9740a331fef4519b27aa41d38efc1cf883cabda9a01b344350e2bd5fb0c447c4",
    kind: "audioinput",
    label: "Microphone (Logitech StreamCam) (046d:0893)",
    groupId: "157bcd4ef432f9d148945572a10a534cad551829fa22bac0fb23a6738c7718f8",
  },
  {
    deviceId:
      "a8cf9b118062299f5f0888d4fa27b580ee41c5f1ab975b77d6cd3983349160bb",
    kind: "videoinput",
    label: "Logitech StreamCam (046d:0893)",
    groupId: "157bcd4ef432f9d148945572a10a534cad551829fa22bac0fb23a6738c7718f8",
  },
  {
    deviceId:
      "e71ca3cd3d377146c879c450bb14bf731aae0133e372243a96473777f6d3c8cd",
    kind: "videoinput",
    label: "Game Capture HD60 X (0fd9:0082)",
    groupId: "36d48072aece2a97e84cabe3a00bd2063482fbe7e176d09478f1109ffaa12b24",
  },
  {
    deviceId:
      "dc5fbfd328cd09913b1f6b8ba0c8a5dec2a1d75457f35ba5a9fa24ac28ae7c31",
    kind: "videoinput",
    label: "Cam Link 4K (0fd9:007b)",
    groupId: "6ce5732d7d1cb242d777c9c64c9ee87868a67af1b4d6c040e8728192c1fd8eb9",
  },
  {
    deviceId:
      "ed5e440d425fe0d64dfe0b80606777f5ea12605b85b831ee18179e50f1058591",
    kind: "videoinput",
    label: "Logi Capture",
    groupId: "72342ff82241f8f38abdcbb8c4009d075f553af656f77498507099e8fdf09a64",
  },
  {
    deviceId:
      "931f56f2372d9681293bad225147f488dc7f49c4bf319d55abf01afbb601b1bd",
    kind: "videoinput",
    label: "LUMIX Webcam Software",
    groupId: "30f1fb14b04c7c76a0c73775b2c1eb46361215dd6f6c4c4e94f0c9c777382f01",
  },
  {
    deviceId:
      "55c3cc1b445ba76c6a3a3426d271cfb406554a6750171415b1c917e87e702776",
    kind: "videoinput",
    label: "OBS Virtual Camera",
    groupId: "2cc1d211c61eff627674358ca3f8adbe5eaf5997fe841dae29c4f81caf93084f",
  },
  {
    deviceId:
      "f2dbba203cd1deab50efb7daf3a17995fc8f87e5fadecb077ae520551d9cd2e1",
    kind: "videoinput",
    label: "Elgato Screen Link",
    groupId: "0042479ce568432ac6ea86ec9d2771b37a8beb6182a9874ad7757616753afe78",
  },
  {
    deviceId: "default",
    kind: "audiooutput",
    label: "Default - 4 - P27q-20 (AMD High Definition Audio Device)",
    groupId: "46dc4a79485a81472019ea852a751daf00f84f240172f734a658bc8784c94d88",
  },
  {
    deviceId: "communications",
    kind: "audiooutput",
    label: "Communications - Speakers (6- RODE NT-USB) (19f7:0003)",
    groupId: "ff79c7568dede39d6f434e7b3f25be43225468a5a111ece2f810e25b1b185d42",
  },
  {
    deviceId:
      "f4c7141d9500d0967bed75087917597fdf1233caabd8687f1874020ab45b728a",
    kind: "audiooutput",
    label: "4 - P27q-20 (AMD High Definition Audio Device)",
    groupId: "46dc4a79485a81472019ea852a751daf00f84f240172f734a658bc8784c94d88",
  },
  {
    deviceId:
      "85ba31a1df20e4e1ec2542cf2518da5455c01fe1c0ce25960d7ede0ee3e6ed97",
    kind: "audiooutput",
    label: "Realtek Digital Output (Realtek(R) Audio)",
    groupId: "e7908f0e54ae3e69142757740cf7808e15512404546170e4c71434a36ad47e1c",
  },
  {
    deviceId:
      "4d1eadce39fe6b8f80ccb8289da7b75c2ad498b49d908309bb03d498d36cdecd",
    kind: "audiooutput",
    label: "Speakers (6- RODE NT-USB) (19f7:0003)",
    groupId: "ff79c7568dede39d6f434e7b3f25be43225468a5a111ece2f810e25b1b185d42",
  },
];
