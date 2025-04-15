import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const blockApi = createApi({
    reducerPath: 'blockApi',
    baseQuery: fetchBaseQuery({baseUrl: 'https://51.250.109.234:3443/'}),
    endpoints: (builder) => ({
        getLatestBlockNumber: builder.query<{
            id: number,
            jsonrpc: string,
            result: string
        }, void>({
            query: () => `/api/lookup?block=22261635`,
        }),
        getLatestBlockHashes: builder.query<{
            id: number,
            jsonrpc: string,
            result: string
        }, string>({
            query: (data: string) => `api/block/${data}`,
        }),
    }),
})
export const {useGetLatestBlockHashesQuery, useGetLatestBlockNumberQuery} = blockApi