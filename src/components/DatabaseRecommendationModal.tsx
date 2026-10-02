import React, { useState } from 'react';
import { 
  Database, Server, Layers, ShieldCheck, Zap, Code, 
  CheckCircle2, Cpu, ArrowRight, Table, Globe, Lock 
} from 'lucide-react';

interface DatabaseRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseRecommendationModal: React.FC<DatabaseRecommendationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'postgres' | 'realtime' | 'architecture'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div 
        className="w-full max-w-4xl bg-[#0d0f14] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Database Architecture Recommendation
              </h2>
              <p className="text-xs text-zinc-400">
                Production-grade persistence & telemetry blueprint for real-time food delivery platforms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 px-6 border-b border-zinc-800 bg-zinc-950/40 text-xs font-medium">
          {[
            { id: 'overview', label: 'Executive Recommendation' },
            { id: 'postgres', label: 'PostgreSQL + PostGIS (Core)' },
            { id: 'realtime', label: 'Firestore / Redis (Real-Time)' },
            { id: 'architecture', label: 'Hybrid Data Flow' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-zinc-300">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>The Short Recommendation: Hybrid Dual-Engine Architecture</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Food delivery apps have two fundamentally different data profiles: 
                  <strong> (1) Strict ACID financial & transactional data</strong> (orders, payments, loyalty points ledgers, restaurant catalogs) which require relational constraints, and 
                  <strong> (2) High-frequency real-time spatial telemetry</strong> (courier GPS coordinates updated every 2 seconds, live order pipeline broadcasts) which require sub-second pub/sub sync without taxing primary relational tables.
                </p>
              </div>

              {/* Comparison Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span>PostgreSQL / Cloud SQL + PostGIS</span>
                  </div>
                  <p className="text-zinc-400 text-xs">
                    Recommended as the <strong>Primary Source of Truth</strong>.
                  </p>
                  <ul className="space-y-2 text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>ACID Transactions:</strong> Guarantees payment idempotency, vouchers, and prevents duplicate loyalty deductions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>PostGIS Spatial Indexing:</strong> Ultra-fast geographic bounding queries (<code className="text-amber-400">ST_DWithin</code>) for finding restaurants within a 5km radius.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Complex Dietary Joins:</strong> Multi-table queries filtering dishes by vegan, halal, allergen free, and cuisine tags.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Firebase Firestore or Redis Streams</span>
                  </div>
                  <p className="text-zinc-400 text-xs">
                    Recommended as the <strong>Live Telemetry & Tracking Layer</strong>.
                  </p>
                  <ul className="space-y-2 text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Document Listeners:</strong> Client mobile/web apps subscribe via <code className="text-amber-400">onSnapshot()</code> for instant push updates without polling.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Sub-Second GPS Ingestion:</strong> Ingests thousands of courier ping updates per second without bogging down the transactional database.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Offline First:</strong> Immediate local cache support for mobile delivery couriers in low-reception zones.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'postgres' && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-white">
                PostgreSQL + PostGIS Production Schema Blueprint
              </h3>
              <p className="text-xs text-zinc-400">
                Optimized for strict payment auditing, relational menus, and spatial restaurant indexing:
              </p>

              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
{`-- 1. Restaurants with PostGIS Spatial Coordinates
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  cuisine VARCHAR(100) NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL, -- Lat/Lng indexed with GIST
  rating NUMERIC(3,2) DEFAULT 5.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_restaurants_spatial ON restaurants USING GIST(location);

-- 2. Menu Items & Dietary Tags
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  dietary_tags TEXT[] NOT NULL, -- e.g. ARRAY['vegan', 'gluten-free', 'halal']
  is_available BOOLEAN DEFAULT true
);
CREATE INDEX idx_menu_dietary ON menu_items USING GIN(dietary_tags);

-- 3. Orders with Strict Foreign Keys & Financial Auditing
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(32) UNIQUE NOT NULL,
  customer_id UUID NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id),
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL,
  tip_amount NUMERIC(10,2) DEFAULT 0.00,
  loyalty_points_discount NUMERIC(10,2) DEFAULT 0.00,
  total_paid NUMERIC(10,2) NOT NULL,
  payment_intent_id VARCHAR(255) NOT NULL, -- Stripe/Square token
  status VARCHAR(50) DEFAULT 'placed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Loyalty Points Ledger (Double-Entry Bookkeeping)
CREATE TABLE loyalty_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  order_id UUID REFERENCES orders(id),
  points_change INT NOT NULL, -- e.g. +380 or -500
  reason VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
              </pre>
            </div>
          )}

          {activeTab === 'realtime' && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-white">
                Real-Time Telemetry: Firestore & Redis Architecture
              </h3>
              <p className="text-xs text-zinc-400">
                Handles high-frequency courier tracking coordinates, active status changes, and instant push event triggers:
              </p>

              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
{`// 1. Firestore Active Order Document (/active_orders/{orderId})
{
  "orderId": "order-174829",
  "status": "on_the_way", // 'placed' | 'in_kitchen' | 'on_the_way' | 'delivered'
  "courier": {
    "courierId": "driver-9402",
    "name": "Alex Rivera",
    "phone": "+1 (555) 234-9821",
    "currentLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "heading": 142.5,
      "speedKmh": 22.4,
      "updatedAt": Timestamp.now()
    }
  },
  "destination": {
    "latitude": 40.7282,
    "longitude": -73.9942,
    "address": "742 Evergreen Terrace, Apt 4B"
  },
  "etaMinutes": 7,
  "lastMilestone": "Courier picked up at kitchen"
}

// 2. Client-Side Real-Time Listener (Zero-Polling)
onSnapshot(doc(db, "active_orders", orderId), (snapshot) => {
  const data = snapshot.data();
  updateLiveCourierPin(data.courier.currentLocation);
  updateEtaCountdown(data.etaMinutes);
  if (data.status === 'delivered') triggerCelebration();
});`}
              </pre>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-white">
                Recommended End-to-End Enterprise Architecture
              </h3>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4 font-mono text-[11px]">
                <div className="flex flex-col gap-3">
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-amber-400 font-bold">1. Client Tier:</span>
                      <span className="text-zinc-300 ml-2">React SPA + Progressive Web App + Service Worker Push</span>
                    </div>
                    <span className="text-zinc-500">Port 3000 / Web Push</span>
                  </div>

                  <div className="text-center text-zinc-600">↓ REST / WebSocket Handshake</div>

                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-amber-400 font-bold">2. Application API:</span>
                      <span className="text-zinc-300 ml-2">Node.js Express / Cloud Run / GraphQL</span>
                    </div>
                    <span className="text-zinc-500">Stateless Containers</span>
                  </div>

                  <div className="text-center text-zinc-600">↓ Fan-out routing</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
                      <span className="text-emerald-400 font-bold block mb-1">Transactional Store</span>
                      <p className="text-zinc-300 text-[10px]">Cloud SQL (PostgreSQL) for Orders, Menus, Invoices, Loyalty Points & Payment Reconciliation</p>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/40">
                      <span className="text-amber-400 font-bold block mb-1">Real-Time State & Cache</span>
                      <p className="text-zinc-300 text-[10px]">Firestore / Redis for Courier GPS Streams, Active Order WebSockets & Push Notifications</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
