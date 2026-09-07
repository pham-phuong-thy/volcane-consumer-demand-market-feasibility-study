import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LabelList,
} from "recharts";

// ---------------------------------------------------------------------------
// Design tokens
// bg:      #F6EFDD  (raw cane-sugar cream)
// ink:     #1B3A2B  (deep botanical green — headings / primary text)
// cane:    #C99A3B  (mustard gold — sugarcane)
// coral:   #E85D3F  (fruit coral)
// probio:  #4C7A5E  (probiotic teal-green)
// plum:    #8B4A6B  (passionfruit plum — third accent for variety)
// paper:   #FFFCF4  (card surface, slightly lighter than bg)
// ---------------------------------------------------------------------------

const COLORS = {
  bg: "#F6EFDD",
  ink: "#1B3A2B",
  inkSoft: "#3E5A49",
  cane: "#C99A3B",
  coral: "#E85D3F",
  probio: "#4C7A5E",
  plum: "#8B4A6B",
  paper: "#FFFCF4",
  line: "#DED0AC",
};

const PALETTE = [COLORS.coral, COLORS.cane, COLORS.probio, COLORS.plum, COLORS.ink, "#B8860B"];

function SectionHeading({ eyebrow, title, note }) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <span className="text-sm" style={{ color: COLORS.coral, fontWeight: 600 }}>
        {eyebrow}
      </span>
      <h2
        className="text-2xl md:text-3xl"
        style={{
          color: COLORS.ink,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {note && (
        <p className="text-sm max-w-xl" style={{ color: COLORS.inkSoft }}>
          {note}
        </p>
      )}
    </div>
  );
}

function Card({ children, className = "", accent }) {
  return (
    <div
      className={`p-5 ${className}`}
      style={{
        background: COLORS.paper,
        border: `1px solid ${COLORS.line}`,
        borderLeft: accent ? `4px solid ${accent}` : `1px solid ${COLORS.line}`,
      }}
    >
      {children}
    </div>
  );
}

function KpiCard({ value, label, accent, sub }) {
  return (
    <Card accent={accent} className="flex flex-col gap-1">
      <span
        style={{
          color: COLORS.ink,
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          fontSize: "2.25rem",
          lineHeight: 1.05,
        }}
      >
        {value}
      </span>
      <span className="text-sm" style={{ color: COLORS.inkSoft, fontWeight: 600 }}>
        {label}
      </span>
      {sub && (
        <span className="text-xs mt-1" style={{ color: COLORS.inkSoft, opacity: 0.8 }}>
          {sub}
        </span>
      )}
    </Card>
  );
}

