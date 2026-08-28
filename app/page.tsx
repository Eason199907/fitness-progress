"use client";
import { useState } from "react";

const sessions = [
  {
    date: "08.03",
    part: "胸",
    intensity: 70,
    note: "胸部基础容量",
    tone: "coral",
    time: "08:00–09:00",
    cardioTime: null,
    mode: "力量训练 · 胸部",
    sleep: "一般",
    warmup: "筋膜松解 · 胸椎灵活 · 肩袖热身",
    calories: "280–380",
    actions: [
      { name: "杠铃平板卧推", sets: "12×20kg；3组 12×30kg" },
      { name: "哑铃上斜卧推", sets: "2组 12×10kg；12×7.5kg" },
      { name: "助力双杠臂屈伸", sets: "10×助力50kg；2组 10×助力55kg" },
      { name: "坐姿推胸", sets: "3组 12×20kg" },
    ],
    cardio: null,
    strengthCalories: null,
    cardioCalories: null,
  },
  {
    date: "08.04",
    part: "背",
    intensity: 70,
    note: "垂直拉与水平拉",
    tone: "blue",
    time: "11:00–12:00",
    cardioTime: null,
    mode: "力量训练 · 背部",
    sleep: "一般",
    warmup: "筋膜松解 · 胸椎灵活",
    calories: "300–410",
    actions: [
      { name: "助力引体向上", sets: "4组 10×助力45kg" },
      { name: "仰卧上斜划船", sets: "4组 10×自重" },
      { name: "对握下拉", sets: "4组 10×25kg" },
      { name: "对握坐姿划船", sets: "4组 12×20kg" },
    ],
    cardio: null,
    strengthCalories: null,
    cardioCalories: null,
  },
  {
    date: "08.06",
    part: "腿",
    intensity: 85,
    note: "深蹲主导训练",
    tone: "lime",
    time: "10:00–11:00",
    cardioTime: null,
    mode: "力量训练 · 腿部",
    sleep: "一般",
    warmup: "筋膜松解 · 动态伸展",
    calories: "390–500",
    actions: [
      { name: "泽奇深蹲", sets: "12×20kg；3组 12×40kg" },
      { name: "保加利亚分腿蹲", sets: "12×自重；3组 12×10kg" },
      { name: "哈克深蹲", sets: "3组 10×40kg" },
    ],
    cardio: null,
    strengthCalories: null,
    cardioCalories: null,
  },
  {
    date: "08.10",
    part: "胸",
    intensity: 70,
    note: "胸部力量＋独立有氧",
    tone: "coral",
    time: "09:00–10:00",
    cardioTime: "10:00–10:30",
    hideCardioMark: true,
    mode: "力量训练＋有氧训练",
    sleep: "良好 · 6小时",
    warmup: "筋膜松解 · 胸椎灵活 · 肩袖热身 · 前锯肌激活 · 呼吸",
    calories: "590–750",
    actions: [
      { name: "杠铃平板卧推", sets: "4组 12×20kg" },
      { name: "哑铃上斜卧推", sets: "4组 12×7.5kg" },
      { name: "杠铃下斜卧推", sets: "4组 12×20kg" },
      { name: "坐姿推胸", sets: "4组 12×25kg" },
      { name: "蝴蝶机夹胸", sets: "4组 12×20kg" },
    ],
    cardio: "爬楼机 · 30分钟",
    strengthCalories: "300–410",
    cardioCalories: "290–340",
  },
  {
    date: "08.14",
    part: "背",
    intensity: 80,
    note: "引体容量明显提升",
    tone: "blue",
    time: "21:00–22:00",
    cardioTime: null,
    mode: "力量训练 · 背部",
    sleep: "较差",
    warmup: "筋膜松解 · 胸椎灵活 · 前锯肌激活 · 靠墙天使",
    calories: "330–440",
    actions: [
      { name: "助力引体向上", sets: "12 / 12 / 10 / 10×助力45kg" },
      { name: "绳索对握下拉", sets: "4组 12×50kg" },
      { name: "绳索对握划船", sets: "12×50kg；3组 12×40kg" },
    ],
    cardio: null,
    strengthCalories: null,
    cardioCalories: null,
  },
  {
    date: "08.16",
    part: "腿",
    intensity: 80,
    note: "完整臀腿后侧＋核心",
    tone: "lime",
    time: "14:00–16:00",
    cardioTime: null,
    mode: "力量训练 · 腿部＋核心",
    sleep: "良好",
    warmup: "筋膜松解 · 核心激活 · 动态伸展",
    calories: "700–900",
    actions: [
      { name: "泽奇深蹲", sets: "3组 12×20kg；12×50kg" },
      { name: "犀牛深蹲", sets: "4组 12×40kg" },
      { name: "哈克深蹲", sets: "4组 12×30kg" },
      { name: "杠铃罗马尼亚硬拉", sets: "4组 12×40kg" },
      { name: "坐姿腿弯举", sets: "4组 15×25kg" },
      { name: "坐姿腿屈伸", sets: "4组 15×25kg" },
      { name: "负重卷腹", sets: "4组 15×10kg" },
    ],
    cardio: null,
    strengthCalories: null,
    cardioCalories: null,
  },
  {
    date: "08.19",
    part: "胸",
    groups: "胸部＋肩部＋腹部",
    intensity: 75,
    note: "胸肩推动＋腹部稳定",
    tone: "coral",
    time: "19:45–20:45",
    mode: "力量训练＋爬坡有氧 · 胸肩腹",
    sleep: "良好",
    warmup: "胸椎灵活 · 肩袖热身 · 前锯肌激活",
    calories: "560–700",
    actions: [
      { name: "史密斯站姿推肩", sets: "3组 15×空" },
      { name: "蝴蝶机坐姿推肩", sets: "3组 15×20kg" },
      { name: "蝴蝶机上斜卧推", sets: "4组 12×25kg" },
      { name: "固定分推平板卧推", sets: "4组 10×5kg" },
      { name: "固定下斜夹胸", sets: "3组 12×20kg" },
      { name: "固定卷腹", sets: "4组 12×空" },
    ],
    cardio: "爬坡机 · 30分钟",
    cardioTime: "20:45–21:15",
    hideCardioMark: true,
    cardioHeartRate: 120,
    strengthCalories: "280–390",
    cardioCalories: "280–310",
  },
  {
    date: "08.20",
    part: "背",
    groups: "背部",
    intensity: 60,
    note: "感受动作发力",
    tone: "blue",
    time: "19:30–20:30",
    cardioTime: null,
    mode: "力量训练 · 背部",
    sleep: "良好",
    warmup: "筋膜松解 · 胸椎灵活 · 前锯肌激活",
    calories: "300–420",
    actions: [
      { name: "悬垂控腿", sets: "2组 25秒×自重 · 间歇60秒" },
      { name: "助力引体", sets: "10×50kg；10×50kg；15×60kg；15×60kg" },
      { name: "窄距坐姿划船", sets: "15×20kg；15×20kg；15×15kg；15×15kg" },
      { name: "反手窄距下拉", sets: "15×20kg；15×20kg；15×25kg；15×25kg" },
      { name: "TRX划船", sets: "4组 15×自重" },
      { name: "悬垂抬腿", sets: "3组 15×自重" },
    ],
    cardio: null,
    strengthCalories: null,
    cardioCalories: null,
  },
  {
    date: "08.25",
    part: "腿",
    groups: "腿部",
    intensity: 75,
    note: "西安健身房 · 自主训练",
    tone: "lime",
    time: "13:30–15:00",
    cardioTime: null,
    mode: "力量训练 · 腿部",
    sleep: "良好",
    warmup: "前锯肌激活 · 腿部拉伸激活",
    calories: "650–850",
    actions: [
      { name: "泽奇深蹲", sets: "3组 12×30kg；1组 12×50kg" },
      { name: "保加利亚分腿蹲", sets: "4组 12×10kg" },
      { name: "杠铃罗马尼亚硬拉", sets: "2组 12×40kg；1组 12×20kg；1组 12×30kg" },
      { name: "哈克深蹲", sets: "2组 12×40kg；1组 12×50kg；1组 12×65kg" },
      { name: "坐姿腿弯举", sets: "4组 15×30kg" },
      { name: "站姿腿屈伸", sets: "4组 15×0kg" },
    ],
    cardio: null,
    strengthCalories: null,
    cardioCalories: null,
  },
  {
    date: "08.27",
    part: "胸＋背",
    groups: "胸部＋背部＋腹部",
    intensity: 80,
    note: "胸背复合训练＋核心",
    tone: "split-chest-back",
    time: "15:00–16:00",
    cardioTime: null,
    mode: "力量训练 · 胸背腹",
    sleep: "良好",
    warmup: "筋膜松解 · 前锯肌激活 · 胸椎旋转",
    extraSession: "14:00–15:00 拉伸课 · 上半身筋膜松解",
    stretchSession: "14:00–15:00 拉伸课 · 上半身筋膜松解",
    calories: "480–620",
    actions: [
      { name: "杠铃平板卧推", sets: "4组 8×40kg" },
      { name: "固定俯身划船", sets: "4组 8×20kg" },
      { name: "蝴蝶机上斜推胸", sets: "4组 12×25kg" },
      { name: "背大下拉", sets: "4组 12×40kg" },
      { name: "固定下斜卧推", sets: "4组 12×45kg" },
      { name: "龙门架坐姿划船", sets: "4组 12×13kg" },
      { name: "蝴蝶机下拉", sets: "4组 12×30kg" },
      { name: "坐姿水平夹胸", sets: "4组 12×15kg" },
      { name: "固定卷腹", sets: "4组 15×空" },
    ],
    cardio: null,
    strengthCalories: null,
    cardioCalories: null,
  },
  {
    date: "08.28",
    part: "腿",
    groups: "腿部力量＋腿部拉伸",
    intensity: 95,
    note: "高强度腿部训练 · 很累",
    tone: "lime",
    time: "18:00–19:00",
    cardioTime: null,
    mode: "力量训练 · 腿部",
    sleep: "良好",
    diet: "已进食",
    warmup: "慢跑10分钟 · 筋膜松解 · 核心激活 · 动态伸展",
    stretchSession: "腿部拉伸",
    calories: "480–620",
    actions: [
      { name: "弓步交叉跳", sets: "1组 12次 · 神经激活" },
      { name: "泽奇深蹲", sets: "4组 10×50kg · 间歇90秒" },
      { name: "杠铃罗马尼亚硬拉", sets: "4组 12×40kg · 间歇90秒" },
      { name: "弓步行走", sets: "3组 12×12.5kg×2 · 间歇120秒" },
      { name: "俯卧腿弯举", sets: "12 / 15 / 15 / 15×空杠 · 间歇60秒" },
      { name: "杠铃臀推", sets: "12×50kg；3组 12×70kg · 间歇90秒" },
      { name: "哈克深蹲", sets: "4组 12×40kg · 间歇90秒" },
    ],
    cardio: null,
    strengthCalories: null,
    cardioCalories: null,
  },
];

