// React
import { useEffect, useState } from "react";

// Graph
import { getBotNames } from "../graph/strategies/getBotNames";

// Static data
import namesJson from "../data/names.json";

const useAvailableBotNames = (refreshTrigger = 0) => {
  const [options, setOptions] = useState<string[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies
  useEffect(() => {
    const fetchBotNames = async () => {
      try {
        const usedNames = await getBotNames();
        const jsonNames = namesJson.bot_names || [];
        const availableNames = jsonNames.filter(
          (name) => !usedNames.includes(name)
        );
        setOptions(availableNames);
      } catch (err) {
        console.error("Failed to load bot names", err);
      }
    };

    fetchBotNames();
  }, [refreshTrigger]);

  return options;
};

export default useAvailableBotNames;
