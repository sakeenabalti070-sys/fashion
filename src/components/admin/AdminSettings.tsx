import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings, CurrencyCode } from '../../types/ecommerce';
import {
  Save,
  RotateCcw,
  CheckCircle,
  CreditCard,
  Building2,
  Smartphone,
  Banknote,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetAllData, showToast } = useStore();

  const [formData, setFormData] = useState<StoreSettings>(settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all products, orders, and settings to the initial demo catalogue?')) {
      resetAllData();
      setFormData(settings);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-neutral-900">
            Store & Commerce Configuration
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure boutique identity, base operational currency, courier shipping fees, and payment gateways.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Store Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
          <h2 className="font-serif-display text-lg font-bold text-neutral-900">
            1. Boutique Identity & Concierge
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Concierge Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Concierge Phone / WhatsApp</label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded-lg bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-700 font-semibold mb-1">Atelier Physical Address</label>
              <input
                type="text"
                value={formData.storeAddress}
                onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                className="w-full p-2.5 border border-neutral-300 rounded-lg bg-white"
              />
            </div>
          </div>
        </div>

        {/* Currency & Courier Charges */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
          <h2 className="font-serif-display text-lg font-bold text-neutral-900">
            2. Currency & Shipping Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Base Currency</label>
              <select
                value={formData.baseCurrency}
                onChange={(e) => setFormData({ ...formData, baseCurrency: e.target.value as CurrencyCode })}
                className="w-full p-2.5 border border-neutral-300 rounded-lg bg-white font-semibold"
              >
                <option value="PKR">Pakistani Rupee (PKR - Rs.)</option>
                <option value="USD">US Dollar (USD - $)</option>
                <option value="AED">UAE Dirham (AED)</option>
                <option value="GBP">British Pound (GBP - £)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Standard Courier Delivery Fee (Rs.)</label>
              <input
                type="number"
                value={formData.standardShippingFee}
                onChange={(e) => setFormData({ ...formData, standardShippingFee: Number(e.target.value) })}
                className="w-full p-2.5 font-mono border border-neutral-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Free Shipping Threshold (Rs.)</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full p-2.5 font-mono border border-neutral-300 rounded-lg bg-white"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways Config */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
          <h2 className="font-serif-display text-lg font-bold text-neutral-900">
            3. Payment Methods & Gateway Channels
          </h2>

          <div className="space-y-4">
            {/* COD Toggle */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Banknote className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="font-semibold text-neutral-900 block">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-neutral-500">Enable doorstep cash collection across Pakistan</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.enabledPaymentMethods.cod}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    enabledPaymentMethods: { ...formData.enabledPaymentMethods, cod: e.target.checked },
                  })
                }
                className="w-4 h-4 text-neutral-900 rounded"
              />
            </div>

            {/* Bank Transfer Details */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-sky-600" />
                  <div>
                    <span className="font-semibold text-neutral-900 block">Direct Bank Transfer</span>
                    <span className="text-[11px] text-neutral-500">Wire transfer to official business bank account</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enabledPaymentMethods.bankTransfer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      enabledPaymentMethods: { ...formData.enabledPaymentMethods, bankTransfer: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-neutral-900 rounded"
                />
              </div>

              {formData.enabledPaymentMethods.bankTransfer && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={formData.bankDetails.bankName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, bankName: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-neutral-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1">Account Title</label>
                    <input
                      type="text"
                      value={formData.bankDetails.accountTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, accountTitle: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-neutral-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={formData.bankDetails.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-neutral-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1">IBAN</label>
                    <input
                      type="text"
                      value={formData.bankDetails.iban}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, iban: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-neutral-300 rounded bg-white font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Wallets (JazzCash & EasyPaisa) */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-amber-600" />
                  <div>
                    <span className="font-semibold text-neutral-900 block">Mobile Wallets (JazzCash & EasyPaisa)</span>
                    <span className="text-[11px] text-neutral-500">Receive payments via Pakistan mobile wallets</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enabledPaymentMethods.mobileWallet}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      enabledPaymentMethods: { ...formData.enabledPaymentMethods, mobileWallet: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-neutral-900 rounded"
                />
              </div>

              {formData.enabledPaymentMethods.mobileWallet && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1">JazzCash Account No</label>
                    <input
                      type="text"
                      value={formData.mobileWalletDetails.jazzcashNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobileWalletDetails: {
                            ...formData.mobileWalletDetails,
                            jazzcashNumber: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-neutral-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1">JazzCash Account Title</label>
                    <input
                      type="text"
                      value={formData.mobileWalletDetails.jazzcashTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobileWalletDetails: {
                            ...formData.mobileWalletDetails,
                            jazzcashTitle: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-neutral-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1">EasyPaisa Account No</label>
                    <input
                      type="text"
                      value={formData.mobileWalletDetails.easypaisaNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobileWalletDetails: {
                            ...formData.mobileWalletDetails,
                            easypaisaNumber: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-neutral-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-1">EasyPaisa Account Title</label>
                    <input
                      type="text"
                      value={formData.mobileWalletDetails.easypaisaTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobileWalletDetails: {
                            ...formData.mobileWalletDetails,
                            easypaisaTitle: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-neutral-300 rounded bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Credit Card */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <div>
                  <span className="font-semibold text-neutral-900 block">Credit / Debit Card Online Gateway</span>
                  <span className="text-[11px] text-neutral-500">Visa, Mastercard, American Express encrypted processor</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.enabledPaymentMethods.card}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    enabledPaymentMethods: { ...formData.enabledPaymentMethods, card: e.target.checked },
                  })
                }
                className="w-4 h-4 text-neutral-900 rounded"
              />
            </div>
          </div>
        </div>

        {/* Submit Save */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
