import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Address } from "viem"

export interface Trace {
  block_number: number
  tx_hash: string
  from_addr: string
  to_addr: string
  storage_addr: string
  value: string
  calldata: ""
  action: string
}

export interface MetadataItem {
  contract_name: string | null
}

export interface AddressData {
  metadata: Record<string, MetadataItem>
  traces: Trace[]
}

export interface SecurityCheckInfo {
  address: string
  score: number
}

export interface AddressInfo {
  address: Address
  compilerVersion: string
  constructorArguments: string
  contractAbi: string
  contractBytecode: string
  contractName: string
  contractSourceCode: any
  isContract: boolean
  isProxy: boolean
  isVerified: boolean
  licenseType: string
}

export const blockApi = createApi({
  reducerPath: "blockApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://45.144.31.133:3443/" }),
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
    getAddress: builder.query<AddressData, string>({
      query: (address: string) => `api/trace?address=${address}`,
    }),
    getSecurityCheck: builder.query<SecurityCheckInfo, string>({
      query: (address: string) => `api/security/check/${address}`,
    }),
    getSnapshot: builder.query<any, string>({
      query: (snapshotName: string) => `api/snapshot/${snapshotName}`,
    }),
    getAddressInfo: builder.query<AddressInfo, string>({
      query: (address: string) => `api/metadata/address/${address}`,
      transformResponse: (response: any): AddressInfo => ({
        address: response.address,
        compilerVersion: response.compiler_version,
        constructorArguments: response.constructor_arguments,
        contractAbi: response.contract_abi,
        contractBytecode: response.contract_bytecode,
        contractName: response.contract_name,
        contractSourceCode: response.contract_source_code,
        isContract: response.is_contract,
        isProxy: response.is_proxy,
        isVerified: response.is_verified,
        licenseType: response.license_type,
      }),
    }),
  }),
})
export const {
  useGetTxsQuery,
  useGetAddressQuery,
  useGetLatestBlockNumberQuery,
  useGetAddressInfoQuery,
  useGetSecurityCheckQuery,
  useGetSnapshotQuery,
} = blockApi
