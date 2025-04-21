export function calculateSMA(data, duration) {
    const smaData = [];
    const adjusted = duration * 300;
  
    for (let i = 0; i < data.length; i++) {
      if (i >= duration - 1) {
        const sum = data
          .slice(i - duration + 1, i + 1)
          .reduce((acc, entry) => acc + Number.parseFloat(entry.Pair[0].Price), 0);
        const avg = sum / duration;
        smaData.push({ Timestamp: data[i].Timestamp + adjusted, SMA: avg });
      }
    }
  
    return smaData;
  }
  