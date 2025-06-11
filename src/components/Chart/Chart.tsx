import { ResponsiveBump } from "@nivo/bump";

type NivoBumpDatum = { x: string; y: number } | { x: string; y: null };

type BumpDatum = NivoBumpDatum;

export type BumpData = {
  id: string;
  permalink?: string;
  data: BumpDatum[];
}[];

export type BumpDataM = {
  [id: string]: BumpDatum[];
};

interface Props {
  data: BumpData;
}

export const RedditRankChart = ({ data }: Props) => {
  if (!data) {
    return null;
  }

  data = data.map((datum) => {
    return {
      ...datum,
      data: datum.data.sort((a, b) => {
        if (a.x < b.x) {
          return -1;
        }
        if (a.x == b.x) {
          return 0;
        }
        return 1;
      }),
    };
  });

  return (
    <ResponsiveBump
      data={data}
      axisBottom={{
        tickRotation: 75,
        tickValues: "auto", // Automatically choose tick values for time
      }}
      interpolation={"linear"}
      xPadding={0}
      animate={false}
      theme={{ tooltip: { container: { color: "black" } } }}
      xOuterPadding={0}
      colors={{ scheme: "category10" }}
      lineWidth={3}
      activeLineWidth={6}
      inactiveLineWidth={3}
      inactiveOpacity={0.8}
      pointSize={2}
      activePointSize={16}
      inactivePointSize={0}
      pointColor={{ from: "inherit" }}
      pointBorderWidth={6}
      activePointBorderWidth={3}
      enableGridY={false}
      axisTop={null}
      pointBorderColor={{ from: "serie.color" }}
      axisLeft={{ legend: "Ranking", legendOffset: -40 }}
      margin={{ top: 40, right: 160, bottom: 140, left: 60 }}
      onClick={(serie) => {
        window.open("https://reddit.com" + serie.data.permalink);
      }}
    />
  );
};
