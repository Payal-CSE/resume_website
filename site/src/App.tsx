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

interface TestimonialEntry {
  id: string
  quote: string
  name: string
  role: string
  avatar?: string
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
  heroPhoto: string
  heroTaglines: string[]
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
  testimonials: TestimonialEntry[]
}

// ─── Default Data ─────────────────────────────────────────────────────────────

const DEFAULT_DATA: ResumeData = {
  ownerName: 'Payal Kadam',
  ownerTitle: 'Aspiring Graduate Researcher — AI & Data Science',
  ownerEmail: 'payalkadam917@gmail.com',
  ownerPhone: '+91 91725 67849',
  ownerLocation: 'Pune, Maharashtra, India',
  ownerLinkedIn: 'https://www.linkedin.com/in/payalkadam917/',
  ownerGitHub: 'https://github.com/Payal-CSE',
  ownerInstagram: '',
  ownerAvatar: '',
  heroPhoto: '',
  heroTaglines: ['a Winner.', 'an Innovator.', 'an Engineer.', 'a Researcher.', 'a Problem-Solver.'],
  professionalSummary:
    'Final-year B.E. student in Artificial Intelligence & Data Science (CGPA 8.9/10) with hands-on research experience in explainable machine learning, including a first-authored paper on SHAP-based diabetes prediction currently under review and a patent-pending VR-based electronics learning platform. Combines academic research with applied experience across cybersecurity, web development, and multiple award-winning AI/ML projects spanning healthcare, public welfare, and safety automation. Demonstrated technical leadership organizing AI initiatives for 150+ students and mentoring 100+ project teams. Seeking to pursue graduate study in Computer Science with a research focus on Explainable AI, Machine Learning, and AI for Social Good.',
  honorsAwards: [
    { id: 'ha1', title: 'Top 5 of 600+ Teams', subtitle: 'National-Level Competition, Sinhgad Institute of Technology (Team "Single Core")', period: '' },
    { id: 'ha2', title: '2nd Place — Technical Competition Mindstorm', subtitle: 'IEEE Computational Intelligence Society', period: '' },
    { id: 'ha3', title: 'Best Intern', subtitle: 'The Tech Protein — Cybersecurity Internship', period: '' },
    { id: 'ha4', title: 'Top 15 of 10,000+ Teams', subtitle: 'INNOVIO, MIT World Peace University — Government Scheme Personalizer', period: '' },
    { id: 'ha5', title: '2nd Prize — Best Website Development', subtitle: 'St. Vincent\u2019s High School & Junior College', period: '2023' },
    { id: 'ha6', title: '1st Prize — Republic Day Parade', subtitle: 'Mount Carmel Convent High School', period: '2021' },
  ],
  education: [
    { id: 'ed1', title: 'B.E. in Artificial Intelligence & Data Science', subtitle: 'Marathwada Mitra Mandal\u2019s College of Engineering (MMCOE), Savitribai Phule Pune University', period: 'Expected Graduation: 2027', description: 'CGPA: 8.9 / 10.0' },
    { id: 'ed2', title: 'Higher Secondary Education (Science)', subtitle: 'St. Vincent\u2019s High School & Junior College, Pune', period: '2023', description: 'Class XII: 80.83%', bullets: ['2nd Prize — Best Website Development', 'Student Assistant, Physics Department'] },
    { id: 'ed3', title: 'Primary & Secondary Education (Kindergarten \u2013 Grade 10)', subtitle: 'Mount Carmel Convent High School, Pune', period: '2021', description: 'Class X: 89.40%', bullets: ['Captain, Road Safety Patrol', 'Eco Club Member', '1st Prize — Republic Day Parade'] },
  ],
  technicalSkills: ['Python', 'C', 'C++', 'SQL', 'JavaScript', 'HTML', 'CSS', 'Flask', 'React', 'Tailwind CSS', 'Node.js', 'Firebase', 'MongoDB', 'Git', 'GitHub', 'Jupyter Notebook', 'Vercel'],
  softSkills: ['Leadership', 'Mentorship', 'Public Speaking', 'Team Collaboration', 'Problem Solving', 'Ethics-Driven Innovation', 'Event Organization', 'Community Engagement'],
  professionalExperience: [
    { id: 'pe1', title: 'Cybersecurity Intern', subtitle: 'The Tech Protein', period: 'Recognition: Best Intern', description: '', bullets: ['Conducted cybersecurity reconnaissance and information-gathering using WHOIS, Dirb, Google Dorks, Wireshark, Shodan, SSL Header Check, and Qualys SSL Labs.', 'Performed domain, network, service, and security-configuration analysis as part of practical security assessment workflows.'] },
    { id: 'pe2', title: 'Junior Web Developer Intern', subtitle: 'Fusemarket', period: '', description: '', bullets: ['Contributed to front-end development tasks, gaining hands-on experience in debugging and collaborative development workflows.'] },
  ],
  projects: [
    { id: 'pr1', title: 'AI-Based Fire Detection & Victim Rescue System', subtitle: '2nd Place — [Competition Name]', period: '', description: 'Designed an AI/IoT-based emergency-response concept to detect fire and smoke and distinguish them from gas leaks. Developed approaches for identifying and assisting victims in smoke-filled environments using sensor-based detection.', tags: ['AI', 'IoT', 'Sensors'] },
    { id: 'pr2', title: 'Government Scheme Personalizer', subtitle: 'Top 15 of 10,000+ teams — INNOVIO, MIT World Peace University', period: '', description: 'Built a personalization engine to help users identify government schemes relevant to their individual circumstances, focused on accessibility and public welfare.', tags: ['AI', 'Personalization', 'Public Welfare'] },
    { id: 'pr3', title: 'Laser-Based Intrusion Detection System', subtitle: '', period: '', description: 'Engineered a laser-beam detection boundary integrated with electronic components to automatically flag unauthorized entry into a monitored area.', tags: ['Electronics', 'Security Automation'] },
    { id: 'pr4', title: 'Stock Market Prediction System', subtitle: '', period: '', description: 'Applied machine learning to financial time-series data, covering preprocessing, feature preparation, and predictive modeling.', tags: ['Machine Learning', 'Time-Series'] },
  ],
  research: [
    { id: 're1', title: 'Explainable Machine Learning Framework for Early-Stage Diabetes Prediction', subtitle: 'Independent Research', period: 'Status: Under Review', description: 'Paper: "An Explainable Machine Learning Framework for Early-Stage Diabetes Prediction Using Random Forest and SHAP-Based Clinical Feature Analysis"', bullets: ['Built an end-to-end ML framework for early-stage diabetes prediction using clinical and symptom-based features, including preprocessing and feature engineering.', 'Implemented and benchmarked Logistic Regression, Decision Tree, and Random Forest classifiers; deployed Random Forest as the final prediction model.', 'Applied SHAP (SHapley Additive exPlanations) to quantify feature-level contributions, improving model interpretability for clinical use.', 'Built a Flask web application for interactive, real-time prediction; research grounded in Explainable AI, Healthcare AI, and Responsible AI.'] },
    { id: 're2', title: 'VR-Based AI-Assisted Electronics Learning Platform', subtitle: 'Patent Application in Progress', period: 'Filing expected within one week', description: '', bullets: ['Designed a VR platform enabling students to virtually assemble and experiment with electronic circuits without physical components.', 'Integrated AI-assisted explanations to reinforce conceptual understanding, combining AI, VR, and educational technology.'] },
  ],
  publications: [],
  hackathons: [],
  certifications: [
    { id: 'ce1', title: 'AI/ML for Geo Data Analysis', subtitle: 'Indian Space Research Organisation (ISRO)', period: '', imageUrl: '' },
    { id: 'ce2', title: 'Mastering Data Science and Algorithms using C & C++', subtitle: 'Udemy', period: '', imageUrl: '' },
    { id: 'ce3', title: 'Basics of Python', subtitle: 'edX', period: '', imageUrl: '' },
    { id: 'ce4', title: 'NSS Certificate', subtitle: 'National Service Scheme — ~2 years of community service', period: '', imageUrl: '' },
  ],
  leadership: [
    { id: 'le1', title: 'Technical Head', subtitle: 'College AI / Technical Club', period: '', description: 'Led AI-focused initiatives engaging 150+ members; mentored 50+ junior student projects; organized 3+ public events on AI for social good.' },
    { id: 'le2', title: 'Organizer', subtitle: 'Dexterity — National-Level Technical Event', period: '', description: 'Designed and led an AI + Data Structures & Algorithms-based Escape Room engaging 300+ participants in applied, experiential learning.' },
    { id: 'le3', title: 'Design Thinking & Innovation Mentor', subtitle: '', period: '', description: 'Mentored 100+ student teams building AI-based solutions for social challenges, guiding problem formulation and ethics-driven, responsible innovation.' },
    { id: 'le4', title: 'National Service Scheme (NSS)', subtitle: '~2 years of community service', period: '', description: 'Participated in women\u2019s safety awareness drives, blood donation drives, village development camps, and digital-literacy initiatives in rural communities.' },
    { id: 'le5', title: 'Captain, Road Safety Patrol & Eco Club Member', subtitle: 'Mount Carmel Convent High School', period: '', description: 'Promoted road-safety awareness and civic responsibility as Patrol Captain; supported tree-plantation and cleanliness drives through the Eco Club.' },
  ],
  testimonials: [
    { id: 'te1', quote: 'Click edit and replace this with a quote from a professor, mentor, or manager who can speak to your work.', name: 'Add Name', role: 'Add Title / Relationship', avatar: '' },
    { id: 'te2', quote: 'Click edit and replace this with a second testimonial — from an internship supervisor, club advisor, or research collaborator.', name: 'Add Name', role: 'Add Title / Relationship', avatar: '' },
  ],
}

