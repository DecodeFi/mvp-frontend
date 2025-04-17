import React, { useEffect, useMemo, useState } from "react";
import css from "./App.module.css";
import { Graph } from "./components/Graph";
import {
  useGetAddressQuery,
  useGetLatestBlockNumberQuery,
  useGetTxsQuery,
} from "../backend/apiSlice";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { skipToken } from "@reduxjs/toolkit/query";

function detectSearchType(value: string) {
  if (!value) return null;
  if (value.startsWith("0x") && value.length === 66) return "tx";
  if (value.startsWith("0x") && value.length === 42) return "address";
  if (/^\d+$/.test(value)) return "block";
  return null;
}

function App() {
  const [highlightNodeId, setHighlightNodeId] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const searchType = detectSearchType(searchValue);
  const { data: blockData, isLoading: isLoadingBLockData } =
    useGetLatestBlockNumberQuery(
      searchType === "block" ? searchValue : skipToken,
    );

  const { data: txDataRaw, isLoading: isLoadingTxDataRaw } = useGetTxsQuery(
    searchType === "tx" ? searchValue : skipToken,
  );

  const { data: addressDataRaw, isLoading: isLoadingAddressDataRaw } =
    useGetAddressQuery(searchType === "address" ? searchValue : skipToken);
  useEffect(() => {
    const hey = async () => {
      const fetchedBlock = await fetch(
        "https://51.250.109.234:3443/api/lookup?block=12423434",
      );
      console.log(fetchedBlock, "fetchedBlock");
    };
    hey();
  }, []);
  const parsedTxData = useMemo(() => {
    try {
      if (txDataRaw?.result) return JSON.parse(txDataRaw.result);
    } catch (e) {
      console.error("Failed to parse txDataRaw", e);
    }
    return [];
  }, [txDataRaw]);

  const parsedAddressData = useMemo(() => {
    try {
      if (addressDataRaw?.result) return JSON.parse(addressDataRaw.result);
    } catch (e) {
      console.error("Failed to parse addressDataRaw", e);
    }
    return [];
  }, [addressDataRaw]);
  const rawData =
    searchType === "block"
      ? blockData
      : searchType === "tx"
        ? parsedTxData
        : searchType === "address"
          ? parsedAddressData
          : [];
  const sampleData = [
    {
      hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
      from: "0x804abde86c3ecc4eb738c452a4cf129e151c3014",
      to: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
      storage: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
      value: "0x3e5500",
      action: "call",
    },
  ];

  const filteredData = rawData?.filter((tx) => {
    return (
      (!fromFilter || tx.from.includes(fromFilter)) &&
      (!toFilter || tx.to.includes(toFilter)) &&
      (!actionFilter || tx.action === actionFilter)
    );
  });

  function buildGraphFromData(data) {
    if (!data) {
      return {
        nodes: [],
        edges: [],
      };
    }
    const nodesMap = new Map();
    const edges = [];

    for (const tx of data) {
      const { from, to, storage, action, hash } = tx;

      [from, to, storage].forEach((addr) => {
        if (!nodesMap.has(addr)) nodesMap.set(addr, { id: addr });
      });

      edges.push({
        source: from,
        target: to,
        label: `${action} (${hash.slice(0, 8)}…)`,
      });

      if (action === "delegate_call") {
        edges.push({
          source: storage,
          target: to,
          label: `delegate_ref (${hash.slice(0, 8)}…)`,
        });
      }
    }

    return {
      nodes: Array.from(nodesMap.values()),
      edges,
    };
  }

  const { nodes, edges } = buildGraphFromData(filteredData);
  return (
    <div className={css.container}>
      <Header />
      <SearchBar
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onSubmit={() => setSearchValue(searchInput)}
      />
      {(isLoadingBLockData ||
        isLoadingAddressDataRaw ||
        isLoadingTxDataRaw) && <div>loading...</div>}
      <div>
        <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
          <input
            placeholder="Search from"
            value={fromFilter}
            onChange={(e) => setFromFilter(e.target.value)}
            className={css.filters}
          />
          <input
            placeholder="Search to"
            value={toFilter}
            onChange={(e) => setToFilter(e.target.value)}
            className={css.filters}
          />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className={css.filters}
          >
            <option value="">All actions</option>
            <option value="call">call</option>
            <option value="delegate_call">delegate_call</option>
          </select>
        </div>
        <div className={css.graphContainer}>
          {rawData && <Graph nodes={nodes} edges={edges} />}
        </div>
      </div>
    </div>
  );
}

export default App;
