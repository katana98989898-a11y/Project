// src/app/page.tsx
"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";

// Константы
const COIN_RATE = 0.0195;
const MAX_COINS = 999999;

interface Profile {
  username: string;
}

interface CoinPack {
  coins: number;
  price: string;
}

// ----------------------------------------------------------------------
// CustomModal
// ----------------------------------------------------------------------
interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  onRecharge: (coins: number, price: string) => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ isVisible, onClose, onRecharge }) => {
  const [inputValue, setInputValue] = useState("0");
  const inputRef = useRef<HTMLInputElement>(null);

  const keyboardKeys = ["1","2","3","4","5","6","7","8","9","000","0","Del"];

  const coinAmount = useMemo(() => {
    const cleaned = inputValue.replace(/^0+/, "") || "0";
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
  }, [inputValue]);

  const totalPrice = useMemo(() => (coinAmount * COIN_RATE).toFixed(2), [coinAmount]);

  const handleKeyClick = useCallback((key: string) => {
    let newValue = inputValue;
    if (key === "Del") {
      newValue = inputValue.length > 1 ? inputValue.slice(0, -1) : "0";
    } else if (key === "000" && inputValue !== "0") {
      newValue += "000";
    } else if (key === "0" && inputValue !== "0") {
      newValue += "0";
    } else if (key !== "0" && key !== "000" && key !== "Del") {
      newValue = inputValue === "0" ? key : inputValue + key;
    }
    if (newValue.length > 9 || parseInt(newValue) > MAX_COINS) return;
    setInputValue(newValue);
    inputRef.current?.focus();
  }, [inputValue]);

  const handleRecharge = () => {
    if (coinAmount > 0 && coinAmount <= MAX_COINS) {
      onRecharge(coinAmount, `$ ${totalPrice}`);
      setInputValue("0");
    }
  };

  const modalClass = isVisible
    ? "translate-y-0 opacity-100 pointer-events-auto"
    : "translate-y-full opacity-0 pointer-events-none";

  return (
    <>
      {isVisible && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />}
      <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl transform transition-all duration-300 z-50 ${modalClass}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <button onClick={onClose} className="p-2 -ml-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </button>
          <h2 className="text-lg font-bold">Custom</h2>
          <button className="p-2 -mr-2 text-gray-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs text-gray-500 font-medium mb-1">Coin Amount</p>
          <div className="relative border-b-2 border-red-600 mb-2">
            <input
              ref={inputRef}
              type="text"
              inputMode="none"
              autoComplete="off"
              readOnly
              value={inputValue}
              className="w-full text-4xl font-extrabold text-gray-900 pr-10 bg-transparent focus:outline-none [appearance:textfield] cursor-default"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Image src="/coin.png" alt="coin" width={28} height={28} />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium text-right mb-6">$ {totalPrice}</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {keyboardKeys.map(key => (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={`py-3 rounded-xl text-xl font-semibold transition-colors ${key === "Del" ? "bg-red-50 text-red-600 active:bg-red-100" : "bg-gray-100 active:bg-gray-200"}`}
              >
                {key === "Del" ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="M18 9l-6 6"/><path d="M12 9l6 6"/></svg>
                ) : key}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 mb-4 leading-tight">
            By tapping Recharge to make a purchase, you acknowledge that you are purchasing a limited license
          </p>

          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold text-gray-900">$ {totalPrice}</span>
          </div>

          <button
            className={`w-full text-white rounded-lg py-3 flex items-center justify-center gap-2 font-semibold text-sm shadow-sm transition ${coinAmount > 0 ? "bg-red-600 active:scale-95" : "bg-red-400 cursor-not-allowed"}`}
            onClick={handleRecharge}
            disabled={coinAmount === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L3 7v6c0 7 9 10 9 10s9-3 9-10V7l-9-5z"/><path d="M9 12l2 2 4-4"/></svg>
            <span>Recharge</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ----------------------------------------------------------------------
// Card Selection Modal
// ----------------------------------------------------------------------
interface CardSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (card: string) => void;
}

const CardSelectionModal: React.FC<CardSelectionModalProps> = ({ isVisible, onClose, onSelect }) => {
  const modalClass = isVisible
    ? "translate-y-0 opacity-100 pointer-events-auto"
    : "translate-y-full opacity-0 pointer-events-none";

  return (
    <>
      {isVisible && <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />}
      <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl transform transition-all duration-300 z-50 ${modalClass}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <button onClick={onClose} className="p-2 -ml-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </button>
          <h2 className="text-lg font-bold">Select Card</h2>
          <div className="w-8" />
        </div>

        <div className="p-6">
          <button
            onClick={() => {
              onSelect("Card •••• 8744");
              onClose();
            }}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl active:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">•••• •••• •••• 8744</p>
                <p className="text-xs text-gray-500">Visa • Expires 12/27</p>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>

          <button className="w-full mt-4 text-sm text-blue-600 font-medium text-center">
            + Add New Card
          </button>
        </div>
      </div>
    </>
  );
};

// ----------------------------------------------------------------------
// Loading Modal
// ----------------------------------------------------------------------
interface LoadingModalProps {
  isVisible: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isVisible }) => {
  const [seconds, setSeconds] = useState(300); // 5 минут = 300 сек

  useEffect(() => {
    if (isVisible && seconds > 0) {
      const interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible, seconds]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-white">
      <div className="text-center">
        <Image src="/loading.gif" alt="Loading" width={80} height={80} className="mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-900">Processing your payment</p>
        <p className="text-sm text-gray-500 mt-1">This could take a few seconds</p>
        <p className="text-xs text-gray-400 mt-4">{formatTime(seconds)}</p>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Success Modal
// ----------------------------------------------------------------------
interface SuccessModalProps {
  isVisible: boolean;
  coins: number;
  username: string;
  onBack: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isVisible, coins, username, onBack }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-white p-6">
      <div className="text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <p className="text-sm text-gray-500">
          {coins.toLocaleString()} Coins were sent to
        </p>
        <p className="text-lg font-bold text-gray-900 mt-1">@{username}</p>
        <p className="text-xs text-gray-500 mt-4">
          This operation has been completed. It will be processed within 24 hours!
        </p>
        <button
          onClick={onBack}
          className="mt-8 w-full bg-red-600 text-white rounded-lg py-3 font-semibold text-sm active:scale-95 transition"
        >
          Go back
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Order Summary
// ----------------------------------------------------------------------
interface OrderSummaryProps {
  isVisible: boolean;
  onBack: () => void;
  coins: number;
  price: string;
  username: string;
  onPay: (coins: number, username: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ isVisible, onBack, coins, price, username, onPay }) => {
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const displayText = selectedCard || "Add Credit Or Card";

  const modalClass = isVisible
    ? "translate-y-0 opacity-100 pointer-events-auto"
    : "translate-y-full opacity-0 pointer-events-none";

  const handlePay = () => {
    onPay(coins, username);
  };

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300" onClick={onBack} />
      )}

      <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl transform transition-all duration-300 z-50 ${modalClass}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <button onClick={onBack} className="p-2 -ml-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </button>
          <h2 className="text-lg font-bold">Order Summary</h2>
          <button className="p-2 -mr-2 text-gray-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <span className="text-sm font-medium text-green-700">Secure payment</span>
          </div>

          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-500">Account</span>
            <span className="font-medium text-gray-900">@{username}</span>
          </div>

          <div className="flex justify-between text-lg font-bold mb-6">
            <span>{coins.toLocaleString()} Coins</span>
            <span className="text-gray-900">{price}</span>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment method</h3>

            <button
              onClick={() => setIsCardModalVisible(true)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-3 active:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
                </div>
                <span className="text-sm font-medium text-gray-900">{displayText}</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            <button className="w-full flex items-center justify-center gap-2 p-4 bg-black text-white rounded-xl active:scale-95 transition">
              <span className="font-semibold">Apple Pay</span>
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-4 leading-tight">
            By tapping Pay to make a purchase, you acknowledge that you are purchasing a limited license to access this
          </p>

          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold text-gray-900">{price}</span>
          </div>

          <button
            className="w-full bg-red-600 text-white rounded-lg py-3 flex items-center justify-center gap-2 font-semibold text-sm shadow-sm active:scale-95 transition"
            onClick={handlePay}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L3 7v6c0 7 9 10 9 10s9-3 9-10V7l-9-5z"/><path d="M9 12l2 2 4-4"/></svg>
            <span>Pay</span>
          </button>
        </div>
      </div>

      <CardSelectionModal
        isVisible={isCardModalVisible}
        onClose={() => setIsCardModalVisible(false)}
        onSelect={setSelectedCard}
      />
    </>
  );
};

// ----------------------------------------------------------------------
// Home
// ----------------------------------------------------------------------
export default function Home() {
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedPack, setSelectedPack] = useState<CoinPack | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);
  const [isOrderSummaryVisible, setIsOrderSummaryVisible] = useState(false);
  const [orderData, setOrderData] = useState<{ coins: number; price: string; username: string } | null>(null);
  const [isFromCustom, setIsFromCustom] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{ coins: number; username: string } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const coinPacks: CoinPack[] = [
    { coins: 20, price: "0.39 $" },
    { coins: 70, price: "1.29 $" },
    { coins: 350, price: "6.00 $" },
    { coins: 700, price: "12.00 $" },
    { coins: 1400, price: "24.00 $" },
    { coins: 3500, price: "60.00 $" },
    { coins: 7000, price: "120.99 $" },
    { coins: 17500, price: "300.00 $" },
  ];

  const packsWithCustom: (CoinPack | { type: "custom" })[] = [...coinPacks, { type: "custom" }];

  useEffect(() => {
    setSelectedPack(coinPacks[0]);
  }, []);

  const searchProfile = () => {
    const raw = input.trim().replace("@", "");
    if (!raw || raw.length < 2) {
      setProfile(null);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setProfile({ username: raw });
      setLoading(false);
    }, 1000);
  };

  const openOrderSummary = (coins: number, price: string) => {
    if (!profile) return;
    setOrderData({ coins, price, username: profile.username });
    setIsOrderSummaryVisible(true);
  };

  const handleCustomRecharge = (coins: number, price: string) => {
    setIsCustomModalVisible(false);
    setIsFromCustom(true);
    openOrderSummary(coins, price);
  };

  const handlePackClick = (pack: CoinPack | { type: "custom" }) => {
  if ("type" in pack && pack.type === "custom") {
    setIsCustomModalVisible(true);
    setSelectedPack(null);
    setIsOrderSummaryVisible(false);
  } else {
    setSelectedPack(pack as CoinPack);
    setIsCustomModalVisible(false);
    setIsOrderSummaryVisible(false);
    setIsFromCustom(false);
  }
};

  const handleBackFromOrder = () => {
    setIsOrderSummaryVisible(false);
    if (isFromCustom) {
      setIsCustomModalVisible(true);
    }
  };

  const handleBottomBuy = () => {
    if (selectedPack && profile) {
      setIsFromCustom(false);
      openOrderSummary(selectedPack.coins, selectedPack.price);
    }
  };

  const handlePay = (coins: number, username: string) => {
    setIsOrderSummaryVisible(false);
    setIsCustomModalVisible(false);
    setIsLoadingModal(true);

    setTimeout(() => {
      setIsLoadingModal(false);
      setSuccessData({ coins, username });
      setIsSuccessModal(true);
    }, 1500);
  };

  const handleGoBack = () => {
    setIsSuccessModal(false);
    setInput("");
    setProfile(null);
    setSelectedPack(coinPacks[0]);
    setOrderData(null);
  };

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      <div className="h-screen bg-white relative">
        <div className="p-6 max-w-md mx-auto w-full h-full overflow-y-auto pb-24">
          <h1 className="text-left mt-6">
            <span className="text-2xl font-black text-gray-900">Get Coin</span>{" "}
            <span className="text-xl font-bold text-gray-800">Galaxies You send It!</span>
          </h1>

          <div className="mt-6 relative">
            <input
              type="text"
              placeholder="username"
              value={input}
              onChange={(e) => {
                const value = e.target.value;
                setInput(value);
                const cleaned = value.trim().replace("@", "");
                if (cleaned.length >= 2) {
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  timeoutRef.current = setTimeout(searchProfile, 600);
                } else setProfile(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && searchProfile()}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-black pr-20"
              disabled={loading}
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-600 animate-pulse">
                Searching...
              </div>
            )}
          </div>

          {profile && !loading && (
            <div className="mt-5 flex items-center space-x-2">
              <span className="text-base font-medium text-gray-700">@{profile.username}</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Verified</span>
            </div>
          )}

          <div className="mt-8 mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recharge</h2>
            <p className="text-xs text-red-600 mt-1 leading-tight">Save around 25% with a lower third-party service fee.</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {packsWithCustom.map((item) => {
              if ("type" in item && item.type === "custom") {
                return (
                  <button
                    key="custom"
                    onClick={() => handlePackClick(item)}
                    className={`p-3 rounded-xl transition-all flex flex-col items-center justify-center h-20 ${isCustomModalVisible ? "bg-pink-50 border-2 border-red-600" : "bg-gray-100 border-2 border-transparent hover:bg-gray-200"}`}
                  >
                    <p className="text-lg leading-none font-bold text-gray-700">Custom</p>
                  </button>
                );
              }
              const pack = item as CoinPack;
              const isSelected = selectedPack?.coins === pack.coins && !isCustomModalVisible && !isOrderSummaryVisible;
              return (
                <button
                  key={pack.coins}
                  onClick={() => handlePackClick(pack)}
                  className={`p-3 rounded-xl transition-all flex flex-col items-center ${isSelected ? "bg-pink-50 border-2 border-red-600" : "bg-gray-100 border-2 border-transparent hover:bg-gray-200"}`}
                >
                  <div className="flex items-center space-x-1">
                    <Image src="/coin.png" alt="coin" width={22} height={22} />
                    <p className="text-lg leading-none font-bold">{pack.coins.toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-none">{pack.price}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 max-w-md mx-auto w-full z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Special Offer</span>
            <span className="text-xs text-red-600 font-medium">Unlock 5% cash back</span>
          </div>
          <div className="flex justify-center mb-3">
            <Image src="/platnosc1.png" alt="Payment" width={120} height={30} />
          </div>
          <button
            className="w-full bg-red-600 text-white rounded-lg py-3 flex items-center justify-center gap-2 font-semibold text-sm shadow-sm active:scale-95 transition disabled:opacity-50"
            onClick={handleBottomBuy}
            disabled={!selectedPack || !profile}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L3 7v6c0 7 9 10 9 10s9-3 9-10V7l-9-5z"/><path d="M9 12l2 2 4-4"/></svg>
            <span>{selectedPack ? `Buy for ${selectedPack.price}` : "Select pack"}</span>
          </button>
        </div>
      </div>

      <CustomModal
        isVisible={isCustomModalVisible}
        onClose={() => setIsCustomModalVisible(false)}
        onRecharge={handleCustomRecharge}
      />

      {orderData && (
        <OrderSummary
          isVisible={isOrderSummaryVisible}
          onBack={handleBackFromOrder}
          coins={orderData.coins}
          price={orderData.price}
          username={orderData.username}
          onPay={handlePay}
        />
      )}

      <LoadingModal isVisible={isLoadingModal} />

      {successData && (
        <SuccessModal
          isVisible={isSuccessModal}
          coins={successData.coins}
          username={successData.username}
          onBack={handleGoBack}
        />
      )}
    </>
  );
}
