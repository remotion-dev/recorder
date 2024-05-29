import { MaxResolution } from "./helpers/get-max-resolution-of-device";

const deviceRow: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  paddingTop: 10,
  paddingBottom: 10,
  borderBottom: "1px solid #333",
  cursor: "pointer",
};

const spacer: React.CSSProperties = {
  width: 8,
};

const label: React.CSSProperties = {
  fontSize: 14,
};

const subLabel: React.CSSProperties = {
  ...label,
  opacity: 0.7,
};

const iconStyle: React.CSSProperties = {
  width: 16,
  height: 16,
};

const MaxResolutionLabel: React.FC<{
  maxResolution: MaxResolution | null;
}> = ({ maxResolution }) => {
  if (maxResolution === null) {
    return null;
  }

  return (
    <span style={subLabel}>
      {maxResolution.width}x{maxResolution.height}
    </span>
  );
};

export const CameraIcon: React.FC = () => {
  return (
    <svg style={iconStyle} viewBox="0 0 576 512">
      <path
        fill="#eee"
        d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"
      />
    </svg>
  );
};

export const MicIcon: React.FC = () => {
  return (
    <svg style={iconStyle} viewBox="0 0 384 512">
      <path
        fill="#eee"
        d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"
      />
    </svg>
  );
};

export const DisplayIcon: React.FC = () => {
  return (
    <svg style={iconStyle} viewBox="0 0 576 512">
      <path
        fill="#eee"
        d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64H240l-10.7 32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H346.7L336 416H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM512 64V352H64V64H512z"
      />
    </svg>
  );
};

export const DeviceItem: React.FC<{
  deviceLabel: string;
  type: "camera" | "microphone" | "screen";
  maxResolution: MaxResolution | null;
  handleClick: () => void;
}> = ({ deviceLabel, type, handleClick, maxResolution }) => {
  return (
    <div onClick={handleClick} style={deviceRow}>
      {type === "camera" ? <CameraIcon></CameraIcon> : null}
      {type === "microphone" ? <MicIcon></MicIcon> : null}
      {type === "screen" ? <DisplayIcon></DisplayIcon> : null}
      <div style={spacer}></div> <span style={label}>{deviceLabel}</span>
      <div style={{ flex: 1 }}></div>
      <MaxResolutionLabel maxResolution={maxResolution}></MaxResolutionLabel>
    </div>
  );
};
