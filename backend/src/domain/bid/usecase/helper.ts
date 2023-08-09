// helper to check if product is still valid based on the created_at and time_window

export const isTimeWindowProductValid = (createdAt: Date, timeWindow: number): boolean => {
    // Calculate the expiration time based on the created_at and time_window
    const expirationTime = new Date();
    expirationTime.setHours(createdAt.getHours() + timeWindow);
  
    // Get the current time
    const currentTime = new Date();
  
    // Check if the current time is before the expiration time in milliseconds (UTC)
    if (currentTime.getTime() < expirationTime.getTime()) {
      // Buyer can bid on the item
      return true;
    }

    throw new Error("EXPIRED_PRODUCT");
}

export const isPriceValid = (currentPrice: Number, submittedPrice: Number) => {
  /**
   * add as many rules in here eg: 
   * can only bid * with certain multiple eg: 1000, 2000, 3000 * not accepting 1500, 1600, 1800, 2250, etc
   * 
   * can only bid within range max 100% from the current_price, to maintain the health of the bidding experience
   * 
   * can bid with 50% more than the remaining balance
   * 
   * etc, etc, etc
   */

  // if submitted price is equal to current price
  if (currentPrice === submittedPrice) {
    throw new Error('SAME_PRICE');
  }

  // if submitted price is lower than current price
  if (currentPrice > submittedPrice) {
    throw new Error('TOO_LOW_PRICE');
  }
}

export const isUserBalanceEnough = (balance: Number, price: Number) => {
  if (balance < price) {
    throw new Error('INSUFFICIENT_BALANCE');
  }
}

export const isBiddingOwnProduct = (bidderId: string = null, sellerId: string) => {
  if (bidderId === sellerId) {
    throw new Error('FORBID_OWN_BID');
  }
};

export const isEligibleToBidNow = (lastBidAt: Date, nowAt: Date) => {
  if (!lastBidAt) {
    return;
  }

  // use 15 seconds bid window, for easier debugging and postman tests
  if (lastBidAt.getTime() + 1000 * 15 > nowAt.getTime()) {
    throw new Error("TIME_LOCKED_TO_BID");
  }
}

export const sortRefundPaymentPerBidder = (bids: any): any => {
  // Sort the array by bidder_id (optional)
  bids.sort((a, b) => a.bidder_id.localeCompare(b.bidder_id));
  
  // Group bids by bidder_id and calculate the total bid_price
  const groupedBids = bids.reduce((acc, bid) => {
    if (!acc[bid.bidder_id]) {
      // If the bidder_id is not in the accumulator yet, initialize it with an empty array
      acc[bid.bidder_id] = {
        bidder_id: bid.bidder_id,
        total_bid_price: 0,
        bids: [],
      };
    }
  
    // Add the bid_price to the total_bid_price for the bidder
    acc[bid.bidder_id].total_bid_price += bid.price;
  
    // Add the bid to the bidder's bids array
    acc[bid.bidder_id].bids.push(bid);
  
    return acc;
  }, {});
  
  // Convert the groupedBids object back to an array
  return Object.values(groupedBids);  
}