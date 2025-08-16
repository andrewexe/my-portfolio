import React, { useMemo, useState, useEffect, useRef } from "react";
import {
    Home,
    Mail,
    Github,
    Linkedin,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Shuffle,
    Download,
    Volume2,
    ChevronDown,
} from "lucide-react";

// === Data ===
const META = {
    name: "Andrew Huang",
    avatar:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=400&auto=format&fit=crop",
    title: "Portfolio",
    school: "University of Florida",
    major: "Computer Science",
    gpa: "3.9",
    years: "2023–2027",
    location: "Gainesville, FL",
};

const CONTACT = [
    { label: "Email", value: "andrew03huang@gmail.com", id: "contact" },
    { label: "GitHub", value: "github.com/andrewexe" },
    { label: "LinkedIn", value: "linkedin.com/in/andrew-huang-uf" },
];

// Experience details
const EXPERIENCE = [
    {
        title: "Software Development Engineering Intern",
        org: "OakenAG",
        range: "May '25 – Aug '25",
        type: "Internship",
        bullets: [
            "Architected an AI-powered code-review pipeline in Java with a custom SDK and CI/CD, reducing manual review by 12 hrs/week.",
            "Integrated lease-data pipelines generating 20+ formatted receipts/day; cut manual creation by 80%.",
            "Containerized PostgreSQL with Docker for consistent schema management via DBeaver.",
            "Drove E2E tuning on LLM outputs with Agile workflows (Jira/Confluence), boosting suggestion accuracy from 85%→98% over 50+ test cases.",
        ],
    },
    {
        title: "Software Engineer Intern",
        org: "OakenAG",
        range: "May '24 – Aug '24",
        type: "Internship",
        bullets: [
            "Shipped a Java SDK & GCP API for an OCR microservice, improving lease-data accuracy on 100+ docs and reducing human review by 85%.",
            "Designed case logic with Google Vertex AI to increase extraction precision by 30%.",
            "Built a Spring Boot microservice handling 10+ daily requests with 99.9% uptime; added unit tests & Postman validation.",
        ],
    },
    {
        title: "Undergraduate Researcher",
        org: "UF Machine Intelligence Lab",
        range: "Jan '24 – Aug '24",
        type: "Research",
        bullets: [
            "Engineered YOLOv7 models for real-time underwater object detection, improving accuracy by 30% on a 5,000+ image dataset.",
            "Enhanced ROS mission planning/vision/control modules to improve responsiveness and reliability.",
            "Added async support via custom Python packaging; enabled the AUV to complete 20+ missions.",
        ],
    },
];

// Projects details (no Year column shown in UI)
const PROJECTS = [
    {
        title: "HINTerview",
        org: "Personal",
        range: "2025",
        type: "Project",
        bullets: [
            "Embedded GenAI with LangChain RAG to generate contextual code hints, cutting problem-solving time by ~40%.",
            "Engineered OCR-based capture & preprocessing; achieved ~85% detection accuracy on live coding screens.",
            "Built a thread-safe, event-driven GUI (Tkinter) with async I/O for 99.9% test uptime.",
        ],
    },
    {
        title: "GeoQuiz",
        org: "Personal",
        range: "2024",
        type: "Project",
        bullets: [
            "Full-stack platform with Firebase Auth, real-time sync, and CRUD flows for quizzes/badges/progression.",
            "Reduced latency by 50% via batched REST calls & optimized request/response pipelines.",
            "Backend preprocessing generates dynamic quiz content and pushes zero-downtime updates.",
        ],
    },
    {
        title: "Bytes of Love",
        org: "Game/Story",
        range: "2024",
        type: "Project",
        bullets: [
            "Implemented branching logic & event handlers for 15+ features across a 50+ person team.",
            "Led a 6-person UI/UX sub-team to refactor layout engines, asset pipelines, and styles for higher engagement.",
            "Integrated Ren’Py scripting with TypeScript tooling to streamline interactive storyline deployment.",
        ],
    },
];

const SKILLS = [
    "C++","Java","Python","JavaScript","TypeScript","SQL","Spring Boot","React","Node.js","Docker","PostgreSQL","AWS","GCP","Azure","Linux","Git"
];

// === Helpers ===
function SectionHeader({ children }) {
    return (
        <div className="flex items-center gap-2 text-slate-200 mt-5 mb-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <h3 className="uppercase tracking-wider text-sm">{children}</h3>
        </div>
    );
}

