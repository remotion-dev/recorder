import { AbsoluteFill } from "remotion";
import { REGULAR_FONT_FAMILY, REGULAR_FONT_WEIGHT } from "../config/fonts";
import { SERVER_PORT } from "../config/server";
import { COLORS } from "../config/themes";
import { WaitForFonts } from "./helpers/WaitForFonts";

const container: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  fontFamily: REGULAR_FONT_FAMILY,
  fontSize: 30,
  fontWeight: REGULAR_FONT_WEIGHT,
  textAlign: "center",
};

const link: React.CSSProperties = {
  color: COLORS.light.ACCENT_COLOR,
  textDecoration: "underline",
};

export const GoToRecorder: React.FC = () => {
  return (
    <WaitForFonts>
      <AbsoluteFill style={container}>
        The recording interface is running on http://localhost:{SERVER_PORT}.
        <a
          target="_blank"
          style={link}
          href={`http://localhost:${SERVER_PORT}`}
        >
          Go there
        </a>
      </AbsoluteFill>
    </WaitForFonts>
  );
};
