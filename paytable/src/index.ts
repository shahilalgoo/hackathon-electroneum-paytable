import { generateSharePaytable, getShareAmount } from "./share-based-paytable";
import { RoundToDP } from "./utils/round-dp";
import { logEntireArray } from "./utils/log-entire-array";
import { sumPayTable } from "./utils/sum-paytable";

// Constants
const prizePoolShare = 0.7; // 70 percent of revenue goes to the prize pool // ❗
const totalPaidPercentage = 0.3; // 30 percent of total participants will be paid // ❗

// Inputs
const ticketPrice = 2;
const totalParticipants = 120;

// Variables 
let totalPrizePool = 0;
let totalInPaytable = 0;
let totalPlacesPaid = 0;

// Calculate prize pool, rounded
totalPrizePool = prizePoolShare * totalParticipants * ticketPrice;

// Calculate paid places, rounded down 
totalPlacesPaid = Math.floor(totalPaidPercentage * totalParticipants);

// Initialize paytable
const payTable = new Array(totalPlacesPaid).fill(0);

// 2/3 of the bottom paytable with get their money back
const moneyBackTotalPlayers = Math.round((2/3) * payTable.length);
const moneyBackTotal = moneyBackTotalPlayers * ticketPrice;

for (let i = totalPlacesPaid - moneyBackTotalPlayers; i < totalPlacesPaid; i++) {
    payTable[i] = ticketPrice;
}

const top10PercentPlaces = totalPlacesPaid - moneyBackTotalPlayers;
const inbetweenersMultiplier = 2;

let toppersAmount = Math.floor(top10PercentPlaces * 0.3);

let inbetweenerReward = 0;
let moneyInbetweenersTotal = 0;
let lastTopperReward = 0;
let toppersPrizePool = 0;

while (lastTopperReward <= inbetweenerReward) {
    let inbetweenersAmount = top10PercentPlaces < toppersAmount? 0 : top10PercentPlaces - toppersAmount;
    
    if (top10PercentPlaces < toppersAmount) toppersAmount = top10PercentPlaces;
    moneyInbetweenersTotal = inbetweenersAmount * ticketPrice * inbetweenersMultiplier
    
    const { share } = getShareAmount(toppersAmount);
    toppersPrizePool = totalPrizePool - (moneyBackTotal + moneyInbetweenersTotal);
    
    // the last topper gets only 1 share
    lastTopperReward = share * toppersPrizePool;
    inbetweenerReward = ticketPrice * inbetweenersMultiplier;
    
    // adjust topper amount until the last topper receives more than the inbetweeners
    if (lastTopperReward < inbetweenerReward) toppersAmount--;
}

console.log("Toppers:", toppersAmount);
const toppersTable = generateSharePaytable(toppersAmount, toppersPrizePool);

for (let i = 0; i < toppersTable.length; i++) {
payTable[i] = toppersTable[i];
}

for (let i = toppersAmount; i < top10PercentPlaces; i++) {
payTable[i] = RoundToDP(inbetweenerReward, 3);
}

totalInPaytable = sumPayTable(payTable);

logEntireArray(payTable);
console.log("Players:", totalParticipants, " Price:", ticketPrice);
console.log("Prize Pool: ", totalPrizePool);
console.log("Total money back (bottom 2/3 players):", moneyBackTotal);
console.log("Money left after money back:", totalPrizePool - moneyBackTotal);
console.log("Total for inbetweeners", moneyInbetweenersTotal);
console.log("Total in Paytable:", totalInPaytable);



