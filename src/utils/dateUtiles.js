import { parse, isValid, format } from "date-fns";

export const parseUKDate = (input) => {
    const parsed = parse(input, "dd-MM-yyyy", new Date());
    return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : null;
  };
