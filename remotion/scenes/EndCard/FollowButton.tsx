import type { Platform } from "../../../config/endcard";
import {
  ENDCARD_FONT_FAMILY,
  ENDCARD_FONT_WEIGHT,
} from "../../../config/fonts";
import type { Theme } from "../../../config/themes";
import { COLORS } from "../../../config/themes";

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
        fontFamily: ENDCARD_FONT_FAMILY,
        fontSize: 50,
        fontWeight: ENDCARD_FONT_WEIGHT,
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
