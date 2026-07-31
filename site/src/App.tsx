import { useState, useEffect, useRef, useCallback, useId, type ElementType } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResumeEntry {
  id: string
  title: string
  subtitle?: string
  period?: string
  description?: string
  bullets?: string[]
  imageUrl?: string
  tags?: string[]
  link?: string
}

interface ResumeData {
  ownerName: string
  ownerTitle: string
  ownerEmail: string
  ownerPhone: string
  ownerLocation: string
  ownerLinkedIn: string
  ownerGitHub: string
  ownerInstagram: string
  ownerAvatar: string
  professionalSummary: string
  honorsAwards: ResumeEntry[]
  education: ResumeEntry[]
  technicalSkills: string[]
  softSkills: string[]
  professionalExperience: ResumeEntry[]
  projects: ResumeEntry[]
  research: ResumeEntry[]
  publications: ResumeEntry[]
  hackathons: ResumeEntry[]
  certifications: ResumeEntry[]
  leadership: ResumeEntry[]
}

// ─── Default Data ─────────────────────────────────────────────────────────────

const DEFAULT_DATA: ResumeData = {
  ownerName: 'Your Name',
  ownerTitle: 'Software Engineer & Researcher',
  ownerEmail: 'your.email@example.com',
  ownerPhone: '+1 (555) 000-0000',
  ownerLocation: 'City, Country',
  ownerLinkedIn: 'linkedin.com/in/yourprofile',
  ownerGitHub: 'github.com/yourusername',
  ownerInstagram: 'instagram.com/yourhandle',
  ownerAvatar: '',
  professionalSummary:
    'Passionate and driven engineer with expertise in building scalable systems and conducting impactful research. Committed to bridging the gap between theoretical knowledge and practical applications. Seeking opportunities to contribute to innovative teams and meaningful projects.',
  honorsAwards: [
    { id: 'ha1', title: 'Dean\'s List — 4 Consecutive Semesters', subtitle: 'University Name', period: '2021–2024', description: 'Recognized for academic excellence with a GPA above 3.8.' },
    { id: 'ha2', title: 'Best Paper Award', subtitle: 'International Conference on AI', period: '2023', description: 'Awarded for research on adaptive neural architectures.' },
  ],
  education: [
    { id: 'ed1', title: 'B.Sc. Computer Science', subtitle: 'University Name', period: '2020 – 2024', description: 'Major in AI & Machine Learning. Minor in Mathematics.', bullets: ['GPA: 3.92 / 4.00', 'Thesis: Efficient Attention Mechanisms for Long Sequences'] },
  ],
  technicalSkills: ['Python', 'TypeScript', 'React', 'Node.js', 'PyTorch', 'TensorFlow', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Git', 'Linux', 'C++', 'GraphQL', 'Redis'],
  softSkills: ['Leadership', 'Problem Solving', 'Communication', 'Team Collaboration', 'Critical Thinking', 'Adaptability', 'Time Management', 'Mentorship'],
  professionalExperience: [
    { id: 'pe1', title: 'Software Engineering Intern', subtitle: 'Tech Company Inc.', period: 'May 2023 – Aug 2023', description: 'Contributed to the core platform team.', bullets: ['Reduced API response time by 40% through caching layer implementation', 'Built real-time data pipeline processing 50k events/second', 'Collaborated with cross-functional teams across 3 time zones'] },
  ],
  projects: [
    { id: 'pr1', title: 'LinguaFlow — NLP Translation Engine', subtitle: 'Personal Project', period: '2023', description: 'Open-source multilingual translation engine supporting 28 languages.', tags: ['Python', 'Transformers', 'FastAPI', 'React'], link: 'github.com/yourusername/linguaflow' },
    { id: 'pr2', title: 'QuantumSort Visualizer', subtitle: 'Academic Project', period: '2022', description: 'Interactive visualization platform for 15+ sorting and graph algorithms.', tags: ['TypeScript', 'D3.js', 'React'], link: 'github.com/yourusername/quantumsort' },
  ],
  research: [
    { id: 're1', title: 'Adaptive Attention in Transformers', subtitle: 'Advisor: Prof. Jane Smith', period: '2023 – Present', description: 'Investigating dynamic attention head pruning to improve inference efficiency by up to 60% without significant accuracy loss.', bullets: ['Submitted to NeurIPS 2024', 'Implemented custom CUDA kernels for sparse attention'] },
  ],
  publications: [
    { id: 'pu1', title: 'Efficient Long-Range Dependencies via Sparse Attention Patterns', subtitle: 'NeurIPS Workshop 2023', period: '2023', description: 'Authors: Your Name, Collaborator A, Prof. Jane Smith', link: 'arxiv.org/abs/2023.00000' },
  ],
  hackathons: [
    { id: 'hk1', title: '1st Place — HackMIT 2023', subtitle: 'HackMIT', period: 'Oct 2023', description: 'Built an AI-powered accessibility tool for visually impaired developers in 24 hours. Team of 4.', tags: ['OpenAI API', 'React Native', 'Node.js'] },
    { id: 'hk2', title: 'Top 10 Finalist — Google Solution Challenge', subtitle: 'Google', period: 'Mar 2023', description: 'Developed a sustainable agriculture monitoring platform using satellite imagery and ML.', tags: ['TensorFlow', 'GCP', 'Flutter'] },
  ],
  certifications: [
    { id: 'ce1', title: 'AWS Certified Solutions Architect – Associate', subtitle: 'Amazon Web Services', period: 'Jul 2023', imageUrl: '' },
    { id: 'ce2', title: 'Deep Learning Specialization', subtitle: 'Coursera / deeplearning.ai', period: 'Jan 2023', imageUrl: '' },
    { id: 'ce3', title: 'Google Cloud Professional Data Engineer', subtitle: 'Google Cloud', period: 'Nov 2022', imageUrl: '' },
  ],
  leadership: [
    { id: 'le1', title: 'President — Computer Science Society', subtitle: 'University Name', period: '2022 – 2024', description: 'Led a community of 400+ members. Organized 20+ workshops, hackathons, and industry panels.', bullets: ['Doubled membership in one year', 'Secured $15,000 in sponsorships'] },
    { id: 'le2', title: 'Volunteer — Code for Good', subtitle: 'NGO Partner', period: '2021 – Present', description: 'Building free digital tools for non-profit organizations in underserved communities.' },
  ],
}

const OWNER_PASSWORD = 'Chikudi@Cutie<3'
const STORAGE_KEY = 'resume_data_v1'

const uid = () => Math.random().toString(36).slice(2, 9)

// ─── Helper Components ────────────────────────────────────────────────────────

function EditableText({
  value,
  onChange,
  editable,
  className = '',
  tag: Tag = 'span',
  placeholder = 'Click to edit…',
  style,
}: {
  value: string
  onChange: (v: string) => void
  editable: boolean
  className?: string
  tag?: ElementType
  placeholder?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLElement>(null)
  const isFocused = useRef(false)

  useEffect(() => {
    // Never touch the DOM node while the user is actively typing in it —
    // this is what previously caused new keystrokes to stomp on existing text.
    if (ref.current && !isFocused.current && ref.current.textContent !== value) {
      ref.current.textContent = value || ''
    }
  }, [value])

  if (!editable) {
    const Comp = Tag as ElementType
    return <Comp className={className} style={style}>{value}</Comp>
  }

  const Comp = Tag as ElementType
  return (
    <Comp
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
      className={className}
      data-placeholder={placeholder}
      onFocus={() => { isFocused.current = true }}
      // Sync on every keystroke (not just on blur) so React state is always
      // in lockstep with what's on screen — nothing is ever lost or replaced.
      onInput={(e: React.FormEvent<HTMLElement>) => onChange((e.target as HTMLElement).textContent || '')}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        isFocused.current = false
        onChange(e.target.textContent || '')
      }}
      style={{ minWidth: 40, ...style }}
    />
  )
}

