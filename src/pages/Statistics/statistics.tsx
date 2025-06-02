import {useSearchParams} from "react-router";
import {Button, DatePicker, Flex, Typography} from "antd";
import {type BumpData, type BumpDataM, RedditRankChart} from "../../components/Chart/Chart.tsx";
import {useEffect, useState} from "react";
import {type GetStatistic, GetStatistics, Granularity} from "../../client/https.ts";
import domtoimage from 'dom-to-image';
import {timeFormat} from 'd3';
import {Colors} from "../../colors";

const {RangePicker} = DatePicker;
import dayjs from 'dayjs';


const format = timeFormat("%Y-%m-%d %H:%M:%S");

export function StatisticsPage({mkServerUrl}: { mkServerUrl: string }) {
    const [searchParams, setSearchParams] = useSearchParams();


    const [stats, setStats] = useState<BumpData | null>()

    const sName = searchParams.get('subreddit_name') || "";
    const orderBy = searchParams.get('order_by') || "";
    const t = searchParams.get('posts_created_within_past') || "";
    const from_time = searchParams.get('from_time') || "";
    const to_time = searchParams.get('to_time') || "";
    const backfill = searchParams.get('backfill') || "";


    const fileName = `${sName}_${orderBy}_${t}_FROM_${from_time}_TO_${to_time}`


    const getParamsCsv = {
        subreddit_name: sName,
        rank_order_type: orderBy,
        rank_order_created_within_past: t,
        granularity: Granularity.Hour,
        from_time: from_time,
        to_time: to_time,
    };

    useEffect(() => {
        (async () => {
            const _getParams = {
                subreddit_name: sName,
                rank_order_type: orderBy,
                rank_order_created_within_past: t,
                granularity: Granularity.Hour,
                from_time: from_time,
                to_time: to_time,
            }
            const getParamsJson = {..._getParams, backfill};

            const stats = await GetStatistics(mkServerUrl, getParamsJson, 'application/json') as GetStatistic[];

            // stat -> datum
            // .title -> id
            // .polled_time_rounded_min -> x
            // .rank -> y
            // .perma_link_path -> desc

            const ksIdToLabel: { [id: string]: string } = {}
            const ksIdToPermaLink: { [link: string]: string } = {}
            for (const s of stats) {
                ksIdToLabel[s.data_ks_id] = s.title
                ksIdToPermaLink[s.data_ks_id] = s.perma_link_path
            }

            const dM = stats.reduce((acc, stat) => {
                const series = acc[stat.data_ks_id] || [];

                console.log(format(new Date(stat.polled_time_rounded_min)))
                const point = {
                    "x": format(new Date(stat.polled_time_rounded_min)),
                    // "x": stat.polled_time_rounded_min,
                    "y": stat.rank,
                    "synthetic": stat.is_synthetic,
                    "raw_id": stat.data_ks_id,
                    "raw_title": stat.title,
                }
                return {...acc, [stat.data_ks_id]: [...series, point]};
            }, {} as BumpDataM);

            const data = Object.keys(dM).map((ksId, i) => {
                return {
                    id: ksIdToLabel[ksId].trim().length === 0 ? `${ksId}-${i}` : ksIdToLabel[ksId],
                    permalink: ksIdToPermaLink[ksId],
                    data: dM[ksId]
                }
            });
            setStats(data)
            // cleansing
            console.log(data)
            console.log(`len ${stats.length} stats.`)
        })();

    }, [from_time, mkServerUrl, orderBy, sName, t, to_time])


    function downloadSVG() {

        const e = document.getElementById('statsgraphcontainer-1')
        if (!e) {
            return
        }
        domtoimage.toSvg(e)
            .then(function (dataUrl: string) {
                const link = document.createElement('a');
                link.download = `${fileName}.svg`;
                link.href = dataUrl;
                link.click();
            });
    }


    function downloadCSV() {
        GetStatistics(mkServerUrl, getParamsCsv, 'text/csv').then(function (value) {
            const v = value as string;
            const blob = new Blob([v], {type: 'text/csv'});
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${fileName}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }


    return <Flex
        style={{width: '100%', height: "100%", justifyContent: "start", alignItems: "center", flexDirection: "column"}}>
        <Flex style={{width: "90%", flexDirection: "column"}}>
            <Typography.Title>{`r/${sName}`}
                <Typography>
                    {`ordered by ${orderBy} for posts created within a ${t}.`}
                </Typography>
            </Typography.Title>
            <Flex style={{width: "100%"}}>
                <RangePicker
                    presets={[
                        {
                            label: <span aria-label="Start of Day Til Now">Now ~ EOD</span>,
                            value: () => [dayjs().startOf('day'), dayjs()], // 5.8.0+ support function
                        },
                    ]}
                    showTime
                    format="YYYY/MM/DD HH:mm:ss"
                    defaultValue={[dayjs(from_time), dayjs(to_time)]}

                    onChange={dates => {
                        console.log(dates);
                        if (!dates || dates.length < 2) {
                            return;
                        }
                        const [start, end] = dates;

                        setSearchParams(p => {
                            if (start) {
                                p.set("from_time", start.toISOString());
                            }
                            if (end) {
                                p.set("to_time", end.toISOString());
                            }
                            console.log(p)
                            return p
                        })
                    }}
                />
                <Flex style={{width: "fit-content", marginLeft: "auto"}}>

                    <Button style={{width: "fit-content"}} onClick={downloadCSV}>💾 CSV</Button>
                    <Button style={{width: "fit-content"}} onClick={downloadSVG}>💾 SVG</Button>
                </Flex>
            </Flex>
        </Flex>
        <Flex id={"statsgraphcontainer-1"} className={"statsgraphcontainer"}
              style={{
                  flexGrow: 1,
                  height: "fit-content",
                  width: "90%",
                  overflowY: "scroll",
                  borderRadius: "4px",
                  border: `1px solid ${Colors.CHARBLACK}`,
                  flexDirection: "column",
              }}>
            {/*{stats && <Flex style={{  justifyContent: "center"}}> <Typography style={{margin: 0, padding:0,}}>{`r/${sName} | ${orderBy} | ${t}`}</Typography></Flex> }*/}
            {stats && <RedditRankChart data={stats}/>}
        </Flex>
        {/*<Flex className={"statsgraphcontainer"} style={{flexGrow:1, height: "max-content", width: "100%", overflowY: "scroll"}}>{stats && <RedditRankChart data={stats} />}</Flex>*/}
    </Flex>;
}