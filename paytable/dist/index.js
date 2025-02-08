"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const share_based_paytable_1 = require("./share-based-paytable");
const log_entire_array_1 = require("./utils/log-entire-array");
const shareBasedPaytable = (0, share_based_paytable_1.generateSharePaytable)(200, 5000);
(0, log_entire_array_1.logEntireArray)(shareBasedPaytable);
