import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Zap,
  Activity,
  ArrowRight,
  Clock3,
} from "lucide-react";

import AppShell from "../components/AppShell";
import StationCard from "../components/StationCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import { getDashboardData } from "../services/stationService";

export default function Dashboard({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <AppShell title="Dashboard" user={user} onLogout={onLogout}>
      {!data && !error ? <Loader label="Loading..." /> : null}

      {error ? (
        <Card className="rounded-3xl border border-rose-100 text-rose-500">
          {error}
        </Card>
      ) : null}

      {data ? (
        <div className="space-y-8">
          {/* HERO */}
          <section className="overflow-hidden rounded-[36px] bg-white border border-slate-200 p-8 text-white">
            <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="flex flex-wrap gap-2">
                  {data.cityBands.slice(0, 4).map((city) => (
                    <span
                      key={city}
                      className="rounded-full bg-white/10 px-4 py-1 text-xs text-white/70"
                    >
                      {city}
                    </span>
                  ))}
                </div>

                <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight text-slate-900">
                  Find smarter EV charging stops.
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                  Discover nearby stations, compare speed & pricing, and book instantly.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    as={Link}
                    to="/booking"
                    className="rounded-full px-6"
                  >
                    Start Booking
                  </Button>

                  <Button
                    as={Link}
                    to="/stations"
                    variant="secondary"
                    className="rounded-full border-white/20 bg-white/10 px-6 text-white hover:bg-white/20"
                  >
                    Explore Stations
                  </Button>
                </div>
              </div>


              {/* QUICK STATS */}
<div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
  {data.stats.slice(0, 3).map((stat, index) => {
    const icons = [
      <Zap size={18} className="text-[#467ee5]" />,
      <MapPin size={18} className="text-[#467ee5]" />,
      <Activity size={18} className="text-[#467ee5]" />,
    ];

    return (
      <div
        key={stat.label}
        className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-slate-50 p-2.5">
            {icons[index]}
          </div>

          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-500">
            {stat.change}
          </span>
        </div>

        <h3 className="mt-6 text-3xl font-semibold tracking-tight text-slate-800">
          {stat.value}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {stat.label}
        </p>
      </div>
    );
  })}
</div>
            </div>
          </section>

          {/* RECOMMENDED */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Recommended Stations
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Best picks based on availability & route.
                </p>
              </div>

              <Link
                to="/recommendations"
                className="flex items-center gap-2 text-sm font-medium text-[#467ee5]"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              {data.recommendations.map((station) => (
                <StationCard key={station.id} station={station} />
              ))}
            </div>
          </section>

          {/* ACTIVITY */}
          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            {/* LEFT CARD */}
            <div className="rounded-[32px] bg-[#edf4ff] p-7">
              <p className="text-sm font-medium text-[#467ee5]">
                Charging Insights
              </p>

              <h3 className="mt-3 text-2xl font-semibold leading-snug text-slate-900">
                Faster charging decisions with live availability.
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Smart recommendations now balance charging speed,
                wait time, and estimated cost.
              </p>
            </div>

            {/* ACTIVITY CARD */}
            <Card className="rounded-[32px] border border-slate-100 shadow-none">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">
                  Recent Activity
                </h3>

                <Clock3 size={18} className="text-slate-400" />
              </div>

              <div className="mt-6 space-y-5">
                {data.recentActivity.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4"
                  >
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#467ee5]" />

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-medium text-slate-800">
                          {item.title}
                        </h4>

                        <span className="text-xs text-slate-400">
                          {item.time}
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>
      ) : null}
    </AppShell>
  );
}