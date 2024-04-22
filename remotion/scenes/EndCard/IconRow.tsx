import type { Platform } from "../../../config/endcard";
import {
  ENDCARD_FONT_FAMILY,
  ENDCARD_FONT_WEIGHT,
} from "../../../config/fonts";
import type { Theme } from "../../../config/themes";
import { COLORS } from "../../../config/themes";
import { followButtonHeight } from "./FollowButton";
import {
  InstagramIcon,
  LinkedInIcon,
  LinkIcon,
  XIcon,
  YouTubeIcon,
} from "./icons";

const iconContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 60,
  width: followButtonHeight,
};

const iconRow: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  paddingTop: 20,
  paddingBottom: 20,
};

export const spaceBetweenImgAndText = 30;

export const IconRow: React.FC<{
  type: Platform | "link";
  label: string;
  opacity: number;
  theme: Theme;
}> = ({ type, label, opacity, theme }) => {
  const labelStyle: React.CSSProperties = {
    fontSize: 50,
    fontFamily: ENDCARD_FONT_FAMILY,
    fontWeight: ENDCARD_FONT_WEIGHT,
    marginLeft: 20,
    color: COLORS[theme].ENDCARD_TEXT_COLOR,
  };

  return (
    <div style={{ ...iconRow, opacity }}>
      <div style={iconContainer}>
        {type === "link" ? <LinkIcon theme={theme} height={60} /> : null}
        {type === "youtube" ? <YouTubeIcon theme={theme} height={60} /> : null}
        {type === "x" ? <XIcon theme={theme} height={60} /> : null}
        {type === "instagram" ? (
          <InstagramIcon theme={theme} height={70} />
        ) : null}
        {type === "linkedin" ? (
          <LinkedInIcon theme={theme} height={60} />
        ) : null}
      </div>
      <div style={{ width: spaceBetweenImgAndText }} />
      <div style={labelStyle}>{label}</div>
    </div>
  );
};
