import axios from 'axios';

axios.defaults.baseURL = 'https://marketplace.biswap.org/back';

export const getPlayers = async (page = 0, filter = null) => {
  const response = await axios({
    url: '/offers/sellings',
    method: 'post',
    params: {
      partner: '61be229e6b84d59feeb0366c',
      sortBy: 'acs',
      userAddress: '0xfa1ca08E9A822566e8891E53353b1821EC57Ebff',
      page,
    },
    data: {
      filter,
    },
  });

  const players = response.data.data;

  return players;
};