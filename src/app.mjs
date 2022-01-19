import * as service from './service.mjs';
import 'dotenv/config';

const CONFIG = {
  PAGE_LIMIT: Number(process.env.PAGE_LIMIT),
  MIN_PRICE: Number(process.env.MIN_PRICE),
  MAX_PRICE: Number(process.env.MAX_PRICE),
  SE: Number(process.env.SE),
};

const app = {
  filterPlayer: (player) => {
    try {
      const playerAttrs = player.nft.metadata.attributes;
      const playerSE = playerAttrs[1].value.split('/')[0];

      if (playerSE >= CONFIG.SE) {
        return true;
      }
  
      return false;
    } catch (e) {
      return false;
    }
  },
  showPlayers: (players) => {
    players.sort((a,b) => {
      if (a.usdPrice < b.usdPrice) {
        return -1;
      }
      if (a.usdPrice > b.usdPrice) {
        return 1;
      }
      return 0;
    }).forEach(player => {
      console.log({
        SE: player.nft.metadata.attributes[1].value,
        price: player.usdPrice,
        link: `https://marketplace.biswap.org/card/${ player.nft_contract }/${ player.nft_id }`,
      })
    });
  },
  init: async () => {

    let searchedPlayers = [];

    for(let i = 0; i < CONFIG.PAGE_LIMIT; i++) {
      console.clear();
      console.log(`Loading page ${i}...`);

      const players = await service.getPlayers(i, {
        levels: [],
        onlyBoosted: false,
        robiBoost: {
          from: 0,
          to: 0
        },
        currencies: [],
        usdRange: {
          from: CONFIG.MIN_PRICE,
          to: CONFIG.MAX_PRICE
        }
      });

      searchedPlayers = [...searchedPlayers, ...players.filter(player => app.filterPlayer(player))];
    }

    console.clear();
    app.showPlayers(searchedPlayers);
  }
}

export default app;