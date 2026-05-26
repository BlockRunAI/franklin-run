"use client";

import { useCallback, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useX402Payment, parseX402FromResponse } from "./use-x402-payment";

// Phone number management (dashboard-style) + AI voice calls, all via BlockRun's
// x402 phone API. Numbers: list ($0.001) / buy ($5, 30d) / renew ($5) / release.
// Calls: /v1/voice/call (~$0.54) then poll for transcript.

const PHONE_BASE = "/api/blockrun/v1/phone";
const CALL_ENDPOINT = "/api/blockrun/v1/voice/call";

export type PhoneStatus = "idle" | "signing" | "calling" | "polling" | "done" | "error";

export interface PhoneNumber {
  phone_number: string;
  expires_at?: string | number;
  country?: string;
}
export interface PhoneCall {
  id?: string;
  to: string;
  task: string;
  status: PhoneStatus;
  transcript?: string;
  summary?: string;
  error?: string;
}

export function usePhoneCall() {
  const { isConnected } = useAccount();
  const { makePayment } = useX402Payment();
  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);
  const [numbersError, setNumbersError] = useState<string | null>(null);
  const [loadingNumbers, setLoadingNumbers] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [call, setCall] = useState<PhoneCall | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // POST a paid request → parsed JSON (handles 402→sign→retry).
  const paidPost = useCallback(
    async (url: string, payload: Record<string, unknown>, signal?: AbortSignal) => {
      const body = JSON.stringify(payload);
      let res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, signal });
      if (res.status === 402) {
        const reqs = parseX402FromResponse(res);
        if (!reqs) throw new Error("Could not read payment requirements.");
        const { payload: pay, error } = await makePayment(reqs);
        if (!pay) throw new Error(error || "Wallet signature failed.");
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Payment": pay },
          body,
          signal,
        });
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || j.message || `Request failed (HTTP ${res.status})`);
      }
      return res.json();
    },
    [makePayment],
  );

  const parseNumbers = (j: Record<string, unknown>): PhoneNumber[] => {
    const arr = (j.numbers || j.data || (Array.isArray(j) ? j : [])) as PhoneNumber[];
    return Array.isArray(arr) ? arr : [];
  };

  const loadNumbers = useCallback(async () => {
    setLoadingNumbers(true);
    setNumbersError(null);
    try {
      setNumbers(parseNumbers(await paidPost(`${PHONE_BASE}/numbers/list`, {})));
    } catch (e) {
      setNumbersError(e instanceof Error ? e.message : "Could not load numbers");
    } finally {
      setLoadingNumbers(false);
    }
  }, [paidPost]);

  const buyNumber = useCallback(
    async (country: string, areaCode?: string) => {
      setActionBusy(true);
      setNumbersError(null);
      try {
        await paidPost(`${PHONE_BASE}/numbers/buy`, { country, ...(areaCode ? { areaCode } : {}) });
        await loadNumbers();
      } catch (e) {
        setNumbersError(e instanceof Error ? e.message : "Could not provision a number");
      } finally {
        setActionBusy(false);
      }
    },
    [paidPost, loadNumbers],
  );

  const releaseNumber = useCallback(
    async (phone_number: string) => {
      setActionBusy(true);
      try {
        await paidPost(`${PHONE_BASE}/numbers/release`, { phone_number });
        await loadNumbers();
      } catch (e) {
        setNumbersError(e instanceof Error ? e.message : "Could not release number");
      } finally {
        setActionBusy(false);
      }
    },
    [paidPost, loadNumbers],
  );

  const renewNumber = useCallback(
    async (phone_number: string) => {
      setActionBusy(true);
      try {
        await paidPost(`${PHONE_BASE}/numbers/renew`, { phone_number });
        await loadNumbers();
      } catch (e) {
        setNumbersError(e instanceof Error ? e.message : "Could not renew number");
      } finally {
        setActionBusy(false);
      }
    },
    [paidPost, loadNumbers],
  );

  const placeCall = useCallback(
    async (to: string, task: string, from?: string) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;
      setCall({ to, task, status: "calling" });
      try {
        const submit = await paidPost(CALL_ENDPOINT, { to, task, max_duration: 5, ...(from ? { from } : {}) }, signal);
        const id = submit.call_id || submit.callId || submit.id;
        setCall((c) => (c ? { ...c, id, status: "polling" } : c));
        if (!id) {
          setCall((c) => (c ? { ...c, status: "done" } : c));
          return;
        }
        const start = Date.now();
        while (Date.now() - start < 300_000) {
          if (signal.aborted) return;
          await new Promise((r) => setTimeout(r, 6000));
          const s = await fetch(`${CALL_ENDPOINT}/${id}`, { signal });
          if (!s.ok) continue;
          const sj = await s.json();
          if (sj.status === "completed" || sj.completed || sj.transcript) {
            setCall((c) => (c ? { ...c, status: "done", transcript: sj.transcript, summary: sj.summary } : c));
            return;
          }
        }
        setCall((c) => (c ? { ...c, status: "done", summary: "Call still in progress — check back later." } : c));
      } catch (e) {
        const aborted = signal.aborted || (e instanceof Error && e.name === "AbortError");
        if (!aborted) setCall({ to, task, status: "error", error: e instanceof Error ? e.message : "Error" });
      }
    },
    [paidPost],
  );

  const resetCall = useCallback(() => {
    abortRef.current?.abort();
    setCall(null);
  }, []);

  const callBusy = call?.status === "signing" || call?.status === "calling" || call?.status === "polling";

  return {
    isConnected,
    numbers,
    numbersError,
    loadingNumbers,
    actionBusy,
    loadNumbers,
    buyNumber,
    releaseNumber,
    renewNumber,
    call,
    placeCall,
    resetCall,
    callBusy,
  };
}