const OWNER_PASSWORD = import.meta.env.VITE_OWNER_PASSWORD || 'Chikudi@Cutie<3'
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
  }, [value, editable])

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

  const hasOwnPosition = /\b(absolute|fixed|sticky)\b/.test(className)

  const visual = src ? (
    <img
      src={src}
      alt="uploaded"
      className={`w-full h-full object-cover ${rounded ? 'rounded-full' : 'rounded-lg'}`}
    />
  ) : (
    <div
      className={`w-full h-full flex items-center justify-center text-muted-foreground text-sm image-upload-placeholder ${rounded ? 'rounded-full' : 'rounded-lg'}`}
      style={{ minHeight: rounded ? undefined : 80 }}
    >
      {editable ? '+ Image' : ''}
    </div>
  )

  return (
    <div className={`group ${hasOwnPosition ? '' : 'relative'} ${className}`}>
      {editable ? (
        <label htmlFor={inputId} className="block w-full h-full cursor-pointer" title="Click to upload an image">
          {visual}
        </label>
      ) : (
        visual
      )}
      {editable && (
        <>
          <div className="upload-btn absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            📁 Upload
          </div>
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

// ─── Typewriter effect ─────────────────────────────────────────────────────────

function TypewriterText({ phrases, className, style }: { phrases: string[]; className?: string; style?: React.CSSProperties }) {
  const [text, setText] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const safe = phrases.length > 0 ? phrases : ['Something Great.']
    const current = safe[phraseIdx % safe.length]
    let delay = deleting ? 40 : 70
    if (!deleting && text === current) delay = 1400 // pause at full phrase
    if (deleting && text === '') delay = 300 // pause before next phrase

    const t = setTimeout(() => {
      if (!deleting) {
        if (text === current) {
          setDeleting(true)
        } else {
          setText(current.slice(0, text.length + 1))
        }
      } else {
        if (text === '') {
          setDeleting(false)
          setPhraseIdx((i) => (i + 1) % safe.length)
        } else {
          setText(text.slice(0, -1))
        }
      }
    }, delay)
    return () => clearTimeout(t)
  }, [text, deleting, phraseIdx, phrases])

  return (
    <span className={className} style={style}>
      {text}
      <span className="typewriter-cursor">|</span>
    </span>
  )
}

// ─── Sidebar (profile + nav) ──────────────────────────────────────────────────

function SidebarContent({
  data, update, editMode, dark, setDark, onToggleEdit, activeSection, onNavigate,
}: {
  data: ResumeData
  update: <K extends keyof ResumeData>(key: K, val: ResumeData[K]) => void
  editMode: boolean
  dark: boolean
  setDark: (v: boolean) => void
  onToggleEdit: () => void
  activeSection: string
  onNavigate: (id: string) => void
}) {
  const socials = [
    { key: 'ownerLinkedIn' as const, label: 'LinkedIn', color: '#0A66C2', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
    { key: 'ownerGitHub' as const, label: 'GitHub', color: '#e5e7eb', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg> },
    { key: 'ownerInstagram' as const, label: 'Instagram', color: '#e1306c', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg> },
  ]

  const contactRows = [
    { icon: '✉️', field: 'ownerEmail' as const, href: (v: string) => `mailto:${v}` },
    { icon: '📍', field: 'ownerLocation' as const, href: null },
    { icon: '📱', field: 'ownerPhone' as const, href: (v: string) => `tel:${v}` },
  ]

  return (
    <div className="flex flex-col h-full px-6 py-8 sidebar-scroll overflow-y-auto">
      <div className="flex flex-col items-center text-center">
        <div className="w-28 h-28 mb-4">
          <ImageUpload
            src={data.ownerAvatar}
            onUpload={(url) => update('ownerAvatar', url)}
            editable={editMode}
            className="w-28 h-28 sidebar-avatar"
            rounded
          />
        </div>
        <EditableText
          value={data.ownerName}
          onChange={(v) => update('ownerName', v)}
          editable={editMode}
          tag="h1"
          className="text-lg font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: '#fff' }}
        />
        <EditableText
          value={data.ownerTitle}
          onChange={(v) => update('ownerTitle', v)}
          editable={editMode}
          tag="p"
          className="text-xs mt-1 sidebar-accent-text font-medium tracking-wide"
        />
      </div>

      <div className="w-full h-px my-6" style={{ background: 'rgba(255,255,255,0.1)' }} />

      <div className="flex flex-col gap-2.5 text-xs">
        {contactRows.map(({ icon, field, href }) => (
          <div key={field} className="flex items-center gap-2.5 sidebar-muted-text">
            <span className="shrink-0">{icon}</span>
            {editMode ? (
              <EditableText
                value={data[field] as string}
                onChange={(v) => update(field, v)}
                editable
                tag="span"
                className="flex-1 min-w-0 break-words"
                placeholder={field.replace('owner', '').toLowerCase()}
              />
            ) : href ? (
              <a href={href(data[field] as string)} className="hover:underline break-all">{data[field] as string}</a>
            ) : (
              <span className="break-words">{data[field] as string}</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-5">
        {socials.filter(({ key }) => editMode || data[key]).map(({ key, icon, color }) => (
          <a
            key={key}
            href={(data[key] as string).startsWith('http') ? (data[key] as string) : `https://${data[key] as string}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-social-btn"
            style={{ color }}
            title={key}
          >
            {icon}
          </a>
        ))}
      </div>

      {editMode && (
        <div className="mt-3 flex flex-col gap-1 text-xs sidebar-muted-text">
          {socials.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="shrink-0 opacity-60">{label}:</span>
              <EditableText value={data[key] as string} onChange={(v) => update(key, v)} editable tag="span" className="flex-1 min-w-0 break-all" />
            </div>
          ))}
        </div>
      )}

      <div className="w-full h-px my-6" style={{ background: 'rgba(255,255,255,0.1)' }} />

      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_SECTIONS.filter(({ id }) => {
          const key = OPTIONAL_SECTION_KEYS[id]
          if (!key) return true
          return editMode || (data[key] as unknown[]).length > 0
        }).map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`sidebar-nav-link ${activeSection === id ? 'sidebar-nav-active' : ''}`}
          >
            <span className="text-sm w-5 text-center shrink-0">{icon}</span>
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>

      <div className="w-full h-px my-5" style={{ background: 'rgba(255,255,255,0.1)' }} />

      <div className="flex items-center justify-between gap-2">
        <label className="theme-slider">
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
          <span className="theme-slider-track">
            <span className="theme-slider-thumb">{dark ? '🌙' : '☀️'}</span>
          </span>
        </label>
        <button
          onClick={onToggleEdit}
          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
          style={{
            background: editMode ? 'var(--sidebar-accent)' : 'rgba(255,255,255,0.08)',
            color: editMode ? '#0d1420' : '#e5e7eb',
          }}
        >
          {editMode ? '🔓 Done' : '🔒 Edit'}
        </button>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: 'home', label: 'Home', icon: '🏠' },
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
  { id: 'testimonials', label: 'Testimonials', icon: '💬' },
]

// Section ids whose nav link + section should hide for visitors when the underlying list is empty
const OPTIONAL_SECTION_KEYS: Partial<Record<string, keyof ResumeData>> = {
  publications: 'publications',
  hackathons: 'hackathons',
  testimonials: 'testimonials',
}

export default function App() {
  const [dark, setDark] = useState(false)
  const [data, setData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...DEFAULT_DATA, ...JSON.parse(saved) } : DEFAULT_DATA
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

  // Keep the browser tab title in sync with the resume name
  useEffect(() => {
    document.title = data.ownerName && data.ownerName !== 'Your Name'
      ? `${data.ownerName} — Resume`
      : 'Resume'
  }, [data.ownerName])

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
    <div className="min-h-screen lg:flex" style={{ background: 'var(--background)' }}>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[290px] sidebar-panel">
        <SidebarContent
          data={data}
          update={update}
          editMode={editMode}
          dark={dark}
          setDark={setDark}
          onToggleEdit={() => (editMode ? setEditMode(false) : setShowLogin(true))}
          activeSection={activeSection}
          onNavigate={scrollTo}
        />
      </aside>

      {/* ── Mobile Top Bar ── */}
      <header
        className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 gap-3"
        style={{ background: 'color-mix(in srgb, var(--background) 85%, transparent)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}
      >
        <button
          className={`flex flex-col gap-1.5 p-1 rounded-lg transition-colors ${navOpen ? 'ham-open' : ''}`}
          onClick={() => setNavOpen((v) => !v)}
          aria-label="Menu"
          style={{ background: navOpen ? 'var(--muted)' : 'transparent' }}
        >
          <span className="ham-line" style={{ background: dark ? '#ffffff' : '#1b2230' }} />
          <span className="ham-line" style={{ background: dark ? '#ffffff' : '#1b2230' }} />
          <span className="ham-line" style={{ background: dark ? '#ffffff' : '#1b2230' }} />
        </button>
        <EditableText
          value={data.ownerName}
          onChange={(v) => update('ownerName', v)}
          editable={editMode}
          tag="span"
          className="font-semibold text-base tracking-tight flex-1 text-center"
          style={{ fontFamily: "'Playfair Display', serif" }}
        />
        <div className="flex items-center gap-2 shrink-0">
          <label className="theme-slider" style={{ transform: 'scale(0.85)' }}>
            <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
            <span className="theme-slider-track">
              <span className="theme-slider-thumb">{dark ? '🌙' : '☀️'}</span>
            </span>
          </label>
          <button
            onClick={() => (editMode ? setEditMode(false) : setShowLogin(true))}
            className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all"
            style={{
              background: editMode ? 'color-mix(in srgb, var(--primary) 15%, transparent)' : 'var(--muted)',
              color: editMode ? 'var(--primary)' : 'var(--muted-foreground)',
            }}
          >
            {editMode ? '🔓' : '🔒'}
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer (same content as desktop sidebar) ── */}
      <div className="lg:hidden fixed inset-0 z-30 pointer-events-none" style={{ transition: 'opacity 0.2s' }}>
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${navOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}
          onClick={() => setNavOpen(false)}
        />
        <nav
          className="absolute left-0 top-0 h-full w-[290px] pointer-events-auto transition-transform duration-300 sidebar-panel"
          style={{
            transform: navOpen ? 'translateX(0)' : 'translateX(-100%)',
            boxShadow: navOpen ? '4px 0 24px rgba(0,0,0,0.25)' : 'none',
          }}
        >
          <SidebarContent
            data={data}
            update={update}
            editMode={editMode}
            dark={dark}
            setDark={setDark}
            onToggleEdit={() => (editMode ? setEditMode(false) : setShowLogin(true))}
            activeSection={activeSection}
            onNavigate={scrollTo}
          />
        </nav>
      </div>

      {/* ── Desktop Top-Right Controls ── */}
      <div className="hidden lg:flex fixed top-4 right-6 z-40 items-center gap-2.5 px-3 py-2 rounded-full desktop-topbar-controls">
        <label className="theme-slider" style={{ transform: 'scale(0.85)' }}>
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
          <span className="theme-slider-track">
            <span className="theme-slider-thumb">{dark ? '🌙' : '☀️'}</span>
          </span>
        </label>
        <button
          onClick={() => (editMode ? setEditMode(false) : setShowLogin(true))}
          className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
          style={{
            background: editMode ? 'color-mix(in srgb, var(--primary) 15%, transparent)' : 'var(--muted)',
            color: editMode ? 'var(--primary)' : 'var(--muted-foreground)',
          }}
        >
          {editMode ? '🔓 Done' : '🔒 Edit'}
        </button>
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
      <main className="flex-1 lg:ml-[290px] w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10">


        {/* Hero */}
        <section id="home" className="scroll-mt-20 mb-14">
          <div className="relative w-full hero-banner rounded-md overflow-hidden">
            <ImageUpload
              src={data.heroPhoto}
              onUpload={(url) => update('heroPhoto', url)}
              editable={editMode}
              className="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 hero-banner-scrim" />
            <div className="relative z-10 flex flex-col justify-end h-full px-6 sm:px-10 py-8 pointer-events-none">
              <p className="text-xs font-medium mb-2 tracking-[0.15em] uppercase" style={{ color: 'var(--hero-eyebrow)' }}>Hi, my name is</p>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-2 hero-name" style={{ fontFamily: "'Playfair Display', serif" }}>
                {data.ownerName}.
              </h2>
              <h3 className="text-lg sm:text-xl font-medium leading-snug hero-role">
                I&rsquo;m{' '}
                <TypewriterText
                  phrases={data.heroTaglines}
                  className="font-semibold hero-role-accent"
                />
              </h3>
            </div>
          </div>
          {editMode && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs self-center mr-1" style={{ color: 'var(--muted-foreground)' }}>Phrases:</span>
              {data.heroTaglines.map((s, i) => (
                <span key={i} className="skill-tag flex items-center gap-1">
                  <input
                    value={s}
                    onChange={(e) => {
                      const arr = [...data.heroTaglines]
                      arr[i] = e.target.value
                      update('heroTaglines', arr)
                    }}
                    className="outline-none bg-transparent text-sm"
                    style={{ minWidth: 60, maxWidth: 180 }}
                  />
                  <button
                    onClick={() => update('heroTaglines', data.heroTaglines.filter((_, idx) => idx !== i))}
                    className="text-xs opacity-50 hover:opacity-100"
                  >✕</button>
                </span>
              ))}
              <button
                onClick={() => update('heroTaglines', [...data.heroTaglines, 'a New Thing.'])}
                className="skill-tag cursor-pointer opacity-70 hover:opacity-100"
              >+ Add phrase</button>
            </div>
          )}
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
        {(editMode || data.publications.length > 0) && (
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
        )}

        {/* Hackathons */}
        {(editMode || data.hackathons.length > 0) && (
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
        )}

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

        {/* Testimonials */}
        {(editMode || data.testimonials.length > 0) && (
        <SectionWrap id="testimonials" title="Testimonials" icon="💬">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.testimonials.map((t) => (
              <Card key={t.id} className="!mb-0 relative">
                <div className="flex items-center gap-3 mb-3">
                  <ImageUpload
                    src={t.avatar || ''}
                    onUpload={(url) => update('testimonials', data.testimonials.map((x) => (x.id === t.id ? { ...x, avatar: url } : x)))}
                    editable={editMode}
                    className="w-11 h-11 shrink-0"
                    rounded
                  />
                  <div className="min-w-0">
                    <EditableText
                      value={t.name}
                      onChange={(v) => update('testimonials', data.testimonials.map((x) => (x.id === t.id ? { ...x, name: v } : x)))}
                      editable={editMode}
                      tag="p"
                      className="font-semibold text-sm truncate"
                    />
                    <EditableText
                      value={t.role}
                      onChange={(v) => update('testimonials', data.testimonials.map((x) => (x.id === t.id ? { ...x, role: v } : x)))}
                      editable={editMode}
                      tag="p"
                      className="text-xs truncate"
                      style={{ color: 'var(--muted-foreground)' }}
                    />
                  </div>
                </div>
                <EditableText
                  value={t.quote}
                  onChange={(v) => update('testimonials', data.testimonials.map((x) => (x.id === t.id ? { ...x, quote: v } : x)))}
                  editable={editMode}
                  tag="p"
                  className="text-sm italic leading-relaxed"
                  style={{ color: 'var(--foreground)' }}
                />
                {editMode && (
                  <button
                    onClick={() => update('testimonials', data.testimonials.filter((x) => x.id !== t.id))}
                    className="absolute top-3 right-3 text-xs opacity-50 hover:opacity-100"
                    title="Delete testimonial"
                  >
                    ✕
                  </button>
                )}
              </Card>
            ))}
          </div>
          {editMode && (
            <button
              className="w-full py-2 mt-4 rounded-xl text-sm font-medium"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px dashed var(--border)' }}
              onClick={() => update('testimonials', [...data.testimonials, { id: uid(), quote: 'Add a testimonial quote here.', name: 'Add Name', role: 'Add Title / Relationship', avatar: '' }])}
            >
              + Add Testimonial
            </button>
          )}
        </SectionWrap>
        )}

        {editMode && (
          <p className="mt-10 pb-10 text-center text-xs" style={{ color: 'var(--primary)' }}>
            ✏️ Edit mode active — all changes save automatically to your browser.
          </p>
        )}
      </main>
    </div>
  )
}
