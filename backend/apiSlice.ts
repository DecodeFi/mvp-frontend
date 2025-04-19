import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blockApi = createApi({
  reducerPath: "blockApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://51.250.109.234:3443/" }),
  endpoints: (builder) => ({
    getLatestBlockNumber: builder.query<
      {
        hash: string;
        from: string;
        to: string;
        storage: string;
        value: string;
        action: string;
      }[],
      string
    >({
      query: (blockNumber) => `/api/lookup?block=22261635`,
    }),
    getTxs: builder.query<
      {
        id: number;
        jsonrpc: string;
        result: string;
      },
      string
    >({
      query: (tx: string) => `/api/lookup?tx=${tx}`,
    }),
    getAddress: builder.query<
      {
        id: number;
        jsonrpc: string;
        result: string;
      },
      string
    >({
      query: (address: string) => `/api/lookup?tx=${address}`,
    }),
  }),
});
export const {
  useGetTxsQuery,
  useGetAddressQuery,
  useGetLatestBlockNumberQuery,
} = blockApi;
