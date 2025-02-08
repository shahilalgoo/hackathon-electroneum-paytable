import { generateSharePaytable } from "./share-based-paytable";
import { logEntireArray } from "./utils/log-entire-array";

const shareBasedPaytable = generateSharePaytable(200, 5000);

logEntireArray(shareBasedPaytable);