// Collapsible with smooth max-height animation + buffer to avoid clipping
function Collapsible({ open, children }) {
    const ref = useRef(null);
    const [maxH, setMaxH] = useState(0);

    const measure = () => {
        if (!ref.current) return;
        // add buffer to prevent last line clipping during transition
        const buffer = 24; // px
        setMaxH(open ? ref.current.scrollHeight + buffer : 0);
    };

    useEffect(() => {
        measure();
    }, [open, children]);

    useEffect(() => {
        const onR = () => open && measure();
        window.addEventListener("resize", onR);
        return () => window.removeEventListener("resize", onR);
    }, [open]);

    return (
        <div
            style={{ maxHeight: maxH }}
            className="transition-[max-height] duration-300 ease-in-out overflow-hidden"
            aria-hidden={!open}
        >
            <div ref={ref} className="pt-1 pb-3">
                {children}
            </div>
        </div>
    );
}

// Row with chevron (keeps # column)
function Row({ idx, title, org, range, type, onClick, expanded, hideRange = false }) {
    const titleSpan = hideRange ? "col-span-9" : "col-span-6";
    return (
        <button onClick={onClick} aria-expanded={expanded} className="w-full text-left">
            <div className="grid grid-cols-12 items-center py-3 px-3 hover:bg-white/5 rounded-lg">
                <div className="col-span-1 text-sm text-slate-400">{idx}</div>

                <div className={`${titleSpan} flex items-center gap-2`}>
          <span
              className={`transition-transform duration-200 ease-out ${
                  expanded ? "rotate-180" : "rotate-0"
              }`}
          >
            <ChevronDown size={16} className="text-slate-400" />
          </span>
                    <div>
                        <div className="font-medium text-slate-100">{title}</div>
                        <div className="text-sm text-slate-400">{org}</div>
                    </div>
                </div>

                {!hideRange && <div className="col-span-3 text-sm text-slate-300">{range}</div>}

                <div className="col-span-2">
          <span className="text-xs rounded-full px-2 py-1 border border-[#2a2a2a] text-slate-300">
            {type}
          </span>
                </div>
            </div>
        </button>
    );
}

// Bullets
function Bullets({ items }) {
    return (
        <ul className="mt-2 ml-10 mr-3 list-disc text-slate-300 text-sm space-y-1">
            {items.map((b, i) => (
                <li key={i}>{b}</li>
            ))}
        </ul>
    );
}

// === Sticky Top Header with centered, roomier nav ===
function TopHeader({ onResume }) {
    return (
        <header className="sticky top-0 z-30 bg-[#121212]/80 backdrop-blur-md border-b border-[#2a2a2a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-3 items-center">
                {/* Left: avatar + name */}
                <div className="flex items-center gap-3">
                    <img src={META.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                    <div className="hidden sm:block">
                        <div className="text-sm font-bold leading-tight">{META.name}</div>
                        <div className="text-[11px] text-slate-400">{META.title}</div>
                    </div>
                </div>

                {/* Center: nav icons */}
                <nav className="flex items-center justify-center">
                    <ul className="flex items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                        {[
                            { href: "#top", Icon: Home, label: "Home" },
                            { href: "#about", Icon: Mail, label: "About" },
                            { href: "#contact", Icon: Linkedin, label: "Contact" },
                            { href: "#projects", Icon: Github, label: "Projects / GitHub" },
                        ].map(({ href, Icon, label }) => (
                            <li key={href}>
                                <a
                                    href={href}
                                    className="inline-flex items-center justify-center rounded-full p-3 sm:p-4 hover:bg-white/15 transition-transform duration-150 hover:scale-110"
                                    title={label}
                                    aria-label={label}
                                >
                                    <Icon size={18} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Right: résumé button */}
                <div className="flex justify-end">
                    <button
                        onClick={onResume}
                        className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-3 sm:px-4 py-1.5 text-sm font-semibold hover:bg-slate-200"
                    >
                        <Download size={16} /> Résumé
                    </button>
                </div>
            </div>
        </header>
    );
}

// === Resume overlay ===
function ResumeOverlay({ open, onClose, src }) {
    const [scale, setScale] = useState(1);
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex flex-col">
            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#2a2a2a] bg-[#121212]/90">
                <div className="text-sm text-slate-200">Résumé • Esc to close</div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 rounded-lg bg-[#1f1f1f] border border-[#2a2a2a]" onClick={() => setScale((s) => Math.max(0.6, s - 0.1))}>−</button>
                    <div className="w-14 text-center text-slate-300">{Math.round(scale * 100)}%</div>
                    <button className="px-3 py-1 rounded-lg bg-[#1f1f1f] border border-[#2a2a2a]" onClick={() => setScale((s) => Math.min(2, s + 0.1))}>+</button>
                    <button className="px-3 py-1 rounded-lg bg-[#1f1f1f] border border-[#2a2a2a]" onClick={() => setScale(1)}>Reset</button>
                    <a className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition" href={src} download>Download</a>
                    <button className="px-3 py-1 rounded-lg bg-[#1f1f1f] border border-[#2a2a2a]" onClick={onClose}>Close</button>
                </div>
            </div>
            <div className="flex-1 overflow-auto p-4 md:p-8">
                <div className="mx-auto max-w-5xl rounded-xl border border-[#2a2a2a] bg-[#121212] shadow-2xl" style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}>
                    <object data={src} type="application/pdf" className="w-[900px] h-[1200px] hidden md:block">
                        <iframe title="resume" src={src} className="w-[900px] h-[1200px]" />
                    </object>
                    <div className="md:hidden p-4 text-slate-300">PDF preview is best on desktop. Download above.</div>
                </div>
            </div>
        </div>
    );
}