function calendarTone(session: (typeof sessions)[number] | undefined) {
  if (!session) return "";
  const tone = session.tone === "split-chest-back" ? "split-chest-back" : session.tone;
  return `${tone}${session.cardio ? " cardio-session" : ""}${session.stretchSession ? " stretch-session" : ""}`;
}
const composition = [
  ["体重", "69.5", "kg", "正常"],
  ["BMI", "21.9", "", "正常"],
  ["体脂率", "22.8", "%", "略高"],
  ["肌肉量", "50.5", "kg", "正常偏低"],
  ["骨骼肌", "31.3", "kg", "正常"],
  ["去脂体重", "53.6", "kg", "正常"],
  ["内脏脂肪", "5", "级", "正常"],
  ["基础代谢", "1571", "kcal", "正常"],
];
const circumference: [[string, number]] | [string, number][] = [
  ["胸围", 99.7],
  ["腰围", 97.6],
  ["臀围", 107.1],
  ["左上臂", 33.9],
  ["右上臂", 32.5],
  ["左大腿", 61.7],
  ["右大腿", 62.1],
  ["左小腿", 34.6],
  ["右小腿", 33.0],
];
function Ring({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="ring-wrap">
      <div
        className="ring"
        style={
          { "--p": `${value * 3.6}deg`, "--ring": color } as React.CSSProperties
        }
      >
        <span>
          {value}
          <small>%</small>
        </span>
      </div>
      <p>{label}</p>
    </div>
  );
}

