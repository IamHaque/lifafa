import axios from 'axios';

import { BASE_URL, API_HEADER } from './utils';

export async function getLifafaById(lifafaId: string) {
  try {
    const response = await axios.get(`${BASE_URL}/${lifafaId}`, API_HEADER);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function claimLifafa(
  upiId: string,
  lifafaId: string | undefined,
  accountName: string | null
) {
  try {
    const response = await axios.post(
      `${BASE_URL}/claim`,
      { upiId, lifafaId, accountName },
      API_HEADER
    );
    return response.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Error claiming lifafa');
  }
}
