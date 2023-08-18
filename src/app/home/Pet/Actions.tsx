"use client";

import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network, Provider } from "aptos";

type PetAction = "Feed" | "Play" | "Customize";
export interface ActionsProps {}
export const provider = new Provider(Network.TESTNET);

export function Actions(props: ActionsProps) {
  const [selectedAction, setSelectedAction] = useState<PetAction>("Feed");
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);
  const { account, network, signAndSubmitTransaction } = useWallet();

  const handleStart = () => {
    switch (selectedAction) {
      case "Feed":
        handleFeed();
        break;
      case "Play":
        handlePlay();
        break;
      case "Customize":
        break;
    }
  };

  const handleFeed = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);
    // build a transaction payload to be submitted
    const payload = {
      type: "entry_function_payload",
      function:
        "0x71cc7f10ea20de366f1d512369df023e607fe14261e815c289eec8dc6b3ea7fe::main::change_health_points",
      type_arguments: [],
      arguments: [1],
    };

    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
    } catch (error: any) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const handlePlay = async () => {
    if (!account || !network) return;

    setTransactionInProgress(true);
    // build a transaction payload to be submitted
    const payload = {
      type: "entry_function_payload",
      function:
        "0x71cc7f10ea20de366f1d512369df023e607fe14261e815c289eec8dc6b3ea7fe::main::change_happiness",
      type_arguments: [],
      arguments: [1],
    };

    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
    } catch (error: any) {
      console.error(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  return (
    <div className="nes-container with-title flex-1 bg-white">
      <p className="title">Actions</p>
      <div className="flex gap-12 justify-between h-full">
        <div className="flex flex-col flex-shrink-0 gap-1">
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="action"
              checked={selectedAction === "Feed"}
              onChange={() => setSelectedAction("Feed")}
            />
            <span>Feed</span>
          </label>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="action"
              checked={selectedAction === "Play"}
              onChange={() => setSelectedAction("Play")}
            />
            <span>Play</span>
          </label>
          <label>
            <input
              type="radio"
              className="nes-radio"
              name="action"
              checked={selectedAction === "Customize"}
              onChange={() => setSelectedAction("Customize")}
            />
            <span>Customize</span>
          </label>
        </div>
        <div className="w-1 h-full bg-zinc-300 flex-shrink-0" />
        <div className="flex flex-col gap-1 justify-between">
          {transactionInProgress ? (
            <p>{selectedAction} Transaction Processing...</p>
          ) : (
            <>
              <p>{actionDescriptions[selectedAction]}</p>
              <button
                type="button"
                className="nes-btn is-success"
                onClick={handleStart}
              >
                Start
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const actionDescriptions: Record<PetAction, string> = {
  Feed: "Feeding your pet will boost its HP and Happiness stats...",
  Play: "Playing with your pet will greatly boost its Happiness stat but deplete some of its HP...",
  Customize:
    "Customize your pet to give it a fresh new look and truly make it yours...",
};
