import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Users, Mail, Phone, ShoppingBag, Ban, CheckCircle } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { customers, formatPrice, orders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter((c) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <h1 className="font-serif-display text-2xl font-bold text-neutral-900">
          Client Relationship Directory (CRM)
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Review VIP clients, lifetime order expenditure, delivery destinations, and account credentials.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search clients by name, email, or telephone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[11px] border-b border-neutral-200">
              <tr>
                <th className="py-3 px-6">Client Name</th>
                <th className="py-3 px-6">Contact Channels</th>
                <th className="py-3 px-6 text-center">Orders Placed</th>
                <th className="py-3 px-6 font-mono text-right">Lifetime Spend</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-semibold text-neutral-900">{cust.name}</p>
                    <p className="text-[11px] font-mono text-neutral-400">{cust.id}</p>
                  </td>
                  <td className="py-4 px-6 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-neutral-700">
                      <Mail className="w-3 h-3 text-neutral-400" />
                      <span>{cust.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
                      <Phone className="w-3 h-3 text-neutral-400" />
                      <span>{cust.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-mono font-bold text-neutral-800">
                    {cust.ordersCount}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-neutral-900 tabular-nums">
                    {formatPrice(cust.totalSpent)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {cust.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-neutral-500">
                    {cust.joinedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
