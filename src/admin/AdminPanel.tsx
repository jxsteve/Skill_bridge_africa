/**
 * SkillBridge Admin Panel — desktop. Built to the Figma "Admin Low-Fi
 * Wireframes": Dashboard, Student Verification (+ detail), Escrow Monitoring
 * (+ detail), Ratings & Reviews, and a login gate. Reads/writes real Supabase
 * data. Amounts are the platform token, shown as $ (wireframe ₦ was placeholder).
 */
import { useCallback, useEffect, useState } from 'react';

import { HomeIcon, ShieldCheckIcon, StarIcon, WalletIcon } from '../components/ui';
import logoMark from '../assets/images/logo_mark.png';
import { isSupabaseConfigured } from '../lib/supabase';
import { projects as projectsRepo } from '../data/repo';
import {
  computeOverview,
  listEscrows,
  listReviews,
  listVerifications,
  setEscrowPayment,
  setReviewStatus,
  setVerification,
  type EscrowRow,
  type ReviewRow,
  type VerificationRow,
} from '../data/admin';
import s from './admin.module.css';

type Screen = 'dashboard' | 'verification' | 'escrow' | 'ratings';

type Props = {
  isAdmin: boolean;
  email: string;
  name: string;
  onExit: () => void;
  onGoToLogin: () => void;
};

// ---- helpers --------------------------------------------------------------

const initials = (name?: string, fallback = '?') =>
  (name || '').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || fallback;

const money = (n: number) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function ago(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const mins = Math.max(0, Math.round((now - then) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

const verifDisplay = (v: VerificationRow['verification']) =>
  v === 'verified' ? 'verified' : v === 'rejected' ? 'rejected' : 'pending';

function VerifPill({ v }: { v: VerificationRow['verification'] }) {
  const d = verifDisplay(v);
  const cls = d === 'verified' ? s.pillVerified : d === 'rejected' ? s.pillRejected : s.pillPending;
  return <span className={`${s.pill} ${cls}`}>{d === 'verified' ? 'Verified' : d === 'rejected' ? 'Rejected' : 'Pending'}</span>;
}

function EscrowPill({ p }: { p: EscrowRow }) {
  if (p.payment_status === 'released') return <span className={`${s.pill} ${s.pillReleased}`}>Released</span>;
  if (p.payment_status === 'refunded') return <span className={`${s.pill} ${s.pillNeutral}`}>Refunded</span>;
  if (p.status === 'cancelled') return <span className={`${s.pill} ${s.pillDisputed}`}>Disputed</span>;
  if (p.status === 'under_review' || p.status === 'submitted')
    return <span className={`${s.pill} ${s.pillReview}`}>Awaiting approval</span>;
  return <span className={`${s.pill} ${s.pillFunded}`}>Funded</span>;
}

function Stars({ n }: { n: number }) {
  return <span className={s.stars}>{'★'.repeat(n)}{'☆'.repeat(Math.max(0, 5 - n))}</span>;
}

// ---- root -----------------------------------------------------------------

export default function AdminPanel({ isAdmin, email, name, onExit, onGoToLogin }: Props) {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<VerificationRow | null>(null);
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowRow | null>(null);

  const [verifs, setVerifs] = useState<VerificationRow[]>([]);
  const [escrows, setEscrows] = useState<EscrowRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [v, e, r] = await Promise.all([listVerifications(), listEscrows(), listReviews()]);
      setVerifs(v);
      setEscrows(e);
      setReviews(r);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) void reload();
  }, [isAdmin, reload]);

  if (!isAdmin) {
    return <AdminLogin email={email} onGoToLogin={onGoToLogin} onExit={onExit} />;
  }

  const overview = computeOverview(verifs, escrows);

  const nav: { key: Screen; label: string; Icon: typeof HomeIcon }[] = [
    { key: 'dashboard', label: 'Dashboard', Icon: HomeIcon },
    { key: 'verification', label: 'Student Verification', Icon: ShieldCheckIcon },
    { key: 'escrow', label: 'Escrow Monitoring', Icon: WalletIcon },
    { key: 'ratings', label: 'Ratings & Reviews', Icon: StarIcon },
  ];

  return (
    <div className={s.shell}>
      <aside className={s.sidebar}>
        <div className={s.brand}>
          <img src={logoMark} className={s.brandMark} alt="" />
          <span className={s.brandText}>Skill<span style={{ color: 'var(--brand-green)' }}>Bridge</span></span>
        </div>
        <nav className={s.nav}>
          {nav.map((n) => {
            const active = screen === n.key && !selectedStudent && !selectedEscrow;
            return (
              <button
                key={n.key}
                className={`${s.navItem} ${active ? s.navItemActive : ''}`}
                onClick={() => {
                  setScreen(n.key);
                  setSelectedStudent(null);
                  setSelectedEscrow(null);
                }}
              >
                <n.Icon size={19} color={active ? '#124cc9' : '#b0c6f8'} />
                <span className={s.navLabel}>{n.label}</span>
              </button>
            );
          })}
        </nav>
        <button className={s.userCard} onClick={onExit} title="Exit admin">
          <span className={s.userAvatar}>{initials(name, 'A')}</span>
          <span className={s.userMeta}>
            <span className={s.userName}>{name || 'Admin'}</span>
            <span className={s.userRole}>Super Admin</span>
          </span>
        </button>
      </aside>

      <main className={s.main}>
        {selectedStudent ? (
          <StudentDetail
            student={selectedStudent}
            onBack={() => setSelectedStudent(null)}
            onDecide={async (v) => {
              await setVerification(selectedStudent.user_id, v);
              await reload();
              setSelectedStudent(null);
            }}
          />
        ) : selectedEscrow ? (
          <EscrowDetail
            escrow={selectedEscrow}
            onBack={() => setSelectedEscrow(null)}
            onRelease={async () => {
              await setEscrowPayment(selectedEscrow.id, 'released');
              await reload();
              setSelectedEscrow(null);
            }}
            onRefund={async () => {
              await setEscrowPayment(selectedEscrow.id, 'refunded');
              await reload();
              setSelectedEscrow(null);
            }}
            onFlag={async () => {
              await projectsRepo.setStatus(selectedEscrow.id, 'cancelled');
              await reload();
              setSelectedEscrow(null);
            }}
          />
        ) : screen === 'dashboard' ? (
          <Dashboard
            overview={overview}
            verifs={verifs}
            escrows={escrows}
            reviews={reviews}
            loading={loading}
            onReview={(v) => setSelectedStudent(v)}
            onViewAll={() => setScreen('verification')}
          />
        ) : screen === 'verification' ? (
          <Verification
            verifs={verifs}
            loading={loading}
            onOpen={(v) => setSelectedStudent(v)}
            onQuick={async (v, decision) => {
              await setVerification(v.user_id, decision);
              await reload();
            }}
          />
        ) : screen === 'escrow' ? (
          <Escrow overview={overview} escrows={escrows} loading={loading} onOpen={(e) => setSelectedEscrow(e)} />
        ) : (
          <Ratings reviews={reviews} onModerate={async (id, st) => { await setReviewStatus(id, st); await reload(); }} />
        )}
      </main>
    </div>
  );
}

