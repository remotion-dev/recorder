import { COLORS } from "../../colors";
import {
  subtitleFont,
  subtitleFontWeight,
  type Platform,
  type Theme,
} from "../../configuration";

export const followButtonHeight = 140;

export const FollowButton: React.FC<{
  platform: Platform;
  theme: Theme;
  isLinkedInBusinessPage: boolean;
}> = ({ platform, theme, isLinkedInBusinessPage }) => {
  return (
    <div
      style={{
        height: followButtonHeight,
        borderRadius: followButtonHeight / 2,
        width: 400,
        backgroundColor: COLORS[theme].CTA_BUTTON_BACKGROUND_COLOR,
        color: COLORS[theme].CTA_BUTTON_COLOR,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: subtitleFont,
        fontSize: 50,
        fontWeight: subtitleFontWeight,
      }}
    >
      {platform === "youtube"
        ? "Subscribe"
        : platform === "linkedin"
        ? isLinkedInBusinessPage
          ? "Follow"
          : "Connect"
        : "Follow"}
    </div>
  );
};
