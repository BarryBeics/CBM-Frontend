import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';
import testSymbols from '../../../data/testSymbols.json';
import Dropdown from '../../primatives/Dropdown/dropdown';

interface PairData {
  Timestamp: number;
  Pair: { Symbol: string; Price: string }[];
}

interface ChartPageProps {
  graphqlEndpoint: string;
}

const ChartPage: React.FC<ChartPageProps> = ({ graphqlEndpoint }) => {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [timeFrameQty, setTimeFrameQty] = useState<number>(0);
  const [pairsData, setPairsData] = useState<PairData[]>([]);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const pairsChart = useRef<Chart | null>(null);

  // Fetch dropdown options on mount
  useEffect(() => {
      try {
        setOptions(testSymbols.symbols || []);
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
      }
    }, []);

  // Fetch price data
  useEffect(() => {
    const fetchData = async () => {
      if (selectedSymbol && timeFrameQty > 0) {
        const query = `
          query getPriceData($symbol: String!, $limit: Int!) {
            getHistoricPrice(symbol: $symbol, limit: $limit) {
              Pair {
                Symbol
                Price
              }
              Timestamp
            }
          }
        `;

        const variables = { symbol: selectedSymbol, limit: timeFrameQty };
        try {
          console.log('Fetching price data with:', variables); // Log query variables
          const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
        });
        const result = await response.json();
        console.log('API Response:', result); // Log full response

        if (result.errors) {
          console.error('GraphQL Error:', result.errors);
        }

        setPairsData(result.data?.getHistoricPrice || []);
        } catch (error) {
          console.error('Error fetching price data:', error);
        }
      }
    };

    fetchData();
  }, [selectedSymbol, timeFrameQty, graphqlEndpoint]);

  // Update the chart
  useEffect(() => {
    console.log('Pairs Data:', pairsData); // Log before processing

    if (pairsData.length > 0 && chartRef.current) {
      const labels = pairsData.map((entry) =>
        new Date(entry.Timestamp * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      );
      const prices = pairsData.map((entry) => {
      console.log('Price Entry:', entry.Pair); // Log price data
      return Number.parseFloat(entry.Pair[0].Price);
    });

    console.log('Chart Labels:', labels);
    console.log('Chart Prices:', prices);

    const data = {
        labels: labels.reverse(),
        datasets: [
          {
            label: 'Price',
            data: prices.reverse(),
            borderColor: '#BB86FC',
            borderWidth: 2,
            fill: false,
          },
        ],
      };

      const config: ChartConfiguration = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'Pairs Data',
            },
          },
        },
      };

      // Destroy existing chart and create a new one
      if (pairsChart.current) {
        pairsChart.current.destroy();
      }
      pairsChart.current = new Chart(chartRef.current, config);
    }
  }, [pairsData]);

  return (
    <section className="container-xl overflow-hidden">
      <div className="row g-2">
        <div className="col">
          <div className="p-3">
            <div className="row">
              <div className="col-md-3 col-sm-12">
                <h1>TRADING PAIRS</h1>
                <p>Here you will see the price data we hold for a given pair.</p>
              </div>
              <div className="col-md-9 col-sm-12">
                <div className="row">
                  <div className="col-md-5 col-sm-12">
                    <div className="box-style">
                      <label htmlFor="strategy" className="title">
                        Trading Pair Tickers:
                      </label>
                      <Dropdown
                        options={options}
                        selectedOption={selectedSymbol}
                        setSelectedOption={setSelectedSymbol}
                        id="strategy"
                      />
                    </div>
                  </div>
                  <div className="col-md-7 col-sm-12">
                    <div className="box-style">
                      <label htmlFor="timeFrameQty" className="title">
                        How far back (mins)
                      </label>
                      <input
                        type="range"
                        id="timeFrameQty"
                        value={timeFrameQty}
                        onChange={(e) => setTimeFrameQty(Number(e.target.value))}
                        min={0}
                        max={45000}
                        step={5}
                        className="slider"
                      />
                      <div className="value">
                        <label htmlFor="timeFrame" id="timeFrame">
                          {timeFrameQty}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="options-form-item-full">
                  <div className="row">
                    <canvas ref={chartRef} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChartPage;