function ImageUpload({
  src,
  onUpload,
  editable,
  className = '',
  rounded = false,
}: {
  src: string
  onUpload: (url: string) => void
  editable: boolean
  className?: string
  rounded?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onUpload(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className={`relative group ${className}`}>
      {src ? (
        <img
          src={src}
          alt="uploaded"
          className={`w-full h-full object-cover ${rounded ? 'rounded-full' : 'rounded-lg'}`}
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center text-muted-foreground text-sm ${rounded ? 'rounded-full' : 'rounded-lg'}`}
          style={{ background: 'var(--muted)', minHeight: rounded ? undefined : 80 }}
        >
          {editable ? '+ Image' : ''}
        </div>
      )}
      {editable && (
        <>
          <label
            htmlFor={inputId}
            className="upload-btn absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => inputRef.current?.click()}
          >
            📁 Upload
          </label>
          <input ref={inputRef} id={inputId} type="file" accept="image/*" onChange={handleFile} />
        </>
      )}
    </div>
  )
}

// ─── Section Components ───────────────────────────────────────────────────────

function SectionWrap({ id, title, icon, children }: { id: string; title: string; icon: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <div className="section-heading">
        <span className="text-xl">{icon}</span>
        {title}
      </div>
      {children}
    </section>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl p-5 mb-4 ${className}`}
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {children}
    </div>
  )
}

function EntryCard({
  entry,
  editable,
  onChange,
  onDelete,
  showImage = false,
  showTags = false,
}: {
  entry: ResumeEntry
  editable: boolean
  onChange: (e: ResumeEntry) => void
  onDelete: () => void
  showImage?: boolean
  showTags?: boolean
}) {
  const update = (field: keyof ResumeEntry, val: unknown) => onChange({ ...entry, [field]: val })

  const updateBullet = (i: number, val: string) => {
    const b = [...(entry.bullets || [])]
    b[i] = val
    update('bullets', b)
  }

  const addBullet = () => update('bullets', [...(entry.bullets || []), 'New bullet point'])
  const removeBullet = (i: number) => update('bullets', (entry.bullets || []).filter((_, idx) => idx !== i))

  const updateTag = (i: number, val: string) => {
    const t = [...(entry.tags || [])]
    t[i] = val
    update('tags', t)
  }
  const addTag = () => update('tags', [...(entry.tags || []), 'Tag'])
  const removeTag = (i: number) => update('tags', (entry.tags || []).filter((_, idx) => idx !== i))

  return (
    <Card>
      <div className="flex gap-4">
        {showImage && (
          <div className="shrink-0 w-20 h-20">
            <ImageUpload
              src={entry.imageUrl || ''}
              onUpload={(url) => update('imageUrl', url)}
              editable={editable}
              className="w-20 h-20"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex-1">
              <EditableText
                value={entry.title}
                onChange={(v) => update('title', v)}
                editable={editable}
                tag="h3"
                className="font-semibold text-base"
                style={{ fontFamily: "'Playfair Display', serif" }}
              />
              {(entry.subtitle || editable) && (
                <EditableText
                  value={entry.subtitle || ''}
                  onChange={(v) => update('subtitle', v)}
                  editable={editable}
                  tag="p"
                  className="text-sm mt-0.5"
                  style={{ color: 'var(--muted-foreground)' }}
                  placeholder="Organization / Subtitle"
                />
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {(entry.period || editable) && (
                <EditableText
                  value={entry.period || ''}
                  onChange={(v) => update('period', v)}
                  editable={editable}
                  tag="span"
                  className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
                  placeholder="Period"
                />
              )}
              {editable && (
                <button
                  onClick={onDelete}
                  className="text-xs px-2 py-0.5 rounded transition-colors"
                  style={{ color: '#c0392b', background: 'rgba(192,57,43,0.08)' }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {(entry.description || editable) && (
            <EditableText
              value={entry.description || ''}
              onChange={(v) => update('description', v)}
              editable={editable}
              tag="p"
              className="text-sm mt-2 leading-relaxed"
              placeholder="Description…"
            />
          )}

          {entry.bullets !== undefined && (
            <ul className="mt-2 space-y-1">
              {entry.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
                  <EditableText
                    value={b}
                    onChange={(v) => updateBullet(i, v)}
                    editable={editable}
                    tag="span"
                    className="flex-1"
                  />
                  {editable && (
                    <button onClick={() => removeBullet(i)} className="text-xs shrink-0 opacity-50 hover:opacity-100">✕</button>
                  )}
                </li>
              ))}
              {editable && (
                <li>
                  <button onClick={addBullet} className="text-xs mt-1" style={{ color: 'var(--primary)' }}>+ Add bullet</button>
                </li>
              )}
            </ul>
          )}

          {showTags && (
            <div className="mt-3 flex flex-wrap gap-1">
              {(entry.tags || []).map((tag, i) => (
                <span key={i} className="skill-tag flex items-center gap-1">
                  <EditableText value={tag} onChange={(v) => updateTag(i, v)} editable={editable} tag="span" />
                  {editable && (
                    <button onClick={() => removeTag(i)} className="text-xs opacity-50 hover:opacity-100 leading-none">✕</button>
                  )}
                </span>
              ))}
              {editable && (
                <button onClick={addTag} className="skill-tag cursor-pointer opacity-70 hover:opacity-100">+ Tag</button>
              )}
            </div>
          )}

          {(entry.link || editable) && (
            <div className="mt-2 flex items-center gap-1 text-xs" style={{ color: 'var(--primary)' }}>
              <span>🔗</span>
              <EditableText
                value={entry.link || ''}
                onChange={(v) => update('link', v)}
                editable={editable}
                tag="span"
                placeholder="link"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: 'summary', label: 'Professional Summary', icon: '👤' },
  { id: 'honors', label: 'Honors & Awards', icon: '🏆' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'technical', label: 'Technical Skills', icon: '⚡' },
  { id: 'soft', label: 'Soft Skills', icon: '💡' },
  { id: 'experience', label: 'Professional Experience', icon: '💼' },
  { id: 'projects', label: 'Projects', icon: '🛠' },
  { id: 'research', label: 'Research', icon: '🔬' },
  { id: 'publications', label: 'Publications', icon: '📄' },
  { id: 'hackathons', label: 'Hackathons & Recognitions', icon: '🚀' },
  { id: 'certifications', label: 'Certification & Training', icon: '📜' },
  { id: 'leadership', label: 'Leadership & Community', icon: '🤝' },
]

export default function App() {
  const [dark, setDark] = useState(false)
  const [data, setData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_DATA
    } catch {
      return DEFAULT_DATA
    }
  })
  const [editMode, setEditMode] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('summary')

  // Persist dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // Persist data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  // Active section tracking
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const update = useCallback(<K extends keyof ResumeData>(key: K, val: ResumeData[K]) => {
    setData((d) => ({ ...d, [key]: val }))
  }, [])

  const updateEntry = <K extends keyof ResumeData>(key: K, entries: ResumeEntry[]) => {
    setData((d) => ({ ...d, [key]: entries }))
  }

  const addEntry = (key: keyof ResumeData, withBullets = false, withTags = false) => {
    const newEntry: ResumeEntry = {
      id: uid(),
      title: 'New Entry',
      subtitle: 'Organization',
      period: '2024',
      description: 'Description here.',
      ...(withBullets ? { bullets: ['Add a bullet point'] } : {}),
      ...(withTags ? { tags: ['Tag'] } : {}),
    }
    setData((d) => ({ ...d, [key]: [...(d[key] as ResumeEntry[]), newEntry] }))
  }

  const handleLogin = () => {
    if (pwInput === OWNER_PASSWORD) {
      setEditMode(true)
      setShowLogin(false)
      setPwInput('')
      setPwError(false)
    } else {
      setPwError(true)
    }
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setNavOpen(false)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* ── Top Bar ── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 py-3 gap-3"
        style={{ background: 'color-mix(in srgb, var(--background) 85%, transparent)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}
      >
        <button
          className={`flex flex-col gap-1.5 p-1 rounded-lg transition-colors ${navOpen ? 'ham-open' : ''}`}
          onClick={() => setNavOpen((v) => !v)}
          aria-label="Menu"
          style={{ background: navOpen ? 'var(--muted)' : 'transparent' }}
        >
          <span className="ham-line" />
          <span className="ham-line" />
          <span className="ham-line" />
        </button>

        <div className="flex-1 flex items-center justify-center gap-3">
          <EditableText
            value={data.ownerName}
            onChange={(v) => update('ownerName', v)}
            editable={editMode}
            tag="span"
            className="font-semibold text-base tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          />
          <div className="flex items-center gap-1.5">
            {data.ownerLinkedIn && (
              <a href={data.ownerLinkedIn.startsWith('http') ? data.ownerLinkedIn : `https://${data.ownerLinkedIn}`} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                style={{ background: 'var(--muted)', color: '#0A66C2' }} title="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            )}
            {data.ownerGitHub && (
              <a href={data.ownerGitHub.startsWith('http') ? data.ownerGitHub : `https://${data.ownerGitHub}`} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                style={{ background: 'var(--muted)', color: 'var(--foreground)' }} title="GitHub">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
            )}
            {data.ownerInstagram && (
              <a href={data.ownerInstagram.startsWith('http') ? data.ownerInstagram : `https://${data.ownerInstagram}`} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg transition-colors hover:opacity-80"
                style={{ background: 'var(--muted)', color: '#E1306C' }} title="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {editMode && <span className="edit-badge hidden sm:inline">Editing</span>}

          {/* Theme slider */}
          <div className="flex items-center gap-2">
            <span className="text-sm select-none">☀️</span>
            <label className="theme-slider">
              <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
              <span className="theme-slider-track">
                <span className="theme-slider-thumb">{dark ? '🌙' : '☀️'}</span>
              </span>
            </label>
            <span className="text-sm select-none">🌙</span>
          </div>

          {/* Owner lock */}
          <button
            onClick={() => (editMode ? setEditMode(false) : setShowLogin(true))}
            className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all"
            style={{
              background: editMode ? 'color-mix(in srgb, var(--primary) 15%, transparent)' : 'var(--muted)',
              color: editMode ? 'var(--primary)' : 'var(--muted-foreground)',
              border: `1px solid ${editMode ? 'color-mix(in srgb, var(--primary) 30%, transparent)' : 'var(--border)'}`,
            }}
          >
            {editMode ? '🔓 Done' : '🔒 Edit'}
          </button>
        </div>
      </header>

      {/* ── Hamburger Sidebar ── */}
      <div
        className="fixed inset-0 z-30 pointer-events-none"
        style={{ transition: 'opacity 0.2s' }}
      >
        {/* backdrop */}
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${navOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)' }}
          onClick={() => setNavOpen(false)}
        />
        {/* drawer */}
        <nav
          className="absolute left-0 top-0 h-full w-72 flex flex-col py-16 px-4 pointer-events-auto transition-transform duration-300"
          style={{
            background: 'var(--card)',
            borderRight: '1px solid var(--border)',
            transform: navOpen ? 'translateX(0)' : 'translateX(-100%)',
            boxShadow: navOpen ? '4px 0 24px rgba(0,0,0,0.12)' : 'none',
          }}
        >
          <p className="text-xs font-mono uppercase tracking-widest mb-4 px-3" style={{ color: 'var(--muted-foreground)' }}>
            Navigate
          </p>
          {NAV_SECTIONS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all mb-0.5"
              style={{
                background: activeSection === id ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'transparent',
                color: activeSection === id ? 'var(--primary)' : 'var(--foreground)',
              }}
            >
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Login Modal ── */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm mx-4 rounded-2xl p-8" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Owner Access</h2>
            <p className="text-sm mb-5" style={{ color: 'var(--muted-foreground)' }}>Enter your password to enable editing.</p>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => { setPwInput(e.target.value); setPwError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Password"
              autoFocus
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none mb-3"
              style={{
                background: 'var(--secondary)',
                border: `1.5px solid ${pwError ? '#e74c3c' : 'var(--border)'}`,
                color: 'var(--foreground)',
              }}
            />
            {pwError && <p className="text-xs mb-3" style={{ color: '#e74c3c' }}>Incorrect password. Try again.</p>}
            <div className="flex gap-2">
              <button
                onClick={handleLogin}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                Unlock
              </button>
              <button
                onClick={() => { setShowLogin(false); setPwInput(''); setPwError(false) }}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
              >
                Cancel
              </button>
            </div>
            <p className="text-xs mt-4 text-center" style={{ color: 'var(--muted-foreground)' }}>
              Enter your owner password to unlock editing.
            </p>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="max-w-3xl mx-auto px-4 py-10">

        {/* Hero / Profile */}
        <section className="mb-12 flex flex-col sm:flex-row items-center sm:items-start gap-7">
          <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32">
            <ImageUpload
              src={data.ownerAvatar}
              onUpload={(url) => update('ownerAvatar', url)}
              editable={editMode}
              className="w-28 h-28 sm:w-32 sm:h-32"
              rounded
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <EditableText
              value={data.ownerName}
              onChange={(v) => update('ownerName', v)}
              editable={editMode}
              tag="h1"
              className="text-3xl sm:text-4xl font-bold leading-tight"
            />
            <EditableText
              value={data.ownerTitle}
              onChange={(v) => update('ownerTitle', v)}
              editable={editMode}
              tag="p"
              className="text-base mt-1 mb-3"
              style={{ color: 'var(--primary)' }}
            />
            {/* Contact row */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
              {([
                { icon: '✉️', field: 'ownerEmail' as const, href: (v: string) => `mailto:${v}` },
                { icon: '📍', field: 'ownerLocation' as const, href: null },
                { icon: '📱', field: 'ownerPhone' as const, href: (v: string) => `tel:${v}` },
              ] as { icon: string; field: keyof ResumeData; href: ((v: string) => string) | null }[]).map(({ icon, field, href }) => (
                <span key={field} className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: 'var(--muted)' }}>
                  <span>{icon}</span>
                  {editMode ? (
                    <EditableText
                      value={data[field] as string}
                      onChange={(v) => update(field, v)}
                      editable
                      tag="span"
                      placeholder={field.replace('owner', '').toLowerCase()}
                    />
                  ) : href ? (
                    <a href={href(data[field] as string)} className="hover:underline">{data[field] as string}</a>
                  ) : (
                    <span>{data[field] as string}</span>
                  )}
                </span>
              ))}
            </div>

            {/* Social icons row */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              {/* LinkedIn */}
              <div className="flex items-center gap-2">
                <a href={data.ownerLinkedIn.startsWith('http') ? data.ownerLinkedIn : `https://${data.ownerLinkedIn}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all hover:opacity-80"
                  style={{ background: '#0A66C2', color: '#fff' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  {editMode ? (
                    <EditableText value={data.ownerLinkedIn} onChange={(v) => update('ownerLinkedIn', v)} editable tag="span" placeholder="linkedin.com/in/you" />
                  ) : 'LinkedIn'}
                </a>
              </div>

              {/* GitHub */}
              <div className="flex items-center gap-2">
                <a href={data.ownerGitHub.startsWith('http') ? data.ownerGitHub : `https://${data.ownerGitHub}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all hover:opacity-80"
                  style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  {editMode ? (
                    <EditableText value={data.ownerGitHub} onChange={(v) => update('ownerGitHub', v)} editable tag="span" placeholder="github.com/you" />
                  ) : 'GitHub'}
                </a>
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-2">
                <a href={data.ownerInstagram.startsWith('http') ? data.ownerInstagram : `https://${data.ownerInstagram}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all hover:opacity-80"
                  style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: '#fff' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                  {editMode ? (
                    <EditableText value={data.ownerInstagram} onChange={(v) => update('ownerInstagram', v)} editable tag="span" placeholder="instagram.com/you" />
                  ) : 'Instagram'}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Summary */}
        <SectionWrap id="summary" title="Professional Summary" icon="👤">
          <Card>
            <EditableText
              value={data.professionalSummary}
              onChange={(v) => update('professionalSummary', v)}
              editable={editMode}
              tag="p"
              className="leading-relaxed text-sm"
              placeholder="Write your professional summary…"
            />
          </Card>
        </SectionWrap>

        {/* Honors & Awards */}
        <SectionWrap id="honors" title="Honors & Awards" icon="🏆">
          {data.honorsAwards.map((e) => (
            <EntryCard
              key={e.id}
              entry={e}
              editable={editMode}
              onChange={(upd) => updateEntry('honorsAwards', data.honorsAwards.map((x) => (x.id === upd.id ? upd : x)))}
              onDelete={() => updateEntry('honorsAwards', data.honorsAwards.filter((x) => x.id !== e.id))}
            />
          ))}
          {editMode && <button className="w-full py-2 rounded-xl text-sm font-medium transition-colors" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px dashed var(--border)' }} onClick={() => addEntry('honorsAwards')}>+ Add Award</button>}
        </SectionWrap>

        {/* Education */}
        <SectionWrap id="education" title="Education" icon="🎓">
          {data.education.map((e) => (
            <EntryCard
              key={e.id}
              entry={e}
              editable={editMode}
              onChange={(upd) => updateEntry('education', data.education.map((x) => (x.id === upd.id ? upd : x)))}
              onDelete={() => updateEntry('education', data.education.filter((x) => x.id !== e.id))}
            />
          ))}
          {editMode && <button className="w-full py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px dashed var(--border)' }} onClick={() => addEntry('education', true)}>+ Add Education</button>}
        </SectionWrap>

        {/* Technical Skills */}
        <SectionWrap id="technical" title="Technical Skills" icon="⚡">
          <Card>
            <div className="flex flex-wrap">
              {data.technicalSkills.map((s, i) => (
                <span key={i} className="skill-tag flex items-center gap-1">
                  {editMode ? (
                    <input
                      value={s}
                      onChange={(e) => {
                        const arr = [...data.technicalSkills]
                        arr[i] = e.target.value
                        update('technicalSkills', arr)
                      }}
                      className="outline-none bg-transparent w-20 text-sm"
                      style={{ minWidth: 40, maxWidth: 120 }}
                    />
                  ) : (
                    <span>{s}</span>
                  )}
                  {editMode && (
                    <button
                      onClick={() => update('technicalSkills', data.technicalSkills.filter((_, idx) => idx !== i))}
                      className="text-xs opacity-50 hover:opacity-100"
                    >✕</button>
                  )}
                </span>
              ))}
              {editMode && (
                <button
                  onClick={() => update('technicalSkills', [...data.technicalSkills, 'New Skill'])}
                  className="skill-tag cursor-pointer opacity-70 hover:opacity-100"
                >+ Add</button>
              )}
            </div>
          </Card>
        </SectionWrap>

        {/* Soft Skills */}
        <SectionWrap id="soft" title="Soft Skills" icon="💡">
          <Card>
            <div className="flex flex-wrap">
              {data.softSkills.map((s, i) => (
                <span key={i} className="skill-tag flex items-center gap-1" style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                  {editMode ? (
                    <input
                      value={s}
                      onChange={(e) => {
                        const arr = [...data.softSkills]
                        arr[i] = e.target.value
                        update('softSkills', arr)
                      }}
                      className="outline-none bg-transparent w-24 text-sm"
                      style={{ minWidth: 40, maxWidth: 140 }}
                    />
                  ) : (
                    <span>{s}</span>
                  )}
                  {editMode && (
                    <button
                      onClick={() => update('softSkills', data.softSkills.filter((_, idx) => idx !== i))}
                      className="text-xs opacity-50 hover:opacity-100"
                    >✕</button>
                  )}
                </span>
              ))}
              {editMode && (
                <button
                  onClick={() => update('softSkills', [...data.softSkills, 'New Skill'])}
                  className="skill-tag cursor-pointer opacity-70 hover:opacity-100"
                  style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
                >+ Add</button>
              )}
            </div>
          </Card>
        </SectionWrap>

        {/* Professional Experience */}
        <SectionWrap id="experience" title="Professional Experience" icon="💼">
          {data.professionalExperience.map((e) => (
            <EntryCard
              key={e.id}
              entry={e}
              editable={editMode}
              onChange={(upd) => updateEntry('professionalExperience', data.professionalExperience.map((x) => (x.id === upd.id ? upd : x)))}
              onDelete={() => updateEntry('professionalExperience', data.professionalExperience.filter((x) => x.id !== e.id))}
            />
          ))}
          {editMode && <button className="w-full py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px dashed var(--border)' }} onClick={() => addEntry('professionalExperience', true)}>+ Add Experience</button>}
        </SectionWrap>

        {/* Projects */}
        <SectionWrap id="projects" title="Projects" icon="🛠">
          {data.projects.map((e) => (
            <EntryCard
              key={e.id}
              entry={e}
              editable={editMode}
              onChange={(upd) => updateEntry('projects', data.projects.map((x) => (x.id === upd.id ? upd : x)))}
              onDelete={() => updateEntry('projects', data.projects.filter((x) => x.id !== e.id))}
              showTags
            />
          ))}
          {editMode && <button className="w-full py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px dashed var(--border)' }} onClick={() => addEntry('projects', false, true)}>+ Add Project</button>}
        </SectionWrap>

        {/* Research */}
        <SectionWrap id="research" title="Research" icon="🔬">
          {data.research.map((e) => (
            <EntryCard
              key={e.id}
              entry={e}
              editable={editMode}
              onChange={(upd) => updateEntry('research', data.research.map((x) => (x.id === upd.id ? upd : x)))}
              onDelete={() => updateEntry('research', data.research.filter((x) => x.id !== e.id))}
            />
          ))}
          {editMode && <button className="w-full py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px dashed var(--border)' }} onClick={() => addEntry('research', true)}>+ Add Research</button>}
        </SectionWrap>

        {/* Publications */}
        <SectionWrap id="publications" title="Publications" icon="📄">
          {data.publications.map((e) => (
            <EntryCard
              key={e.id}
              entry={e}
              editable={editMode}
              onChange={(upd) => updateEntry('publications', data.publications.map((x) => (x.id === upd.id ? upd : x)))}
              onDelete={() => updateEntry('publications', data.publications.filter((x) => x.id !== e.id))}
            />
          ))}
          {editMode && <button className="w-full py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px dashed var(--border)' }} onClick={() => addEntry('publications')}>+ Add Publication</button>}
        </SectionWrap>

        {/* Hackathons */}
        <SectionWrap id="hackathons" title="Hackathons & Recognitions" icon="🚀">
          {data.hackathons.map((e) => (
            <EntryCard
              key={e.id}
              entry={e}
              editable={editMode}
              onChange={(upd) => updateEntry('hackathons', data.hackathons.map((x) => (x.id === upd.id ? upd : x)))}
              onDelete={() => updateEntry('hackathons', data.hackathons.filter((x) => x.id !== e.id))}
              showTags
            />
          ))}
          {editMode && <button className="w-full py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px dashed var(--border)' }} onClick={() => addEntry('hackathons', false, true)}>+ Add Hackathon</button>}
        </SectionWrap>

        {/* Certifications */}
        <SectionWrap id="certifications" title="Certification & Training" icon="📜">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.certifications.map((e) => (
              <Card key={e.id} className="!mb-0">
                <div className="flex gap-3">
                  <div className="shrink-0 w-14 h-14">
                    <ImageUpload
                      src={e.imageUrl || ''}
                      onUpload={(url) => updateEntry('certifications', data.certifications.map((x) => x.id === e.id ? { ...x, imageUrl: url } : x))}
                      editable={editMode}
                      className="w-14 h-14"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <EditableText
                        value={e.title}
                        onChange={(v) => updateEntry('certifications', data.certifications.map((x) => x.id === e.id ? { ...x, title: v } : x))}
                        editable={editMode}
                        tag="p"
                        className="text-sm font-semibold leading-snug"
                      />
                      {editMode && (
                        <button onClick={() => updateEntry('certifications', data.certifications.filter((x) => x.id !== e.id))} className="text-xs shrink-0 opacity-50 hover:opacity-100 ml-1">✕</button>
                      )}
                    </div>
                    <EditableText
                      value={e.subtitle || ''}
                      onChange={(v) => updateEntry('certifications', data.certifications.map((x) => x.id === e.id ? { ...x, subtitle: v } : x))}
                      editable={editMode}
                      tag="p"
                      className="text-xs mt-0.5"
                      style={{ color: 'var(--muted-foreground)' }}
                    />
                    <EditableText
                      value={e.period || ''}
                      onChange={(v) => updateEntry('certifications', data.certifications.map((x) => x.id === e.id ? { ...x, period: v } : x))}
                      editable={editMode}
                      tag="span"
                      className="text-xs mt-1 inline-block font-mono px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {editMode && (
            <button
              className="w-full mt-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px dashed var(--border)' }}
              onClick={() => {
                const newCert: ResumeEntry = { id: uid(), title: 'Certificate Name', subtitle: 'Issuing Organization', period: '2024', imageUrl: '' }
                setData((d) => ({ ...d, certifications: [...d.certifications, newCert] }))
              }}
            >
              + Add Certificate
            </button>
          )}
        </SectionWrap>

        {/* Leadership */}
        <SectionWrap id="leadership" title="Leadership & Community Involvement" icon="🤝">
          {data.leadership.map((e) => (
            <EntryCard
              key={e.id}
              entry={e}
              editable={editMode}
              onChange={(upd) => updateEntry('leadership', data.leadership.map((x) => (x.id === upd.id ? upd : x)))}
              onDelete={() => updateEntry('leadership', data.leadership.filter((x) => x.id !== e.id))}
            />
          ))}
          {editMode && <button className="w-full py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px dashed var(--border)' }} onClick={() => addEntry('leadership', true)}>+ Add Leadership Role</button>}
        </SectionWrap>

        {editMode && (
          <p className="mt-10 pb-10 text-center text-xs" style={{ color: 'var(--primary)' }}>
            ✏️ Edit mode active — all changes save automatically to your browser.
          </p>
        )}
      </main>
    </div>
  )
}