function HBar({ data, color = COLORS.coral, height, unit = "%", domainMax = 100 }) {
  return (
    <ResponsiveContainer width="100%" height={height || data.length * 42 + 20}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, left: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={COLORS.line} />
        <XAxis type="number" domain={[0, domainMax]} hide />
        <YAxis
          type="category"
          dataKey="name"
          width={230}
          tick={{ fill: COLORS.ink, fontSize: 12.5 }}
          axisLine={{ stroke: COLORS.line }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          contentStyle={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, fontSize: 12 }}
          formatter={(v) => [`${v}${unit}`, ""]}
        />
        <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={18}>
          {data.map((_, i) => (
            <Cell key={i} fill={color} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v) => `${v}${unit}`}
            style={{ fill: COLORS.ink, fontSize: 12, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function Donut({ data, size = 220 }) {
  return (
    <ResponsiveContainer width="100%" height={size}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={size / 4}
          outerRadius={size / 2.15}
          paddingAngle={2}
          stroke={COLORS.paper}
          strokeWidth={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: COLORS.paper, border: `1px solid ${COLORS.line}`, fontSize: 12 }}
          formatter={(v, n) => [`${v}%`, n]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function Legend({ data }) {
  return (
    <div className="flex flex-col gap-2 justify-center">
      {data.map((d, i) => (
        <div key={d.name} className="flex items-center gap-2 text-sm">
          <span
            className="inline-block rounded-full"
            style={{ width: 10, height: 10, background: PALETTE[i % PALETTE.length] }}
          />
          <span style={{ color: COLORS.ink }}>{d.name}</span>
          <span style={{ color: COLORS.inkSoft, marginLeft: "auto", fontWeight: 600 }}>{d.value}%</span>
        </div>
      ))}
    </div>
  );
}

// Bubble divider — a recurring fermentation motif instead of a generic hairline
function BubbleDivider() {
  const sizes = [6, 10, 4, 14, 7, 5, 11, 4, 8];
  return (
    <div className="flex items-end gap-2 my-14 opacity-70" aria-hidden="true">
      {sizes.map((s, i) => (
        <span
          key={i}
          className="rounded-full"
          style={{
            width: s,
            height: s,
            background: i % 3 === 0 ? COLORS.coral : i % 3 === 1 ? COLORS.cane : COLORS.probio,
          }}
        />
      ))}
      <div className="flex-1 h-px" style={{ background: COLORS.line }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data (transcribed from the VOLCANE demand survey, n = 127)
// ---------------------------------------------------------------------------

const demographicsArea = [
  { name: "Other (study/work in the area)", value: 36.2 },
  { name: "Off-campus student", value: 30.7 },
  { name: "On-campus dorm student", value: 33.1 },
];

const income = [
  { name: "Under 3M VND", value: 12.6 },
  { name: "3M – under 5M VND", value: 11.0 },
  { name: "5M – 7M VND", value: 47.2 },
  { name: "Over 7M VND", value: 29.1 },
];

const gender = [
  { name: "Male", value: 55.9 },
  { name: "Female", value: 40.9 },
  { name: "Prefer not to say", value: 3.2 },
];

const frequency = [
  { name: "< 4×/month", value: 17.3 },
  { name: "4–8×/month", value: 34.6 },
  { name: "9–15×/month", value: 25.2 },
  { name: "> 15×/month", value: 22.8 },
];

const painPoints = [
  { name: "Hygiene / food safety concerns", value: 83.5 },
  { name: "Unclear ingredient origin", value: 71.7 },
  { name: "Too much sugar", value: 72.4 },
  { name: "Artificial flavoring / preservatives", value: 61.4 },
  { name: "Price too high for students", value: 39.4 },
  { name: "Generic, uninnovative flavor", value: 34.6 },
];

const weeklySpend = [
  { name: "Under 50k VND", value: 14.2 },
  { name: "50k – under 100k VND", value: 8.7 },
  { name: "100k – under 200k VND", value: 33.9 },
  { name: "200k – under 300k VND", value: 33.1 },
];

const premiumBarriers = [
  { name: "Too expensive for student budget", value: 63.8 },
  { name: "Brand unknown, unclear benefit", value: 52.8 },
  { name: "Hard to find nearby", value: 50.4 },
  { name: "Sour / carbonated, unfamiliar taste", value: 44.9 },
];

const conceptReaction = [
  { name: "Novel & intriguing", value: 78.0 },
  { name: "Doesn't quite make sense", value: 12.6 },
  { name: "Ordinary, nothing special", value: 9.4 },
];

const readiness = [
  { name: "Neutral — depends on reviews/promo", value: 51.2 },
  { name: "Ready to try", value: 29.9 },
  { name: "Not ready to try", value: 16.5 },
];

const impressReasons = [
  { name: "Novelty of the fermentation concept", value: 38.6 },
  { name: "Clear hygiene / clean production", value: 33.9 },
  { name: "Rich in enzymes & probiotics", value: 15.7 },
  { name: "No industrial sugar or fat", value: 11.8 },
];

const hesitations = [
  { name: "No hesitation — fully excited", value: 35.4 },
  { name: "Worried price will be higher", value: 33.1 },
  { name: "Worried process isn't sanitary", value: 17.3 },
  { name: "Worried taste is too sour", value: 14.2 },
];

const flavors = [
  { name: "Original Sugarcane", value: 72.4 },
  { name: "Passion Fruit", value: 50.4 },
  { name: "Pineapple", value: 47.2 },
  { name: "Green Apple", value: 47.2 },
  { name: "Natural Orange", value: 46.5 },
];

const packaging = [
  { name: "Glass bottle (reusable)", value: 63.8 },
  { name: "PET plastic bottle 350–500ml", value: 28.3 },
  { name: "Sealed paper cup 500ml", value: 7.9 },
];

const price = [
  { name: "25,000 – 30,000 VND", value: 55.9 },
  { name: "31,000 – 35,000 VND", value: 27.6 },
  { name: "20,000 – under 25,000 VND", value: 14.2 },
];

const channels = [
  { name: "Kiosk — Dorm B center", value: 65.4 },
  { name: "Mobile cart near student housing", value: 64.6 },
  { name: "Online storefront (Fanpage/Zalo/app)", value: 56.7 },
  { name: "Free in-campus delivery", value: 54.3 },
  { name: "Kiosk — Dorm A center", value: 37.0 },
];

const promos = [
  { name: "Flat 19,000 VND trial price", value: 66.9 },
  { name: "Buy 1 Get 1 opening week", value: 63.8 },
  { name: "Loyalty card (10 cups = 1 free)", value: 52.0 },
  { name: "Free eco gift (straw / cup sleeve)", value: 38.6 },
];

const socialValue = [
  { name: "Meaningful", value: 47.2 },
  { name: "Extremely meaningful — deserves support", value: 41.7 },
  { name: "Neutral / other", value: 11.1 },
];

const referral = [
  { name: "Nguyễn Thiên Quốc", value: 22.0 },
  { name: "Dương Thị Diễm Hằng", value: 22.8 },
  { name: "Phạm Phương Thy", value: 19.7 },
  { name: "Vương Nguyễn Hồng Ngọc", value: 16.5 },
  { name: "Huỳnh Thị Phương Dung", value: 9.4 },
  { name: "Trần Thị Kim Chi", value: 9.4 },
];

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "audience", label: "Audience" },
  { id: "market", label: "Current Market" },
  { id: "reception", label: "Product Reception" },
  { id: "pricing", label: "Pricing & Channels" },
];

export default function VolcaneDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ background: COLORS.bg, minHeight: "100%" }} className="w-full">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
        {/* Hero */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            {[COLORS.cane, COLORS.coral, COLORS.probio].map((c, i) => (
              <span key={i} className="rounded-full" style={{ width: 9, height: 9, background: c }} />
            ))}
            <span className="text-sm tracking-wide" style={{ color: COLORS.inkSoft }}>
              Demand survey · University Village, VNU-HCM · n = 127
            </span>
          </div>
          <h1
            style={{
              color: COLORS.ink,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
            className="text-4xl md:text-6xl mb-4"
          >
            Do students want a fermented sugarcane drink?
          </h1>
          <p className="max-w-2xl text-base md:text-lg" style={{ color: COLORS.inkSoft }}>
            VOLCANE pairs fresh sugarcane juice with tropical fruit and natural enzyme
            fermentation. This dashboard summarizes what 127 students at the University
            Village told us about their habits, frustrations, and appetite for the idea.
          </p>
        </header>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <KpiCard value="78%" label="Find the concept novel & intriguing" accent={COLORS.coral} />
          <KpiCard value="81%" label="Ready or open to trying it" sub="Ready to try + neutral/considering" accent={COLORS.cane} />
          <KpiCard value="84%" label="Worry about hygiene at street stalls" accent={COLORS.probio} />
          <KpiCard value="89%" label="Find the social-impact angle meaningful" sub="pulp → compost, part-time jobs" accent={COLORS.plum} />
        </div>

        {/* Tabs */}
        <nav className="flex flex-wrap gap-1 mt-10 mb-8" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-2 text-sm"
              style={{
                color: tab === t.id ? COLORS.ink : COLORS.inkSoft,
                fontWeight: tab === t.id ? 700 : 500,
                borderBottom: tab === t.id ? `2px solid ${COLORS.coral}` : "2px solid transparent",
                marginBottom: -1,
                background: "transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <SectionHeading
              eyebrow="The big picture"
              title="A familiar drink, reframed as something new"
              note="Most students were skeptical of premium bottled healthy drinks already on the market — but reacted very differently to a concept rooted in something they already trust: sugarcane juice."
            />
            <div className="grid md:grid-cols-2 gap-5">
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                  Reaction to the fermentation concept
                </h3>
                <HBar data={conceptReaction} color={COLORS.coral} height={140} />
              </Card>
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                  Readiness to try VOLCANE if launched
                </h3>
                <HBar data={readiness} color={COLORS.cane} height={140} />
              </Card>
            </div>

            <BubbleDivider />

            <SectionHeading
              eyebrow="Why it's premium products, not just habit"
              title="The barrier isn't demand — it's trust in what's already out there"
            />
            <div className="grid md:grid-cols-2 gap-5">
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                  What students dislike about current street drinks
                </h3>
                <HBar data={painPoints} color={COLORS.probio} />
              </Card>
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                  Why they skip existing premium healthy drinks
                </h3>
                <HBar data={premiumBarriers} color={COLORS.plum} />
              </Card>
            </div>
          </div>
        )}

        {/* AUDIENCE */}
        {tab === "audience" && (
          <div>
            <SectionHeading eyebrow="Part I" title="Who answered this survey" />
            <div className="grid md:grid-cols-3 gap-5 mb-5">
              <Card>
                <h3 className="text-sm font-semibold mb-2" style={{ color: COLORS.ink }}>
                  Where they study
                </h3>
                <Donut data={demographicsArea} size={180} />
                <Legend data={demographicsArea} />
              </Card>
              <Card>
                <h3 className="text-sm font-semibold mb-2" style={{ color: COLORS.ink }}>
                  Monthly income / spending
                </h3>
                <Donut data={income} size={180} />
                <Legend data={income} />
              </Card>
              <Card>
                <h3 className="text-sm font-semibold mb-2" style={{ color: COLORS.ink }}>
                  Gender
                </h3>
                <Donut data={gender} size={180} />
                <Legend data={gender} />
              </Card>
            </div>
            <Card>
              <h3 className="text-sm font-semibold mb-2" style={{ color: COLORS.ink }}>
                Who referred students to this survey
              </h3>
              <HBar data={referral} color={COLORS.ink} />
            </Card>
          </div>
        )}

        {/* CURRENT MARKET */}
        {tab === "market" && (
          <div>
            <SectionHeading
              eyebrow="Part II"
              title="Today's drinking habits"
              note="Students buy beverages often and spend meaningfully on them — but the experience leaves a lot to be desired."
            />
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                  How often they buy drinks outside
                </h3>
                <HBar data={frequency} color={COLORS.cane} height={170} />
              </Card>
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                  Weekly spend on beverages
                </h3>
                <HBar data={weeklySpend} color={COLORS.coral} height={170} />
              </Card>
            </div>
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                Biggest frustrations with current options
              </h3>
              <HBar data={painPoints} color={COLORS.probio} />
            </Card>
          </div>
        )}

        {/* PRODUCT RECEPTION */}
        {tab === "reception" && (
          <div>
            <SectionHeading eyebrow="Part IV" title="Reaction to the VOLCANE concept" />
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                  What impresses them most
                </h3>
                <HBar data={impressReasons} color={COLORS.coral} height={170} />
              </Card>
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                  What makes them hesitate
                </h3>
                <HBar data={hesitations} color={COLORS.plum} height={170} />
              </Card>
            </div>
            <Card className="mb-5">
              <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                Most-wanted flavors (choose up to 3)
              </h3>
              <HBar data={flavors} color={COLORS.cane} />
            </Card>
            <div className="grid md:grid-cols-2 gap-5">
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                  Preferred packaging
                </h3>
                <HBar data={packaging} color={COLORS.probio} height={140} />
              </Card>
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                  Reaction to the social-impact angle
                </h3>
                <p className="text-xs mb-2" style={{ color: COLORS.inkSoft }}>
                  Composting pulp waste + part-time student jobs
                </p>
                <HBar data={socialValue} color={COLORS.plum} height={140} />
              </Card>
            </div>
          </div>
        )}

        {/* PRICING */}
        {tab === "pricing" && (
          <div>
            <SectionHeading eyebrow="Part V & VI" title="What it takes to convert interest into sales" />
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                  Preferred price for a 500ml bottle
                </h3>
                <HBar data={price} color={COLORS.cane} height={140} />
                <p className="text-xs mt-2" style={{ color: COLORS.inkSoft }}>
                  Willingness to buy drops noticeably once price moves from 30,000 to
                  35,000 VND per cup.
                </p>
              </Card>
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                  Most-wanted promotions to try VOLCANE
                </h3>
                <HBar data={promos} color={COLORS.coral} height={170} />
              </Card>
            </div>
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
                Preferred sales channels
              </h3>
              <HBar data={channels} color={COLORS.probio} />
            </Card>
          </div>
        )}

        <footer className="mt-16 pt-6 text-xs" style={{ borderTop: `1px solid ${COLORS.line}`, color: COLORS.inkSoft }}>
          Source: "Demand Survey for Sugarcane & Fruit Enzyme Water — VOLCANE," Google Forms,
          127 respondents, University Village of Vietnam National University HCMC. Some
          percentages in the original export do not sum to exactly 100% due to rounding or
          multi-select questions.
        </footer>
      </div>
    </div>
  );
}
