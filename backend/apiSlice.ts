import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const blockApi = createApi({
  reducerPath: "blockApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://51.250.109.234:3443/" }),
  endpoints: (builder) => ({
    getLatestBlockNumber: builder.query<
      {
        block_number: number
        tx_hash: string
        from_addr: string
        to_addr: string
        storage_addr: string
        value: string
        action: string
      }[],
      string
    >({
      query: (blockNumber) => `api/trace?block=${blockNumber}`,
    }),
    getTxs: builder.query<
      {
        id: number
        jsonrpc: string
        result: string
      },
      string
    >({
      query: (tx: string) => `api/trace?tx=${tx}`,
    }),
    getAddress: builder.query<
      {
        id: number
        jsonrpc: string
        result: string
      },
      string
    >({
      query: (address: string) => `api/trace?address=${address}`,
    }),
  }),
})
export const { useGetTxsQuery, useGetAddressQuery, useGetLatestBlockNumberQuery } = blockApi
