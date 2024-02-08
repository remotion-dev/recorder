import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { transitionDuration } from "../../configuration";
import { borderRadius } from "../../layout/get-layout";
import { safeSpace } from "../../layout/safe-space";

export const TitleCard: React.FC<{
  title: string;
  image: string;
  youTubePlug: boolean;
}> = ({ title, image, youTubePlug }) => {
  const { fps, width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const show = (delay: number) =>
    spring({
      fps,
      frame,
      durationInFrames: transitionDuration,
      config: {
        damping: 200,
      },
      delay,
    });

  const desiredImageWidth = width - safeSpace("square") * 2;
  const actualImageHeight = Math.min(
    height * 0.7,
    (desiredImageWidth / 16) * 9,
  );
  const actualImageWidth = (actualImageHeight / 9) * 16;

  return (
    <AbsoluteFill>
      <Sequence from={6}>
        <Audio src={staticFile("sounds/whipwhoosh2.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={20}>
        <Audio src={staticFile("sounds/whipwhoosh.mp3")} volume={0.5} />
      </Sequence>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: youTubePlug ? `translateY(-${150}px)` : undefined,
        }}
      >
        <div
          style={{
            overflow: "hidden",
            borderRadius,
          }}
        >
          <Img
            style={{
              width: actualImageWidth,
              height: actualImageHeight,
              transform: `scale(${
                show(6) + interpolate(frame, [0, 100], [0, 0.1])
              })`,
            }}
            src={image}
          />
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `translateY(${
            actualImageHeight / 2 - (youTubePlug ? 150 : 0)
          }px)`,
        }}
      >
        <div
          style={{
            fontFamily: "GT Planar",
            fontSize: 60,
            color: "#000",
            lineHeight: 1.1,
            fontWeight: "bolder",
            border: "10px solid black",
            borderRadius: 20,
            padding: "15px 40px",
            display: "inline",
            background: "#fff",
            position: "absolute",
            transform: `scale(${show(20)})`,
          }}
        >
          {title}
        </div>
      </AbsoluteFill>
      {youTubePlug ? (
        <AbsoluteFill>
          <h1
            style={{
              fontFamily: "GT Planar",
              fontSize: 50,
              textAlign: "center",
              lineHeight: 1.5,
              marginTop: 780,
            }}
          >
            <p>
              Watch the full video on{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                style={{
                  verticalAlign: "-0.125em",
                }}
                viewBox="0 0 576 512"
              >
                <path
                  fill="#EA3323"
                  d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
                />
              </svg>{" "}
              YouTube <br />
              First link below{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 384 512"
                style={{
                  verticalAlign: "-0.125em",
                  marginLeft: 10,
                  transform: "translateY(" + Math.sin(frame / 20) * 10 + "px)",
                }}
              >
                <path d="M214.6 454.6L192 477.3l-22.6-22.6-144-144L2.7 288 48 242.8l22.6 22.6L160 354.8 160 64l0-32 64 0 0 32 0 290.7 89.4-89.4L336 242.8 381.3 288l-22.6 22.6-144 144z" />
              </svg>
            </p>
          </h1>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
