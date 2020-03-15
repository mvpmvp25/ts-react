import { request } from 'utils/request';
import { Api } from 'config/api';

// export async function getFoodList(query = {}) {
//   return request(query, Api.adminFoodList);
// }

export const cardOrderList = (query = {}) => {
  return request(query, Api.orderList);
};