function intensityTone(value: number | null) {
  if (!value) return "unrated";
  if (value >= 85) return "very-high";
  if (value >= 80) return "high";
  return "moderate";
}

function sleepTone(value: string) {
  if (value.includes("良好")) return "good";
  if (value.includes("较差")) return "poor";
  return "fair";
}

function exerciseKind(name: string) {
  if (name.includes("双杠") || name.includes("臂屈伸")) return "dip";
  if (name.includes("卧推") || name.includes("推胸") || name.includes("夹胸"))
    return "press";
  if (name.includes("引体") || name.includes("下拉")) return "pull";
  if (name.includes("划船")) return "row";
  if (name.includes("硬拉")) return "hinge";
  if (name.includes("腿弯举") || name.includes("腿屈伸")) return "leg-machine";
  if (name.includes("卷腹")) return "core";
  return "squat";
}

function ExerciseIcon({ name }: { name: string }) {
  const kind = exerciseKind(name);
  return (
    <span className={`exercise-icon ${kind}`} aria-hidden="true">
      <svg viewBox="0 0 36 28" fill="none">
        {kind === "press" && (
          <>
            <path d="M3 22h29M8 19h18v3M10 16l5-5 8 5M5 9h26M8 6v6M28 6v6" />
            <circle cx="8" cy="16" r="2.2" />
          </>
        )}
        {kind === "dip" && (
          <>
            <path d="M5 10h9M22 10h9M10 10l4 5M26 10l-4 5M18 9v10M18 19l-5 6M18 19l5 6" />
            <circle cx="18" cy="5.5" r="2.4" />
          </>
        )}
        {kind === "pull" && (
          <>
            <path d="M5 3h26M9 3l7 7M27 3l-7 7M18 10v9M18 19l-5 6M18 19l5 6" />
            <circle cx="18" cy="7.5" r="2.3" />
          </>
        )}
        {kind === "row" && (
          <>
            <path d="M4 22h27M10 19l7-8 6 7M17 11l9-3M25 6l3 4M17 18h11" />
            <circle cx="15" cy="8" r="2.3" />
          </>
        )}
        {kind === "squat" && (
          <>
            <path d="M5 9h26M9 6v6M27 6v6M18 9v8M18 17l-7 4 4 5M18 17l7 4-4 5M13 12h10" />
            <circle cx="18" cy="5" r="2.3" />
          </>
        )}
        {kind === "hinge" && (
          <>
            <path d="M4 23h28M8 20h20M18 12l8 6M18 12l-5 8M18 12l-8-3M13 20l-5 3M13 20l6 3" />
            <circle cx="9" cy="7" r="2.3" />
          </>
        )}
        {kind === "leg-machine" && (
          <>
            <path d="M7 22h8V12M7 12h9M16 12l5 5h8M21 17l-2 7M29 15v5M25 20h8" />
            <circle cx="13" cy="7.5" r="2.3" />
          </>
        )}
        {kind === "core" && (
          <>
            <path d="M3 22h30M8 20h8l6-8M22 12l6 6M9 18l5-7M14 11l5 2" />
            <circle cx="14" cy="8" r="2.3" />
          </>
        )}
      </svg>
    </span>
  );
}

