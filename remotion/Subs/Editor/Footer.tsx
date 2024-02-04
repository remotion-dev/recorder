import React from "react";
import { FOOTER_HEIGHT, SIDE_PADDING } from "./layout";

export const SubsEditorFooter: React.FC<{
  fileName: string;
}> = ({ fileName }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: FOOTER_HEIGHT,
        width: "100%",
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0), white 20%)",
        position: "absolute",
        bottom: 0,
        paddingTop: 20,
        paddingLeft: SIDE_PADDING,
        paddingRight: SIDE_PADDING,
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontFamily: "sans-serif",
          color: "gray",
          flex: 1,
        }}
      >
        Changes will be saved to {fileName}.
        <br />
        {"Don't"} edit the file manually while using this editor.
      </div>
      <div>
        <button
          style={{
            backgroundColor: "black",
            fontSize: 30,
            color: "white",
            borderRadius: 7,
            padding: "12px 30px",
          }}
          type={"button"}
        >
          Save
        </button>
      </div>
    </div>
  );
};