// === Bottom player (green Play; Shuffle synced) + Volume slider (UI only) ===
function PlayerBar({ playing, shuffle, onTogglePlaying, onToggleShuffle }) {
    const [pos, setPos] = useState(3);
    const duration = 236;

    useEffect(() => {
        if (!playing) return;
        const t = setInterval(() => setPos((p) => Math.min(duration, p + 1)), 1000);
        return () => clearInterval(t);
    }, [playing]);

    const pct = (pos / duration) * 100;

    return (
        <div className="fixed left-0 right-0 bottom-0 z-40 bg-[#181818]/95 border-t border-[#2a2a2a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3">
                    <button
                        className={`p-2 rounded-full border transition ${
                            shuffle
                                ? "bg-emerald-500 text-slate-900 border-emerald-500"
                                : "bg-white/10 text-slate-100 border-white/10 hover:bg-white/15"
                        }`}
                        onClick={onToggleShuffle}
                        aria-label="Shuffle"
                        title="Shuffle"
                    >
                        <Shuffle size={18} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded" aria-label="Previous">
                        <SkipBack size={18} />
                    </button>
                    <button
                        className="p-2 rounded-full bg-emerald-500 text-slate-900 hover:bg-emerald-400"
                        onClick={onTogglePlaying}
                        aria-label={playing ? "Pause" : "Play"}
                    >
                        {playing ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded" aria-label="Next">
                        <SkipForward size={18} />
                    </button>
                </div>

                <div className="flex-1 flex items-center gap-3">
                    <div className="w-10 text-xs tabular-nums text-slate-400">
                        {Math.floor(pos / 60)}:{(pos % 60).toString().padStart(2, "0")}
                    </div>
                    <div className="h-1 flex-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-10 text-xs tabular-nums text-slate-400">
                        {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
                    </div>
                </div>

                {/* Volume slider (UI only) */}
                <div className="hidden md:flex items-center gap-2">
                    <Volume2 size={18} className="text-slate-200" />
                    <div className="w-28 h-1 bg-slate-700 rounded-full overflow-hidden relative">
                        <input
                            type="range"
                            min={0}
                            max={100}
                            defaultValue={70}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                        <div className="h-full bg-slate-200" style={{ width: `70%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Icon-only controls OUTSIDE the portfolio box
function BelowControls({ playing, shuffle, onTogglePlaying, onToggleShuffle }) {
    return (
        <div className="mt-4 flex items-center gap-3">
            <button
                aria-label={playing ? "Pause" : "Play"}
                onClick={onTogglePlaying}
                className="p-3 rounded-full bg-emerald-500 text-slate-900 hover:bg-emerald-400"
            >
                {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
                aria-label="Shuffle"
                onClick={onToggleShuffle}
                className={`p-3 rounded-full border transition ${
                    shuffle
                        ? "bg-emerald-500 text-slate-900 border-emerald-500"
                        : "bg-white/10 text-slate-100 border-white/10 hover:bg-white/15"
                }`}
                title="Shuffle"
            >
                <Shuffle size={18} />
            </button>
        </div>
    );
}

export default function App() {
    const [resumeOpen, setResumeOpen] = useState(false);
    const [playing, setPlaying] = useState(true); // shared
    const [shuffle, setShuffle] = useState(false); // shared
    const [expOpen, setExpOpen] = useState(null); // expanded experience index
    const [projOpen, setProjOpen] = useState(null); // expanded project index

    const year = useMemo(() => new Date().getFullYear(), []);
    const resumeSrc = "/resume.pdf"; // put your PDF in /public

    return (
        <div id="top" className="min-h-screen bg-[#121212] text-slate-100">
            <TopHeader onResume={() => setResumeOpen(true)} />

            <main className="max-w-7xl mx-auto px-6 pt-3 pb-28">
                {/* Header block */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Primary profile card */}
                    <div className="col-span-2 rounded-2xl border border-[#2a2a2a] bg-gradient-to-b from-[#1f1f1f] to-[#121212] p-5">
                        <div className="flex items-center gap-5">
                            <img src={META.avatar} alt="avatar" className="w-28 h-28 rounded-full object-cover" />
                            <div>
                                <div className="text-sm text-slate-300">{META.title}</div>
                                <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">{META.name}</h1>
                                <div className="mt-1 text-slate-300 flex flex-wrap gap-2 text-sm">
                                    <span className="font-semibold">{META.school}</span>
                                    <span>• {META.major}</span>
                                    <span>• GPA: {META.gpa}</span>
                                    <span>• {META.years}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About panel */}
                    <aside id="about" className="rounded-2xl border border-[#2a2a2a] bg-[#181818]/80 p-5">
                        <h3 className="text-lg font-bold mb-2">About me</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            I'm Andrew, a CS + Math student @ UF. I build reliable backends, cloud services,
                            and ML-powered tools. I love shipping things that make a real impact.
                        </p>
                    </aside>
                </section>

                {/* Controls row OUTSIDE the portfolio box */}
                <section className="mt-3">
                    <BelowControls
                        playing={playing}
                        shuffle={shuffle}
                        onTogglePlaying={() => setPlaying((p) => !p)}
                        onToggleShuffle={() => setShuffle((s) => !s)}
                    />
                </section>

                {/* Experience (animated dropdown) */}
                <section className="mt-8">
                    <SectionHeader>Experience</SectionHeader>
                    <div className="rounded-2xl border border-[#2a2a2a] bg-[#181818]/70 p-2">
                        <div className="grid grid-cols-12 text-slate-400 text-xs uppercase tracking-wider px-3 py-2">
                            <div className="col-span-1">#</div>
                            <div className="col-span-6">Title</div>
                            <div className="col-span-3">Dates</div>
                            <div className="col-span-2">Type</div>
                        </div>

                        {EXPERIENCE.map((e, i) => (
                            <div key={i} className="rounded-lg">
                                <Row
                                    idx={i + 1}
                                    title={e.title}
                                    org={e.org}
                                    range={e.range}
                                    type={e.type}
                                    expanded={expOpen === i}
                                    onClick={() => setExpOpen(expOpen === i ? null : i)}
                                />
                                <Collapsible open={expOpen === i}>
                                    <Bullets items={e.bullets} />
                                </Collapsible>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects (no Year col; animated dropdown) */}
                <section id="projects" className="mt-8">
                    <SectionHeader>Projects</SectionHeader>
                    <div className="rounded-2xl border border-[#2a2a2a] bg-[#181818]/70 p-2">
                        <div className="grid grid-cols-12 text-slate-400 text-xs uppercase tracking-wider px-3 py-2">
                            <div className="col-span-1">#</div>
                            <div className="col-span-9">Title</div>
                            <div className="col-span-2">Type</div>
                        </div>

                        {PROJECTS.map((p, i) => (
                            <div key={i} className="rounded-lg">
                                <Row
                                    idx={i + 1}
                                    title={p.title}
                                    org={p.org}
                                    range={p.range}
                                    type={p.type}
                                    hideRange
                                    expanded={projOpen === i}
                                    onClick={() => setProjOpen(projOpen === i ? null : i)}
                                />
                                <Collapsible open={projOpen === i}>
                                    <Bullets items={p.bullets} />
                                </Collapsible>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Skills + Contact */}
                <section className="mt-8" id="contact">
                    <SectionHeader>Skills</SectionHeader>
                    <div className="flex flex-wrap gap-2">
                        {SKILLS.map((s) => (
                            <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
                {s}
              </span>
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {CONTACT.map((c) => (
                            <div key={c.label} className="rounded-xl border border-[#2a2a2a] bg-[#181818]/80 p-4">
                                <div className="text-sm text-slate-400">{c.label}</div>
                                <div className="text-lg">{c.value}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="h-20" />
            </main>

            <footer className="max-w-7xl mx-auto px-6 pb-28 pt-4 text-sm text-slate-400">
                © {year} {META.name}
            </footer>

            <PlayerBar
                playing={playing}
                shuffle={shuffle}
                onTogglePlaying={() => setPlaying((p) => !p)}
                onToggleShuffle={() => setShuffle((s) => !s)}
            />
            <ResumeOverlay open={resumeOpen} onClose={() => setResumeOpen(false)} src="/resume.pdf" />
        </div>
    );
}
