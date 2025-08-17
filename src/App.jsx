import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
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
    gpa: "3.63",
    years: "May 2027",
    location: "Gainesville, FL",
};

const CONTACT = [
    { label: "Email", value: "andrew03huang@gmail.com", id: "contact" },
    { label: "GitHub", value: "github.com/andrewexe" },
    { label: "LinkedIn", value: "linkedin.com/in/andrew-huang-uf" },
];

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

const SONGS = [
    { title: "Back To U", artist: "Slander", src: "/music/slander.mp3" },
    { title: "Right Now", artist: "PARTYNXTDOOR", src: "/music/rn.mp3" },
    { title: "The Morning", artist: "The Weeknd", src: "/music/morning.mp3" },
    { title: "Champagne Coast", artist: "Blood Orange", src: "/music/cc.mp3" },
    { title: "No Broke Boys", artist: "Disco Lines", src: "/music/nbb.mp3" },
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

function Collapsible({ open, children }) {
    const ref = useRef(null);
    const [maxH, setMaxH] = useState(0);

    const measure = () => {
        if (!ref.current) return;
        const buffer = 24;
        setMaxH(open ? ref.current.scrollHeight + buffer : 0);
    };

    useEffect(() => { measure(); }, [open, children]);
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
            <div ref={ref} className="pt-1 pb-3">{children}</div>
        </div>
    );
}