export default function Home() {
  const [tab, setTab] = useState<"overview" | "training" | "body">("overview");
  const [selectedDay, setSelectedDay] = useState(16);
  const selectedSession = sessions.find(
    (s) => Number(s.date.slice(3)) === selectedDay,
  );
  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <span className="mark">Y</span>
          <div>
            <b>个人健身档案</b>
            <small>FITNESS LOG · 2026</small>
          </div>
        </div>
        <div className="status">
          <span />
          持续更新
        </div>
      </header>
      <section className="home-calendar home-calendar-hero">
        <div className="home-calendar-title">
          <div>
            <p>TRAINING CALENDAR</p>
            <h2>8月训练月历</h2>
          </div>
          <span>点击日期查看当天训练细节</span>
        </div>
        <div className="home-calendar-body">
          <div className="mini-calendar">
            <div className="weekdays">
              {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="calendar-grid">
              {Array.from({ length: 37 }, (_, i) => {
                const day = i < 6 ? null : i - 5;
                const workout = day
                  ? sessions.find((s) => Number(s.date.slice(3)) === day)
                  : undefined;
                return day ? (
                  <button
                    key={day}
                    className={`${workout ? `has-workout ${calendarTone(workout)}` : ""} ${selectedDay === day ? "selected" : ""}`}
                    onClick={() => setSelectedDay(day)}
                    aria-label={`8月${day}日${workout ? `${workout.part}部训练，查看训练细节` : "无训练记录"}`}
                  >
                    <span>{day}</span>
                    {workout && (
                      <span className="workout-marks">
                        <i />
                        {workout.cardio && !workout.hideCardioMark && <i className="cardio-dot" />}
                      </span>
                    )}
                  </button>
                ) : (
                  <span className="calendar-blank" key={`home-blank-${i}`} />
                );
              })}
            </div>
          </div>
          <div className={`day-detail ${selectedSession?.tone || "rest"}`}>
            <div className="detail-heading">
              <div className="day-number">
                <small>AUG</small>
                <strong>{String(selectedDay).padStart(2, "0")}</strong>
              </div>
              <div>
                {selectedSession ? (
                  <>
                    <p>训练详情</p>
                    <div className="detail-title-row">
                      <h3>
                        {selectedSession.groups || `${selectedSession.part}部力量`}
                        {selectedSession.cardio && selectedSession.part !== "有氧" ? "＋有氧" : ""}
                      </h3>
                      <b className="detail-time">
                        {selectedSession.time}
                        {selectedSession.cardioTime && (
                          <small>{selectedSession.cardioTime} 有氧</small>
                        )}
                      </b>
                    </div>
                    {selectedSession.extraSession && <small className="extra-session">{selectedSession.extraSession}</small>}
                  </>
                ) : (
                  <>
                    <p>当日状态</p>
                    <h3>休息或未记录训练</h3>
                  </>
                )}
              </div>
            </div>
            {selectedSession ? (
              <>
                <div className="session-meta">
                  <span>
                    运动方式<b>{selectedSession.mode}</b>
                  </span>
                  <span
                    className={`intensity-card ${intensityTone(selectedSession.intensity)}`}
                  >
                    运动强度
                    <b>
                      {selectedSession.intensity
                        ? `${selectedSession.intensity}%`
                        : "未记录"}
                    </b>
                    <i className="intensity-track">
                      <i
                        style={{
                          width: `${selectedSession.intensity || 0}%`,
                        }}
                      />
                    </i>
                  </span>
                  <span className={`sleep-card ${sleepTone(selectedSession.sleep)}`}>
                    睡眠质量<b>{selectedSession.sleep}</b>
                    <i className="sleep-scale">
                      <i />
                      <i />
                      <i />
                    </i>
                  </span>
                </div>
                <div className="warmup-block">
                  <span>热身内容</span>
                  <b>{selectedSession.warmup}</b>
                </div>
                {selectedSession.diet && (
                  <div className="warmup-block">
                    <span>饮食情况</span>
                    <b>{selectedSession.diet}</b>
                  </div>
                )}
                {selectedSession.stretchSession && (
                  <div className="stretch-block">
                    <span>{selectedSession.stretchSession.includes("拉伸课") ? "拉伸课" : "拉伸记录"}</span>
                    <b>{selectedSession.stretchSession}</b>
                  </div>
                )}
                <div className="exercise-table">
                  {selectedSession.actions.map((a) => (
                    <div key={a.name}>
                      <ExerciseIcon name={a.name} />
                      <b>{a.name}</b>
                      <span>{a.sets}</span>
                    </div>
                  ))}
                </div>
                {selectedSession.cardio && (
                  <div className="cardio-block">
                    <span>独立有氧</span>
                    <b>
                      {selectedSession.cardio}
                      <small>{selectedSession.cardioTime}</small>
                      {selectedSession.cardioHeartRate && (
                        <small>平均心率 {selectedSession.cardioHeartRate} 次/分钟</small>
                      )}
                    </b>
                  </div>
                )}
                <div className="calorie-row">
                  <span>估算消耗</span>
                  <b>{selectedSession.calories} kcal</b>
                </div>
                {selectedSession.cardio && (
                  <div className="energy-breakdown">
                    力量 {selectedSession.strengthCalories} kcal · 有氧{" "}
                    {selectedSession.cardioCalories} kcal
                  </div>
                )}
                <p className="calorie-note">
                  消耗按69.5kg体重、训练类型及已有时间记录估算，仅作趋势参考。
                </p>
              </>
            ) : (
              <p className="rest-note">保持恢复，为下一次训练做好准备。</p>
            )}
          </div>
        </div>
      </section>
      <nav className="tabs" aria-label="档案分类">
        <button
          className={tab === "overview" ? "active" : ""}
          onClick={() => setTab("overview")}
        >
          总览
        </button>
        <button
          className={tab === "training" ? "active" : ""}
          onClick={() => setTab("training")}
        >
          训练记录
        </button>
        <button
          className={tab === "body" ? "active" : ""}
          onClick={() => setTab("body")}
        >
          体测数据
        </button>
      </nav>
      {tab === "overview" && (
        <div className="content">
          <section className="section-head">
            <div>
              <p>AT A GLANCE</p>
              <h2>当前身体状态</h2>
            </div>
            <span>首次体测基线</span>
          </section>
          <div className="metric-grid">
            <article className="metric feature">
              <span>体脂率</span>
              <strong>
                22.8<small>%</small>
              </strong>
              <div className="meter">
                <i style={{ width: "76%" }} />
              </div>
              <p>设备标准略高 · 优先缓慢下降</p>
            </article>
            <article className="metric">
              <span>骨骼肌</span>
              <strong>
                31.3<small>kg</small>
              </strong>
              <p className="good">正常 · 有提升空间</p>
            </article>
            <article className="metric">
              <span>肌肉量</span>
              <strong>
                50.5<small>kg</small>
              </strong>
              <p>处于设备正常范围下端</p>
            </article>
            <article className="metric">
              <span>内脏脂肪</span>
              <strong>
                5<small>级</small>
              </strong>
              <p className="good">正常 · 风险较低</p>
            </article>
          </div>
          <div className="split">
            <article className="panel">
              <div className="panel-title">
                <div>
                  <p>TRAINING BALANCE</p>
                  <h3>训练分布</h3>
                </div>
                <b>均衡</b>
              </div>
              <div className="rings">
                <Ring value={33} label="胸" color="#3988d4" />
                <Ring value={33} label="背" color="#6caef0" />
                <Ring value={33} label="下肢" color="#9bcdf5" />
              </div>
              <p className="caption">26天完成11次训练，力量训练覆盖胸、背与下肢。</p>
            </article>
            <article className="panel focus">
              <div className="panel-title">
                <div>
                  <p>TRAINING PRIORITY</p>
                  <h3>当前训练顺序</h3>
                </div>
                <span>01</span>
              </div>
              <ol>
                <li>
                  <b>恢复肩部活动度</b>
                  <small>避免受限轨迹下硬顶重量</small>
                </li>
                <li>
                  <b>强化肩胛控制</b>
                  <small>前锯肌、斜方肌中下束</small>
                </li>
                <li>
                  <b>动作稳定后加重</b>
                  <small>以轨迹和控制作为前提</small>
                </li>
              </ol>
            </article>
          </div>
          <aside className="note">
            <b>肩部训练原则</b>
            <p>
              当前阶段以无痛活动范围、肩胛顺畅上回旋和稳定控制为判断标准。先把动作做稳，再增加训练重量；若出现疼痛、卡顿或明显代偿，应让教练重新评估动作。
            </p>
          </aside>
        </div>
      )}
      {tab === "training" && (
        <div className="content training-content">
          <section className="calendar-panel">
            <div className="calendar-top">
              <div>
                <p>TRAINING CALENDAR</p>
                <b>2026 · 08</b>
                <span>11次</span>
              </div>
              <div className="calendar-legend">
                <span>
                  <i className="dot chest" />胸
                </span>
                <span>
                  <i className="dot back" />背
                </span>
                <span>
                  <i className="dot legs" />腿
                </span>
                        <span>
                  <i className="dot cardio" />有氧
                </span>
                <span>
                  <i className="dot stretch" />拉伸
                </span>
              </div>
            </div>
            <div className="calendar-layout">
              <div className="mini-calendar">
                <div className="weekdays">
                  {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
                <div className="calendar-grid">
                  {Array.from({ length: 37 }, (_, i) => {
                    const day = i < 6 ? null : i - 5;
                    const workout = day
                      ? sessions.find((s) => Number(s.date.slice(3)) === day)
                      : undefined;
                    return day ? (
                      <button
                        key={day}
                        className={`${workout ? `has-workout ${calendarTone(workout)}` : ""} ${selectedDay === day ? "selected" : ""}`}
                        onClick={() => setSelectedDay(day)}
                        aria-label={`8月${day}日${workout ? `${workout.part}部训练${workout.cardio ? "及有氧训练" : ""}` : "无训练记录"}`}
                      >
                        <span>{day}</span>
                        {workout && (
                          <span className="workout-marks">
                            <i />
                            {workout.cardio && !workout.hideCardioMark && <i className="cardio-dot" />}
                          </span>
                        )}
                      </button>
                    ) : (
                      <span className="calendar-blank" key={`blank-${i}`} />
                    );
                  })}
                </div>
                <p className="calendar-hint">点选有颜色的日期查看完整训练</p>
              </div>
              <div className={`day-detail ${selectedSession?.tone || "rest"}`}>
                <div className="detail-heading">
                  <div className="day-number">
                    <small>AUG</small>
                    <strong>{String(selectedDay).padStart(2, "0")}</strong>
                  </div>
                  <div>
                    {selectedSession ? (
                      <>
                        <p>训练详情</p>
                        <div className="detail-title-row">
                          <h3>
                            {selectedSession.groups || `${selectedSession.part}部力量`}
                            {selectedSession.cardio && selectedSession.part !== "有氧" ? "＋有氧" : ""}
                          </h3>
                          <b className="detail-time">
                            {selectedSession.time}
                            {selectedSession.cardioTime && (
                              <small>{selectedSession.cardioTime} 有氧</small>
                            )}
                          </b>
                        </div>
                        {selectedSession.extraSession && <small className="extra-session">{selectedSession.extraSession}</small>}
                      </>
                    ) : (
                      <>
                        <p>当日状态</p>
                        <h3>休息或未记录训练</h3>
                      </>
                    )}
                  </div>
                </div>
                {selectedSession ? (
                  <>
                    <div className="session-meta">
                      <span>
                        运动方式<b>{selectedSession.mode}</b>
                      </span>
                      <span
                        className={`intensity-card ${intensityTone(selectedSession.intensity)}`}
                      >
                        运动强度
                        <b>
                          {selectedSession.intensity
                            ? `${selectedSession.intensity}%`
                            : "未记录"}
                        </b>
                        <i className="intensity-track">
                          <i
                            style={{
                              width: `${selectedSession.intensity || 0}%`,
                            }}
                          />
                        </i>
                      </span>
                      <span className={`sleep-card ${sleepTone(selectedSession.sleep)}`}>
                        睡眠质量<b>{selectedSession.sleep}</b>
                        <i className="sleep-scale">
                          <i />
                          <i />
                          <i />
                        </i>
                      </span>
                    </div>
                        <div className="warmup-block">
                      <span>热身内容</span>
                      <b>{selectedSession.warmup}</b>
                    </div>
                    {selectedSession.diet && (
                      <div className="warmup-block">
                        <span>饮食情况</span>
                        <b>{selectedSession.diet}</b>
                      </div>
                    )}
                    <div className="exercise-table">
                      {selectedSession.actions.map((a) => (
                        <div key={a.name}>
                          <ExerciseIcon name={a.name} />
                          <b>{a.name}</b>
                          <span>{a.sets}</span>
                        </div>
                      ))}
                    </div>
                    {selectedSession.stretchSession && (
                      <div className="stretch-block">
                        <span>{selectedSession.stretchSession.includes("拉伸课") ? "拉伸课" : "拉伸记录"}</span>
                        <b>{selectedSession.stretchSession}</b>
                      </div>
                    )}
                    {selectedSession.cardio && (
                      <div className="cardio-block">
                        <span>独立有氧</span>
                        <b>
                          {selectedSession.cardio}
                          <small>{selectedSession.cardioTime}</small>
                        </b>
                      </div>
                    )}
                    <div className="calorie-row">
                      <span>估算消耗</span>
                      <b>{selectedSession.calories} kcal</b>
                    </div>
                    {selectedSession.cardio && (
                      <div className="energy-breakdown">
                        力量 {selectedSession.strengthCalories} kcal · 有氧{" "}
                        {selectedSession.cardioCalories} kcal
                      </div>
                    )}
                    <p className="calorie-note">
                      消耗按69.5kg体重、训练类型及已有时间记录估算，仅作趋势参考。
                    </p>
                  </>
                ) : (
                  <p className="rest-note">保持恢复，为下一次训练做好准备。</p>
                )}
              </div>
            </div>
          </section>
          <section className="section-head timeline-head">
            <div>
              <p>TRAINING LOG</p>
              <h2>十一次训练时间线</h2>
            </div>
            <span>2026.08.03—08.28</span>
          </section>
          <div className="session-list">
            {sessions.map((s, i) => (
              <article className="session" key={s.date}>
                <div className={`session-icon ${s.tone}`}>
                  {s.part.slice(0, 1)}
                </div>
                <div className="session-date">
                  <small>2026</small>
                  <b>{s.date}</b>
                </div>
                <div className="session-main">
                  <div>
                    <h3>
                      {s.part}部{s.cardio ? "＋有氧" : ""}训练 · {s.time}
                    </h3>
                    <p>{s.note}</p>
                  </div>
                  {s.intensity && (
                    <strong>
                      {s.intensity}
                      <small>%</small>
                    </strong>
                  )}
                </div>
                <span className="session-no">0{i + 1}</span>
              </article>
            ))}
          </div>
          <div className="progress-callout">
            <div>
              <p>明确进步</p>
              <h3>助力引体：4×10 → 12 / 12 / 10 / 10</h3>
            </div>
            <span>↑</span>
          </div>
        </div>
      )}
      {tab === "body" && (
        <div className="content">
          <section className="section-head">
            <div>
              <p>BODY COMPOSITION</p>
              <h2>身体成分与围度</h2>
            </div>
            <span>Visbody · 08.16</span>
          </section>
          <div className="composition-grid">
            {composition.map(([n, v, u, s]) => (
              <article key={n}>
                <span>{n}</span>
                <strong>
                  {v}
                  <small>{u}</small>
                </strong>
                <p className={s === "略高" ? "warn" : ""}>{s}</p>
              </article>
            ))}
          </div>
          <section className="panel circumference">
            <div className="panel-title">
              <div>
                <p>CIRCUMFERENCE</p>
                <h3>围度基线</h3>
              </div>
              <b>单位 cm</b>
            </div>
            <div className="bar-list">
              {circumference.map(([n, v]) => (
                <div key={n}>
                  <span>{n}</span>
                  <div>
                    <i style={{ width: `${v / 1.15}%` }} />
                  </div>
                  <b>{v}</b>
                </div>
              ))}
            </div>
          </section>
          <div className="symmetry">
            <div>
              <p>节段肌肉</p>
              <h3>下肢左右均为 8.4 kg</h3>
              <span>左右平衡</span>
            </div>
            <div>
              <p>待复测确认</p>
              <h3>左小腿围比右侧大 1.6 cm</h3>
              <span className="yellow">先观察</span>
            </div>
          </div>
        </div>
      )}
      <footer>
        <p>PERSONAL FITNESS ARCHIVE</p>
        <span>数据来自教练训练记录及 Visbody 体测</span>
      </footer>
    </main>
  );
}
