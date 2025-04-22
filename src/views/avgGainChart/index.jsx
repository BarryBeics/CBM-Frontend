import { useEffect, useState, useMemo } from "react";
import { getActivityReports } from "../../graph/getActivityReports";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Box } from "@mui/material";
import { mean } from "lodash";


export default function TopGainersScatterWithTrend() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const themeSettings = {
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            background: colors.primary[400],
            color: colors.primary[100],
          },
        },
      };
  
    // FETCH EFFECT
    const [activityData, setActivityData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const reports = await getActivityReports();
          setActivityData(reports);
          console.log("Raw Activity Data", reports);
        } catch (err) {
          console.error("Failed to load activity reports", err);
        }
      };
    
      fetchData();
    }, []);
            
  
// Prepare scatter data with jittered Qty and trend lines
const { scatterData, trendLines } = useMemo(() => {
    if (!activityData || activityData.length === 0) {
      return { scatterData: [], trendLines: [] };
    }
  
    const jitter = (x) => x + (Math.random() - 0.5) * 2;

    const seriesKeys = [
        { key: 'TopAGain', label: 'Top 3', color: '#E4C2A8' },
        { key: 'TopBGain', label: 'Top 5', color: '#E87C6F' },
        { key: 'TopCGain', label: 'Top 10', color: '#E1A648' },
      ];
      

    const scatter = seriesKeys.map(({ key, label, color }) => ({
        id: label,
        color: color ?? "hsl(0, 0%, 50%)",
        data: activityData
          .filter(entry => typeof entry[key] === "number" && typeof entry.Qty === "number")
          .map((entry) => ({
            x: jitter(entry.Qty),
            y: entry[key],
          })),
      }));
      

    // Compute simple horizontal trend lines (mean values for each series)
    const trends = seriesKeys.map(({ key, label, color }) => {
        const validValues = activityData
          .map(entry => entry[key])
          .filter(val => typeof val === "number");
      
        const yAvg = mean(validValues);
        const qtys = activityData.map(e => e.Qty).filter(q => typeof q === "number");
      
        return {
          id: `${label} Avg`,
          color: color ?? "hsl(0, 0%, 50%)",
          data: [
            { x: Math.min(...qtys), y: yAvg },
            { x: Math.max(...qtys), y: yAvg },
        ],
        trend: true,
      };
    });
      

    return { scatterData: scatter, trendLines: trends };
  }, [activityData]);
  console.log("Trend Lines", trendLines);


  console.log("Final chart data", [...scatterData, ...trendLines]);

  return (
    <Box>
      <Header
        title="TOP GAINERS CHART"
        subtitle="Here you will see the price data we hold for a given pair"
      />

      <Box height="500px">
      <ResponsiveScatterPlot
        data={scatterData}          
        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
        xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
        enableGridY={false} 
        enableGridX={false}
        blendMode="normal"
        axisBottom={{
          legend: 'Quantity of Gainers',
          legendPosition: 'middle',
          legendOffset: 46,
        }}
        axisLeft={{
          legend: 'Average % Gain',
          legendPosition: 'middle',
          legendOffset: -60,
        }}
        legends={[{
          anchor: 'top-right',
          direction: 'column',
          translateX: 130,
          itemWidth: 100,
          itemHeight: 12,
          itemsSpacing: 5,
          symbolSize: 12,
        }]}
        layers={[
            'grid',
            'axes',
            'nodes',
            ({ xScale, yScale }) => (
              <>
                {trendLines.map((line) => {
                  const [start, end] = line.data;
                  if (!start || !end) return null;
          
                  return (
                    <line
                      key={line.id}
                      x1={xScale(start.x)}
                      x2={xScale(end.x)}
                      y1={yScale(start.y)}
                      y2={yScale(end.y)}
                      stroke={line.color}
                      strokeWidth={3}
                      strokeDasharray="6 4"
                    />
                  );
                })}
              </>
            ),
            'mesh',
            'legends',
          ]}
          
          
        theme={themeSettings}
      />
      </Box>
    </Box>
  );
}