function Row({ idx, title, org, range, type, onClick, expanded, hideRange = false }) {
    const titleSpan = hideRange ? "col-span-9" : "col-span-6";
    return (
        <button onClick={onClick} aria-expanded={expanded} className="w-full text-left">
            <div className="grid grid-cols-12 items-center py-3 px-3 hover:bg-white/5 rounded-lg">
                <div className="col-span-1 text-sm text-slate-400">{idx}</div>
                <div className={`${titleSpan} flex items-center gap-2`}>
          <span className={`transition-transform duration-200 ease-out ${expanded ? "rotate-180" : "rotate-0"}`}>
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

function Bullets({ items }) {
    return (
        <ul className="mt-2 ml-10 mr-3 list-disc text-slate-300 text-sm space-y-1">
            {items.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
    );
}

function TopHeader({ onResume }) {
    return (
        <header className="sticky top-0 z-30 bg-[#121212]/80 backdrop-blur-md border-b border-[#2a2a2a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-3 items-center">
                <div className="flex items-center gap-3">
                    <img src={META.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                    <div className="hidden sm:block">
                        <div className="text-sm font-bold leading-tight">{META.name}</div>
                        <div className="text-[11px] text-slate-400">{META.title}</div>
                    </div>
                </div>
                <nav className="flex items-center justify-center">
                    <ul className="flex items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                        {[
                            { href: "#top", Icon: Home, label: "Home" },
                            { href: "mailto:andrew03huang@gmail.com", Icon: Mail, label: "Email" },
                            { href: "https://linkedin.com/in/andrew-huang-uf", Icon: Linkedin, label: "LinkedIn" },
                            { href: "https://github.com/andrewexe", Icon: Github, label: "GitHub" },
                        ].map(({ href, Icon, label }) => (
                            <li key={href}>
                                <a
                                    href={href}
                                    target={href.startsWith("http") ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
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

// Time format helper
const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

function CoverArt({ src, size = 48, alt = "Album cover" }) {
    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className="rounded-md object-cover"
                style={{ width: size, height: size }}
            />
        );
    }
    // Default Apple-like placeholder
    return (
        <div
            aria-label={alt}
            className="rounded-md grid place-items-center"
            style={{
                width: size,
                height: size,
                background:
                    "linear-gradient(135deg, rgb(99,102,241) 0%, rgb(147,51,234) 50%, rgb(236,72,153) 100%)",
            }}
        >
            <svg
                width={Math.floor(size * 0.55)}
                height={Math.floor(size * 0.55)}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
            </svg>
        </div>
    );
}

function PlayerBar({
                       isPlaying,
                       shuffle,
                       repeat,
                       volume,
                       song,
                       trackProgress,
                       onTogglePlaying,
                       onToggleShuffle,
                       onToggleRepeat,
                       onNext,
                       onPrev,
                       onVolumeChange,
                       onSeek,
                   }) {
    const pct = trackProgress.duration > 0
        ? (trackProgress.currentTime / trackProgress.duration) * 100
        : 0;

    return (
        <div className="fixed left-0 right-0 bottom-0 z-40 bg-[#181818]/95 border-t border-[#2a2a2a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
                {/* Current song info */}
                <div className="w-48 hidden sm:flex items-center gap-3">
                    <CoverArt src={song.cover} size={48} alt={`${song.title} cover`} />
                    <div>
                        <div className="font-semibold text-sm text-slate-100">{song.title}</div>
                        <div className="text-xs text-slate-400">{song.artist}</div>
                    </div>
                </div>

                {/* Main Controls */}
                <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                        <button
                            className={`p-2 rounded-full transition-colors duration-200 ${
                                shuffle ? "text-emerald-400" : "text-slate-400 hover:text-slate-100"
                            }`}
                            onClick={onToggleShuffle}
                            aria-label="Shuffle"
                            title="Shuffle"
                        >
                            <Shuffle size={18} />
                        </button>

                        <button onClick={onPrev} className="p-2 text-slate-400 hover:text-slate-100 rounded" aria-label="Previous">
                            <SkipBack size={18} />
                        </button>

                        <button
                            className={`p-3 rounded-full transition-colors duration-200 ease-out hover:scale-105 transition-transform ${
                                isPlaying
                                    ? "bg-emerald-500 text-slate-900 hover:bg-emerald-400"
                                    : "bg-white text-slate-900 hover:bg-slate-200"
                            }`}
                            onClick={onTogglePlaying}
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>

                        <button onClick={onNext} className="p-2 text-slate-400 hover:text-slate-100 rounded" aria-label="Next">
                            <SkipForward size={18} />
                        </button>

                        <button
                            onClick={onToggleRepeat}
                            aria-label={repeat ? "Repeat: on" : "Repeat: off"}
                            title={repeat ? "Repeat current track (on)" : "Repeat current track (off)"}
                            className={`relative p-2 rounded-full transition-colors duration-200 ${
                                repeat ? "text-emerald-400" : "text-slate-400 hover:text-slate-100"
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m17 2 4 4-4 4"/>
                                <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
                                <path d="m7 22-4-4 4-4"/>
                                <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
                            </svg>
                            {repeat && (
                                <span className="absolute -top-1 -right-1 text-[10px] leading-none px-1.5 py-[2px] rounded-full bg-emerald-500 text-black">
                  1
                </span>
                            )}
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full flex items-center gap-3">
                        <div className="w-10 text-xs tabular-nums text-slate-400">
                            {formatTime(trackProgress.currentTime)}
                        </div>
                        <div
                            className="h-1 flex-1 bg-slate-700 rounded-full group cursor-pointer"
                            onClick={onSeek}
                        >
                            <div className="h-full bg-white group-hover:bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="w-10 text-xs tabular-nums text-slate-400">
                            {formatTime(trackProgress.duration)}
                        </div>
                    </div>
                </div>

                {/* Volume */}
                <div className="w-48 hidden md:flex items-center gap-2 justify-end">
                    <Volume2 size={18} className="text-slate-200" />
                    <div className="w-28 h-1 bg-slate-700 rounded-full overflow-hidden relative group">
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={onVolumeChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="h-full bg-white group-hover:bg-emerald-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function BelowControls({ playing, shuffle, onTogglePlaying, onToggleShuffle }) {
    return (
        <div className="mt-4 flex items-center gap-3">
            <button
                aria-label={playing ? "Pause" : "Play"}
                onClick={onTogglePlaying}
                className={`p-3 rounded-full transition-colors duration-200 ease-out hover:scale-105 transition-transform ${
                    playing
                        ? "bg-emerald-500 text-slate-900 hover:bg-emerald-400"
                        : "bg-white text-slate-900 hover:bg-slate-200"
                }`}
            >
                {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
                aria-label="Shuffle"
                onClick={onToggleShuffle}
                className={`p-3 rounded-full border transition-colors duration-200 ${
                    shuffle ? "bg-emerald-500 text-slate-900 border-emerald-500" : "bg-white/10 text-slate-100 border-white/10 hover:bg-white/15"
                }`}
                title="Shuffle"
            >
                <Shuffle size={18} />
            </button>
        </div>
    );
}

// === Main App ===
export default function App() {
    const [resumeOpen, setResumeOpen] = useState(false);
    const [expOpen, setExpOpen] = useState(null);
    const [projOpen, setProjOpen] = useState(null);

    // Music State
    const [songs] = useState(SONGS);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [trackProgress, setTrackProgress] = useState({ currentTime: 0, duration: 0 });

    const audioRef = useRef(null);

    const togglePlayPause = () => setIsPlaying((p) => !p);
    const toggleShuffle = () => setShuffle((s) => !s);

    const playNextSong = useCallback(() => {
        setCurrentSongIndex((idx) => {
            if (shuffle) {
                let next = idx;
                if (songs.length > 1) {
                    while (next === idx) next = Math.floor(Math.random() * songs.length);
                }
                return next;
            }
            return (idx + 1) % songs.length;
        });
    }, [shuffle, songs.length]);

    const playPrevSong = () => {
        setCurrentSongIndex((idx) => (idx - 1 + songs.length) % songs.length);
    };

    const handleVolumeChange = (e) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) audioRef.current.volume = newVolume;
    };

    const handleSeek = (e) => {
        if (!audioRef.current || trackProgress.duration === 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const ratio = Math.min(Math.max(clickX / rect.width, 0), 1);
        audioRef.current.currentTime = ratio * trackProgress.duration;
    };

    const handleEnded = () => {
        if (!audioRef.current) return;
        if (repeat) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
        } else {
            playNextSong();
        }
    };

    // Sync play/pause
    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch((err) => {
                console.error("Error playing audio:", err);
                setIsPlaying(false);
            });
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // On song change, reset time and auto-play if currently playing
    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = 0;
        if (isPlaying) {
            audioRef.current.play().catch((err) => console.error("Error playing audio:", err));
        }
    }, [currentSongIndex, isPlaying]);

    const year = useMemo(() => new Date().getFullYear(), []);
    const resumeSrc = "/resume.pdf";

    return (
        <div id="top" className="min-h-screen bg-[#121212] text-slate-100">
            <audio
                ref={audioRef}
                src={songs[currentSongIndex].src}
                onEnded={handleEnded}
                onTimeUpdate={(e) =>
                    setTrackProgress((tp) => ({ ...tp, currentTime: e.target.currentTime }))
                }
                onLoadedMetadata={(e) =>
                    setTrackProgress((tp) => ({ ...tp, duration: e.target.duration }))
                }
            />

            <TopHeader onResume={() => setResumeOpen(true)} />

            <main className="max-w-7xl mx-auto px-6 pt-3 pb-28">
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                    <aside id="about" className="rounded-2xl border border-[#2a2a2a] bg-[#181818]/80 p-5">
                        <h3 className="text-lg font-bold mb-2">About me</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            I'm Andrew, a CS + Math student @ UF. I build reliable backends, cloud services,
                            and ML-powered tools. I love shipping things that make a real impact.
                        </p>
                    </aside>
                </section>

                <section className="mt-3">
                    <BelowControls
                        playing={isPlaying}
                        shuffle={shuffle}
                        onTogglePlaying={togglePlayPause}
                        onToggleShuffle={toggleShuffle}
                    />
                </section>

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
                isPlaying={isPlaying}
                shuffle={shuffle}
                repeat={repeat}
                volume={volume}
                song={songs[currentSongIndex]}
                trackProgress={trackProgress}
                onTogglePlaying={togglePlayPause}
                onToggleShuffle={toggleShuffle}
                onToggleRepeat={() => setRepeat((r) => !r)}
                onNext={playNextSong}
                onPrev={playPrevSong}
                onVolumeChange={handleVolumeChange}
                onSeek={handleSeek}
            />

            <ResumeOverlay open={resumeOpen} onClose={() => setResumeOpen(false)} src={resumeSrc} />
        </div>
    );
}