// ---- Topbar ---------------------------------------------------------------

function Topbar({ title, sub }: { title: string; sub: string }) {
  return (
    <div className={s.topbar}>
      <div>
        <p className={s.pageTitle}>{title}</p>
        <p className={s.pageSub}>{sub}</p>
      </div>
      <input className={s.search} placeholder="Search…" />
    </div>
  );
}

function Stat({ label, value, hint, hintCls }: { label: string; value: string; hint?: string; hintCls?: string }) {
  return (
    <div className={s.statCard}>
      <p className={s.statLabel}>{label}</p>
      <p className={s.statValue}>{value}</p>
      {hint && <span className={`${s.statHint} ${hintCls ?? ''}`}>{hint}</span>}
    </div>
  );
}

// ---- Dashboard ------------------------------------------------------------

function Dashboard({
  overview,
  verifs,
  escrows,
  reviews,
  loading,
  onReview,
  onViewAll,
}: {
  overview: ReturnType<typeof computeOverview>;
  verifs: VerificationRow[];
  escrows: EscrowRow[];
  reviews: ReviewRow[];
  loading: boolean;
  onReview: (v: VerificationRow) => void;
  onViewAll: () => void;
}) {
  const pending = verifs.filter((v) => verifDisplay(v.verification) === 'pending').slice(0, 5);
  const recentEscrows = escrows.slice(0, 4);
  const latestReviews = reviews.slice(0, 4);

  return (
    <>
      <Topbar title="Dashboard" sub="Overview of platform activity" />
      <div className={s.content}>
        <div className={s.statGrid}>
          <Stat label="Verified students" value={String(overview.verifiedStudents)} hint={`${overview.totalStudents} total`} />
          <Stat label="Pending verifications" value={String(overview.pendingVerifications)} hint="awaiting review" hintCls={s.statHintWarn} />
          <Stat label="Active escrows" value={String(overview.activeEscrows)} hint={`${money(overview.heldAmount)} held`} />
          <Stat label="Released" value={money(overview.releasedAmount)} hint="paid out" hintCls={s.statHintUp} />
        </div>

        <div className={s.card}>
          <div className={s.cardHead}>
            <span className={s.cardTitle}>Pending verification requests</span>
            <button className={s.linkBtn} onClick={onViewAll}>View all</button>
          </div>
          {loading ? (
            <p className={s.muted}>Loading…</p>
          ) : pending.length === 0 ? (
            <p className={s.muted}>No pending verification requests.</p>
          ) : (
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Student</th><th>University</th><th>Primary skill</th><th>Submitted</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {pending.map((v) => (
                  <tr key={v.user_id}>
                    <td>
                      <div className={s.nameCell}>
                        <span className={s.avatar}>{initials(v.profile?.full_name)}</span>
                        <div>
                          <div className={s.name}>{v.profile?.full_name || 'Unnamed'}</div>
                          <div className={s.sub}>{v.reg_number || v.profile?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{v.university || '—'}</td>
                    <td>{v.skills?.[0] || '—'}</td>
                    <td className={s.rowMeta}>{ago(v.updated_at)}</td>
                    <td><VerifPill v={v.verification} /></td>
                    <td><button className={`${s.act} ${s.actView}`} onClick={() => onReview(v)}>Review</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={s.twoCol}>
          <div className={s.card}>
            <div className={s.cardHead}><span className={s.cardTitle}>Recent escrow activity</span></div>
            {recentEscrows.length === 0 ? (
              <p className={s.muted}>No escrow activity yet.</p>
            ) : (
              recentEscrows.map((e) => (
                <div key={e.id} className={s.reviewCard}>
                  <div className={s.reviewTop}>
                    <div>
                      <div className={s.name}>{e.task?.title || 'Project'} · {e.student?.full_name || '—'}</div>
                      <div className={s.sub}>{money(Number(e.amount))} held in escrow</div>
                    </div>
                    <EscrowPill p={e} />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={s.card}>
            <div className={s.cardHead}><span className={s.cardTitle}>Latest reviews</span></div>
            {latestReviews.length === 0 ? (
              <p className={s.muted}>No reviews yet.</p>
            ) : (
              latestReviews.map((r) => (
                <div key={r.id} className={s.reviewCard}>
                  <Stars n={r.rating} />
                  <p className={s.reviewQuote}>“{r.comment}”</p>
                  <div className={s.sub}>{r.reviewer_name || 'Client'} → {r.student_name || 'Student'}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ---- Verification ---------------------------------------------------------

const VERIF_TABS = ['All', 'Pending', 'Verified', 'Rejected'] as const;

function Verification({
  verifs,
  loading,
  onOpen,
  onQuick,
}: {
  verifs: VerificationRow[];
  loading: boolean;
  onOpen: (v: VerificationRow) => void;
  onQuick: (v: VerificationRow, decision: 'verified' | 'rejected') => void;
}) {
  const [tab, setTab] = useState<(typeof VERIF_TABS)[number]>('Pending');
  const filtered = verifs.filter((v) => tab === 'All' || verifDisplay(v.verification) === tab.toLowerCase());
  const count = (t: string) => (t === 'All' ? verifs.length : verifs.filter((v) => verifDisplay(v.verification) === t.toLowerCase()).length);

  return (
    <>
      <Topbar title="Student Verification" sub={`${count('Pending')} students awaiting review`} />
      <div className={s.content}>
        <div className={s.toolbar}>
          <div className={s.tabs}>
            {VERIF_TABS.map((t) => (
              <button key={t} className={`${s.tab} ${tab === t ? s.tabActive : ''}`} onClick={() => setTab(t)}>
                {t} {count(t) > 0 ? count(t) : ''}
              </button>
            ))}
          </div>
          <div className={s.filters}>
            <button className={s.filterBtn}>University ▾</button>
            <button className={s.filterBtn}>Skill ▾</button>
          </div>
        </div>

        <div className={s.card}>
          {loading ? (
            <p className={s.muted}>Loading…</p>
          ) : filtered.length === 0 ? (
            <p className={s.muted}>No students in “{tab}”.</p>
          ) : (
            <table className={s.table}>
              <thead>
                <tr><th>Student</th><th>University</th><th>Primary skill</th><th>Documents</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((v) => {
                  const d = verifDisplay(v.verification);
                  const docs = (v.student_id_url ? 1 : 0) + (v.portfolio?.length ?? 0);
                  return (
                    <tr key={v.user_id}>
                      <td>
                        <div className={s.nameCell}>
                          <span className={s.avatar}>{initials(v.profile?.full_name)}</span>
                          <div>
                            <div className={s.name}>{v.profile?.full_name || 'Unnamed'}</div>
                            <div className={s.sub}>{v.reg_number || v.profile?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{v.university || '—'}</td>
                      <td>{v.skills?.[0] || '—'}</td>
                      <td><span className={s.docChip}><span className={s.docBox} />{docs} {docs === 1 ? 'file' : 'files'}</span></td>
                      <td><VerifPill v={v.verification} /></td>
                      <td>
                        <div className={s.actions}>
                          {d === 'pending' ? (
                            <>
                              <button className={`${s.act} ${s.actApprove}`} onClick={() => onQuick(v, 'verified')}>Approve</button>
                              <button className={`${s.act} ${s.actReject}`} onClick={() => onQuick(v, 'rejected')}>Reject</button>
                            </>
                          ) : (
                            <button className={`${s.act} ${s.actView}`} onClick={() => onOpen(v)}>View</button>
                          )}
                          <button className={`${s.act} ${s.actView}`} onClick={() => onOpen(v)}>Details</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

// ---- Student Detail -------------------------------------------------------

function StudentDetail({
  student,
  onBack,
  onDecide,
}: {
  student: VerificationRow;
  onBack: () => void;
  onDecide: (v: 'verified' | 'rejected') => void;
}) {
  const [note, setNote] = useState('');
  const name = student.profile?.full_name || 'Unnamed';
  return (
    <>
      <Topbar title="Student Verification › Detail" sub="Reviewing student verification request" />
      <div className={s.content}>
        <button className={s.backLink} onClick={onBack}>‹ Back to verification queue</button>

        <div className={s.detailHead}>
          <div className={s.nameCell}>
            <span className={s.avatar} style={{ width: 48, height: 48 }}>{initials(name)}</span>
            <div>
              <div className={s.pageTitle} style={{ fontSize: 20 }}>{name}</div>
              <div className={s.sub}>
                {student.university || '—'}{student.department ? ` · ${student.department}` : ''}
                {student.reg_number ? ` · ${student.reg_number}` : ''}
              </div>
            </div>
          </div>
          <VerifPill v={student.verification} />
        </div>

        <div className={s.detailGrid}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className={s.card}>
              <div className={s.cardHead}><span className={s.cardTitle}>Profile details</span></div>
              <div className={s.section}>
                <div className={s.field}><span className={s.fieldLabel}>Full name</span><span className={s.fieldValue}>{name}</span></div>
                <div className={s.field}><span className={s.fieldLabel}>Email</span><span className={s.fieldValue}>{student.profile?.email || '—'}</span></div>
                <div className={s.field}><span className={s.fieldLabel}>University</span><span className={s.fieldValue}>{student.university || '—'}</span></div>
                <div className={s.field}><span className={s.fieldLabel}>Department</span><span className={s.fieldValue}>{student.department || '—'}</span></div>
                <div className={s.field}><span className={s.fieldLabel}>Availability</span><span className={s.fieldValue}>{student.available ? 'Available' : 'Unavailable'}</span></div>
                <div className={s.field}><span className={s.fieldLabel}>LinkedIn</span><span className={s.fieldValue}>{student.linkedin || '—'}</span></div>
                {student.bio && (
                  <div className={s.field} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                    <span className={s.fieldLabel}>Bio</span>
                    <span style={{ fontWeight: 400, color: '#374151', textAlign: 'left' }}>{student.bio}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={s.card}>
              <div className={s.cardHead}><span className={s.cardTitle}>Skills</span></div>
              <div className={s.section}>
                <div className={s.chips}>
                  {(student.skills ?? []).length > 0 ? student.skills.map((sk) => <span key={sk} className={s.chip}>{sk}</span>) : <span className={s.sub}>None listed</span>}
                </div>
              </div>
            </div>

            <div className={s.card}>
              <div className={s.cardHead}><span className={s.cardTitle}>Identity verification</span></div>
              <div className={s.section}>
                <div className={s.field}>
                  <span className={s.fieldLabel}>Student ID card</span>
                  <span className={s.fieldValue}>{student.student_id_url ? 'Uploaded' : 'Missing'}</span>
                </div>
                <div className={s.field}>
                  <span className={s.fieldLabel}>School email</span>
                  <span className={s.fieldValue}>{student.profile?.email || '—'}</span>
                </div>
                <div className={s.field}>
                  <span className={s.fieldLabel}>Portfolio</span>
                  <span className={s.fieldValue}>{student.portfolio?.length ?? 0} items</span>
                </div>
              </div>
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHead}><span className={s.cardTitle}>Verification decision</span></div>
            <div className={s.section}>
              <label className={s.fieldLabel}>Reviewer note</label>
              <textarea className={s.noteInput} placeholder="Add an internal note (optional)…" value={note} onChange={(e) => setNote(e.target.value)} />
              <p className={s.hintText}>Approving marks the student verified and gives them a verified badge.</p>
              <div className={s.btnRow}>
                <button className={s.btnDanger} onClick={() => onDecide('rejected')}>Reject</button>
                <button className={s.btnPrimary} onClick={() => onDecide('verified')}>Approve &amp; verify</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---- Escrow Monitoring ----------------------------------------------------

const ESCROW_TABS = ['All', 'Funded', 'Awaiting approval', 'Released', 'Disputed'] as const;

function Escrow({
  overview,
  escrows,
  loading,
  onOpen,
}: {
  overview: ReturnType<typeof computeOverview>;
  escrows: EscrowRow[];
  loading: boolean;
  onOpen: (e: EscrowRow) => void;
}) {
  const [tab, setTab] = useState<(typeof ESCROW_TABS)[number]>('All');
  const match = (e: EscrowRow) => {
    switch (tab) {
      case 'Funded': return e.payment_status === 'funded' && e.status !== 'cancelled';
      case 'Awaiting approval': return e.status === 'under_review' || e.status === 'submitted';
      case 'Released': return e.payment_status === 'released';
      case 'Disputed': return e.status === 'cancelled';
      default: return true;
    }
  };
  const rows = escrows.filter(match);

  return (
    <>
      <Topbar title="Escrow Monitoring" sub="Track funded, released and disputed payments" />
      <div className={s.content}>
        <div className={s.statGrid}>
          <Stat label="Total held in escrow" value={money(overview.heldAmount)} hint={`across ${overview.activeEscrows} contracts`} />
          <Stat label="Active escrows" value={String(overview.activeEscrows)} hint="funded & in progress" />
          <Stat label="Awaiting approval" value={String(overview.awaitingApproval)} hint="client action needed" hintCls={s.statHintWarn} />
          <Stat label="Disputed" value={String(overview.disputed)} hint="needs admin review" hintCls={overview.disputed ? s.statHintWarn : ''} />
        </div>

        <div className={s.toolbar}>
          <div className={s.tabs}>
            {ESCROW_TABS.map((t) => (
              <button key={t} className={`${s.tab} ${tab === t ? s.tabActive : ''}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          <div className={s.filters}><button className={s.filterBtn}>Date range ▾</button><button className={s.filterBtn}>Export</button></div>
        </div>

        <div className={s.card}>
          {loading ? (
            <p className={s.muted}>Loading…</p>
          ) : rows.length === 0 ? (
            <p className={s.muted}>No escrows in “{tab}”.</p>
          ) : (
            <table className={s.table}>
              <thead>
                <tr><th>Escrow</th><th>Project</th><th>Client</th><th>Student</th><th>Amount</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id}>
                    <td className={s.rowMeta}>#{e.id.slice(0, 6).toUpperCase()}</td>
                    <td className={s.name}>{e.task?.title || 'Project'}</td>
                    <td>{e.client?.full_name || '—'}</td>
                    <td>{e.student?.full_name || '—'}</td>
                    <td className={s.name}>{money(Number(e.amount))}</td>
                    <td><EscrowPill p={e} /></td>
                    <td><button className={`${s.act} ${s.actView}`} onClick={() => onOpen(e)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

// ---- Escrow Detail --------------------------------------------------------

function EscrowDetail({
  escrow,
  onBack,
  onRelease,
  onRefund,
  onFlag,
}: {
  escrow: EscrowRow;
  onBack: () => void;
  onRelease: () => void;
  onRefund: () => void;
  onFlag: () => void;
}) {
  const amount = Number(escrow.amount);
  const fee = amount * 0.05;
  return (
    <>
      <Topbar title="Escrow Monitoring › Detail" sub="Reviewing a single escrow contract" />
      <div className={s.content}>
        <button className={s.backLink} onClick={onBack}>‹ Back to escrow monitoring</button>

        <div className={s.detailHead}>
          <div>
            <div className={s.pageTitle} style={{ fontSize: 20 }}>Escrow #{escrow.id.slice(0, 6).toUpperCase()}</div>
            <div className={s.sub}>{escrow.task?.title || 'Project'} · created {new Date(escrow.created_at).toLocaleDateString()}</div>
          </div>
          <EscrowPill p={escrow} />
        </div>

        <div className={s.detailGrid}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className={s.card}>
              <div className={s.cardHead}><span className={s.cardTitle}>Parties</span></div>
              <div className={s.section}>
                <div className={s.field}><span className={s.fieldLabel}>Client</span><span className={s.fieldValue}>{escrow.client?.full_name || escrow.client_id}</span></div>
                <div className={s.field}><span className={s.fieldLabel}>Student</span><span className={s.fieldValue}>{escrow.student?.full_name || escrow.student_id}</span></div>
              </div>
            </div>

            <div className={s.card}>
              <div className={s.cardHead}><span className={s.cardTitle}>Project details</span></div>
              <div className={s.section}>
                <div className={s.field}><span className={s.fieldLabel}>Title</span><span className={s.fieldValue}>{escrow.task?.title || 'Project'}</span></div>
                <div className={s.field}><span className={s.fieldLabel}>Agreed amount</span><span className={s.fieldValue}>{money(amount)}</span></div>
                <div className={s.field}><span className={s.fieldLabel}>Project status</span><span className={s.fieldValue}>{escrow.status.replace('_', ' ')}</span></div>
              </div>
            </div>

            <div className={s.card}>
              <div className={s.cardHead}><span className={s.cardTitle}>Payment breakdown</span></div>
              <div className={s.section}>
                <div className={s.field}><span className={s.fieldLabel}>Project amount</span><span className={s.fieldValue}>{money(amount)}</span></div>
                <div className={s.field}><span className={s.fieldLabel}>Platform fee (5%)</span><span className={s.fieldValue}>− {money(fee)}</span></div>
                <div className={s.field}><span className={s.fieldLabel}>Student receives</span><span className={s.fieldValue}>{money(amount - fee)}</span></div>
              </div>
            </div>

            <div className={s.card}>
              <div className={s.cardHead}><span className={s.cardTitle}>Blockchain record</span></div>
              <div className={s.section}>
                <div className={s.field}><span className={s.fieldLabel}>Payment status (mirror)</span><span className={s.fieldValue}>{escrow.payment_status}</span></div>
                <div className={s.field}><span className={s.fieldLabel}>Escrow ref</span><span className={s.fieldValue}>{escrow.escrow_ref || 'not yet on-chain'}</span></div>
                <p className={s.hintText}>On-chain funds are owned by the blockchain backend; this panel mirrors status.</p>
              </div>
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHead}><span className={s.cardTitle}>Admin actions</span></div>
            <div className={s.section}>
              <div className={s.btnRow} style={{ flexDirection: 'column' }}>
                <button className={s.btnPrimary} disabled={escrow.payment_status === 'released'} onClick={onRelease}>Release funds to student</button>
                <button className={s.btnGhost} onClick={onRefund}>Refund client</button>
                <button className={s.btnDanger} onClick={onFlag}>Flag dispute</button>
              </div>
              <p className={s.hintText}>Manual release is only for resolving disputes. Normal payouts release automatically on client approval.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---- Ratings & Reviews ----------------------------------------------------

const REVIEW_TABS = ['All', 'Flagged', 'Published', 'Removed'] as const;

function Ratings({
  reviews,
  onModerate,
}: {
  reviews: ReviewRow[];
  onModerate: (id: string, status: ReviewRow['status']) => void;
}) {
  const [tab, setTab] = useState<(typeof REVIEW_TABS)[number]>('All');
  const rows = reviews.filter((r) => tab === 'All' || r.status === tab.toLowerCase());
  const avg = reviews.length ? (reviews.reduce((s2, r) => s2 + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
  const flagged = reviews.filter((r) => r.status === 'flagged').length;
  const removed = reviews.filter((r) => r.status === 'removed').length;

  return (
    <>
      <Topbar title="Ratings & Reviews" sub="Moderate feedback across the marketplace" />
      <div className={s.content}>
        <div className={s.statGrid}>
          <Stat label="Total reviews" value={String(reviews.length)} hint="all-time" />
          <Stat label="Average rating" value={`${avg} ★`} hint="across all students" />
          <Stat label="Flagged" value={String(flagged)} hint="awaiting moderation" hintCls={flagged ? s.statHintWarn : ''} />
          <Stat label="Removed" value={String(removed)} hint="policy violations" />
        </div>

        <div className={s.toolbar}>
          <div className={s.tabs}>
            {REVIEW_TABS.map((t) => (
              <button key={t} className={`${s.tab} ${tab === t ? s.tabActive : ''}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className={s.card}>
          {reviews.length === 0 ? (
            <p className={s.muted}>
              No reviews yet. Reviews appear here once clients rate students after a completed project.
            </p>
          ) : rows.length === 0 ? (
            <p className={s.muted}>No reviews in “{tab}”.</p>
          ) : (
            rows.map((r) => (
              <div key={r.id} className={s.reviewCard}>
                <div className={s.reviewTop}>
                  <div className={s.reviewParties}>{r.reviewer_name || 'Client'} → {r.student_name || 'Student'}</div>
                  {r.status === 'flagged' ? <span className={`${s.pill} ${s.pillRejected}`}>Flagged</span>
                    : r.status === 'removed' ? <span className={`${s.pill} ${s.pillNeutral}`}>Removed</span>
                    : <span className={`${s.pill} ${s.pillVerified}`}>Published</span>}
                </div>
                <Stars n={r.rating} />
                <p className={s.reviewQuote}>“{r.comment}”</p>
                <div className={s.actions}>
                  {r.status !== 'removed' && <button className={`${s.act} ${s.actReject}`} onClick={() => onModerate(r.id, 'removed')}>Remove review</button>}
                  {r.status === 'flagged' && <button className={`${s.act} ${s.actApprove}`} onClick={() => onModerate(r.id, 'published')}>Dismiss flag</button>}
                  {r.status === 'removed' && <button className={`${s.act} ${s.actApprove}`} onClick={() => onModerate(r.id, 'published')}>Restore</button>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

// ---- Login gate -----------------------------------------------------------

function AdminLogin({ email, onGoToLogin, onExit }: { email: string; onGoToLogin: () => void; onExit: () => void }) {
  const loggedInNotAdmin = Boolean(email);
  return (
    <div className={s.loginWrap}>
      <div className={s.loginCard}>
        <div className={s.loginBrand}>
          <img src={logoMark} className={s.loginMark} alt="" />
          <span className={s.loginTitle}>
            <span style={{ color: 'var(--primary-blue)' }}>Skill</span>
            <span style={{ color: 'var(--brand-green)' }}>Bridge</span>
          </span>
        </div>
        <p className={s.loginTitle} style={{ fontSize: 18 }}>Admin Console</p>
        <p className={s.loginSub}>Sign in to manage the marketplace</p>

        <label className={s.loginLabel}>Email</label>
        <input className={s.loginInput} value={email} readOnly placeholder="you@skillbridge.africa" />

        {loggedInNotAdmin ? (
          <>
            <p className={s.hintText} style={{ marginTop: 16, color: '#dc2626' }}>
              This account doesn’t have admin access. Ask an admin to grant it.
            </p>
            <button className={s.btnGhost} style={{ width: '100%', marginTop: 8 }} onClick={onExit}>Back to app</button>
          </>
        ) : (
          <button className={s.btnPrimary} style={{ width: '100%', marginTop: 18 }} onClick={onGoToLogin}>
            Sign in
          </button>
        )}
        <p className={s.loginFoot}>Authorized administrators only · Access is logged</p>
      </div>
    </div>
  );
}
