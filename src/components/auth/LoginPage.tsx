import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Fingerprint,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  RotateCw,
  Building2,
  Stethoscope,
  ShoppingBag,
  Briefcase,
  Utensils,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

interface LoginPageProps {
  onSuccess: () => void;
}

type AuthStep =
  | 'email_entry'
  | 'returning_options'
  | 'password'
  | 'magic_link_sent'
  | 'otp_code'
  | 'passkey_prompt'
  | 'invited_setup';

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const { switchTenant } = useTenant();

  // Progressive Form State
  const [step, setStep] = useState<AuthStep>('email_entry');
  const [email, setEmail] = useState<string>('dr.lin@luminahealth.com');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('Dr. Sarah Lin');
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Status & Feedback States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [infoMessage, setInfoMessage] = useState<string>('');

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Known workspaces for immediate testing
  const knownWorkspaces = [
    {
      name: 'Lumina Health Group',
      domain: 'luminahealth.com',
      email: 'dr.lin@luminahealth.com',
      tenantId: 'tenant-lumina-01',
      icon: Stethoscope,
      category: 'Healthcare & Clinic',
    },
    {
      name: 'Apex Goods Co.',
      domain: 'apexgoods.store',
      email: 'ops@apexgoods.store',
      tenantId: 'tenant-apex-02',
      icon: ShoppingBag,
      category: 'E-Commerce & Retail',
    },
    {
      name: 'Vantage Capital Advisory',
      domain: 'vantagecap.io',
      email: 'partners@vantagecap.io',
      tenantId: 'tenant-vantage-03',
      icon: Briefcase,
      category: 'Corporate Advisory',
    },
    {
      name: 'Velvet & Vine',
      domain: 'velvetvine.com',
      email: 'events@velvetvine.com',
      tenantId: 'tenant-velvet-04',
      icon: Utensils,
      category: 'Hospitality & Dining',
    },
  ];

  // OTP Countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (step === 'otp_code' && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    const clean = email.trim();
    if (!clean || !clean.includes('@')) {
      setErrorMessage('Enter a valid work email address.');
      return;
    }

    setIsSubmitting(true);
    setLoadingText('Verifying workspace…');

    setTimeout(() => {
      setIsSubmitting(false);
      setLoadingText('');

      // If email has "invite", route to invited client setup
      if (clean.includes('invite') || clean.includes('new')) {
        setStep('invited_setup');
      } else {
        setStep('returning_options');
      }
    }, 400);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('Enter your account password.');
      return;
    }

    setIsSubmitting(true);
    setLoadingText('Verifying credentials…');
    setErrorMessage('');

    const matched = knownWorkspaces.find(
      (w) => w.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (matched) {
      switchTenant(matched.tenantId);
    }

    try {
      await login(email, password, matched?.tenantId);
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 350);
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Something went wrong. Please check credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setLoadingText('Connecting via Google Workspace…');
    setErrorMessage('');

    // Default to Lumina Health for Google SSO if unspecified
    const matched = knownWorkspaces.find(
      (w) => w.email.toLowerCase() === email.trim().toLowerCase()
    ) || knownWorkspaces[0];

    switchTenant(matched.tenantId);

    setTimeout(async () => {
      await login(matched.email, 'google-oauth-token', matched.tenantId);
      setIsSubmitting(false);
      onSuccess();
    }, 500);
  };

  const handlePasskeySignIn = () => {
    setStep('passkey_prompt');
    setIsSubmitting(true);
    setLoadingText('Requesting biometric verification…');
    setErrorMessage('');

    const matched = knownWorkspaces.find(
      (w) => w.email.toLowerCase() === email.trim().toLowerCase()
    ) || knownWorkspaces[0];

    switchTenant(matched.tenantId);

    // Simulate standard WebAuthn biometric prompt
    setTimeout(async () => {
      await login(matched.email, 'passkey-assertion-valid', matched.tenantId);
      setIsSubmitting(false);
      onSuccess();
    }, 850);
  };

  const handleSendMagicLink = () => {
    setIsSubmitting(true);
    setLoadingText('Sending secure sign-in link…');
    setErrorMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('magic_link_sent');
    }, 450);
  };

  const handleSendOtp = () => {
    setIsSubmitting(true);
    setLoadingText('Generating 6-digit access code…');
    setErrorMessage('');
    setCountdown(30);
    setCanResend(false);

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp_code');
    }, 400);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...otpCode];
    newCode[index] = value.slice(-1);
    setOtpCode(newCode);

    // Auto advance
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    if (newCode.every((digit) => digit !== '')) {
      verifyOtpCode(newCode.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pasted)) {
      const digits = pasted.split('');
      const newCode = [...otpCode];
      digits.forEach((d, i) => {
        if (i < 6) newCode[i] = d;
      });
      setOtpCode(newCode);
      if (digits.length === 6) {
        verifyOtpCode(pasted);
      }
    }
  };

  const verifyOtpCode = async (_code: string) => {
    setIsSubmitting(true);
    setLoadingText('Verifying code…');
    setErrorMessage('');

    const matched = knownWorkspaces.find(
      (w) => w.email.toLowerCase() === email.trim().toLowerCase()
    ) || knownWorkspaces[0];

    switchTenant(matched.tenantId);

    setTimeout(async () => {
      await login(matched.email, 'otp-token', matched.tenantId);
      setIsSubmitting(false);
      onSuccess();
    }, 500);
  };

  const handleInvitedSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);
    setLoadingText('Activating workspace account…');

    const matched = knownWorkspaces[0];
    switchTenant(matched.tenantId);

    setTimeout(async () => {
      await login(email, password, matched.tenantId);
      setIsSubmitting(false);
      onSuccess();
    }, 500);
  };

  const handleSelectWorkspaceFast = async (w: typeof knownWorkspaces[0]) => {
    setEmail(w.email);
    setPassword('••••••••••••');
    switchTenant(w.tenantId);
    setIsSubmitting(true);
    setLoadingText(`Opening ${w.name}…`);
    setTimeout(async () => {
      await login(w.email, 'fast-auth', w.tenantId);
      setIsSubmitting(false);
      onSuccess();
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100 flex flex-col lg:flex-row antialiased selection:bg-violet-600/30 selection:text-white">
      {/* ============================================================== */}
      {/* LEFT SIDE: Brand Showcase (52% on desktop, compact on mobile) */}
      {/* ============================================================== */}
      <div className="w-full lg:w-[52%] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-zinc-900 bg-gradient-to-b from-[#090a10] via-[#06070a] to-[#050608] relative overflow-hidden">
        {/* Subtle technical background grid & orbital rings */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        {/* Delicate ambient technical orbital graphic */}
        <div className="absolute -top-12 -left-12 size-[440px] pointer-events-none opacity-20 hidden md:block">
          <svg viewBox="0 0 400 400" className="w-full h-full animate-[spin_120s_linear_infinite]">
            <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" className="text-violet-500/40" />
            <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-zinc-700/50" />
            <circle cx="60" cy="200" r="3" fill="currentColor" className="text-violet-400" />
            <circle cx="340" cy="200" r="2" fill="currentColor" className="text-zinc-500" />
          </svg>
        </div>

        {/* Top: Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          {/* LevelUp Geometric Mark */}
          <div className="size-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shadow-inner">
            <svg viewBox="0 0 24 24" fill="none" className="size-5 text-violet-400" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          <div>
            <span className="font-semibold text-sm tracking-tight text-white block">
              LevelUp Ecosystem
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
              Client Operating System
            </span>
          </div>
        </div>

        {/* Center: Headline & Value Statement (Hidden on small mobile to save space) */}
        <div className="relative z-10 my-auto py-12 max-w-lg hidden lg:block space-y-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Multi-Tenant Architecture · RLS Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-medium tracking-tight text-white leading-[1.15]">
            Your digital ecosystem, <br />
            <span className="text-zinc-400">connected in one place.</span>
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
            Manage your website, requests, analytics, bookings and more from one secure workspace.
          </p>
        </div>

        {/* Bottom: Technical Invariants */}
        <div className="relative z-10 hidden lg:flex items-center justify-between pt-6 border-t border-zinc-900 text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>FIDO2 / WebAuthn & TLS 1.3</span>
          </div>
          <span>Edge CDN Synced</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT SIDE: Progressive Authentication Interface */}
      {/* ============================================================== */}
      <div className="w-full lg:w-[48%] flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-10 lg:py-16 relative">
        <div className="w-full max-w-[390px] space-y-6">
          {/* Back button if past first step */}
          {step !== 'email_entry' && (
            <button
              type="button"
              onClick={() => {
                setErrorMessage('');
                setInfoMessage('');
                setStep('email_entry');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="size-3.5" />
              <span>Back to email</span>
            </button>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 1: Email Entry & Google 1-Click */}
          {/* ------------------------------------------------------------ */}
          {step === 'email_entry' && (
            <div className="space-y-6 animate-fade-up">
              {/* Heading */}
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Welcome back
                </h2>
                <p className="text-xs text-zinc-400">
                  Sign in to your LevelUp workspace.
                </p>
              </div>

              {/* Error / Info Banner */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* 1. Continue with Google (Prominent, clean) */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800 text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-all shadow-xs disabled:opacity-50"
              >
                {/* Official Google G Logo */}
                <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Minimal Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-zinc-800/80" />
                <span className="bg-[#06070a] px-3 text-[11px] text-zinc-500 font-mono">
                  or
                </span>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-zinc-300 block">
                    Work Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-zinc-200 active:scale-[0.99] text-black text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>{loadingText || 'Verifying…'}</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Passkey Primary Option */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePasskeySignIn}
                  disabled={isSubmitting}
                  className="w-full p-3 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 text-left transition-all flex items-start gap-3 group"
                >
                  <Fingerprint className="size-4 text-violet-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform" />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-white group-hover:text-violet-300 transition-colors">
                      Continue with passkey
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Use Face ID, Touch ID, Windows Hello, or your device PIN.
                    </div>
                  </div>
                </button>
              </div>

              {/* One-time code trigger */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-xs text-zinc-400 hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  Use a one-time code instead
                </button>
              </div>

              {/* Minimal Demo Workspace Selector */}
              <div className="pt-4 border-t border-zinc-900/80">
                <div className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider mb-2">
                  Client Workspaces
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {knownWorkspaces.map((w) => (
                    <button
                      key={w.tenantId}
                      type="button"
                      onClick={() => handleSelectWorkspaceFast(w)}
                      className="p-2 rounded-md bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-750 text-left transition-colors truncate"
                      title={w.name}
                    >
                      <div className="text-xs font-medium text-zinc-200 truncate">{w.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono truncate">{w.domain}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 2: Returning User Progressive Choices */}
          {/* ------------------------------------------------------------ */}
          {step === 'returning_options' && (
            <div className="space-y-6 animate-fade-up">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Welcome back
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-300 font-mono">{email}</span>
                  <button
                    type="button"
                    onClick={() => setStep('email_entry')}
                    className="text-violet-400 hover:text-violet-300 text-[11px]"
                  >
                    Change
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-2.5">
                {/* 1. Passkey */}
                <button
                  type="button"
                  onClick={handlePasskeySignIn}
                  disabled={isSubmitting}
                  className="w-full p-3.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Fingerprint className="size-4 text-violet-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Continue with passkey
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Face ID, Touch ID, or security key
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                </button>

                {/* 2. Magic Link */}
                <button
                  type="button"
                  onClick={handleSendMagicLink}
                  disabled={isSubmitting}
                  className="w-full p-3.5 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="size-4 text-zinc-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Send me a secure sign-in link
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Passwordless login to your inbox
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                </button>

                {/* 3. Password */}
                <button
                  type="button"
                  onClick={() => setStep('password')}
                  className="w-full p-3.5 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="size-4 text-zinc-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Use password instead
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Authenticate with your stored credentials
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                </button>

                {/* 4. One-time Code */}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full p-3.5 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <KeyRound className="size-4 text-zinc-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Send one-time 6-digit code
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Short-lived access code via email
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 3: Password Entry */}
          {/* ------------------------------------------------------------ */}
          {step === 'password' && (
            <div className="space-y-6 animate-fade-up">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Enter your password
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-300 font-mono">{email}</span>
                  <button
                    type="button"
                    onClick={() => setStep('returning_options')}
                    className="text-violet-400 hover:text-violet-300 text-[11px]"
                  >
                    Change method
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {errorMessage}
                </div>
              )}

              {infoMessage && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs">
                  {infoMessage}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="pwd" className="text-xs font-medium text-zinc-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setInfoMessage('Password reset link sent to your registered email.')}
                      className="text-[11px] text-violet-400 hover:text-violet-300"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="pwd"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="size-8 absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-zinc-200 active:scale-[0.99] text-black text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>{loadingText || 'Verifying credentials…'}</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 4: One-Time 6-Digit Email Code */}
          {/* ------------------------------------------------------------ */}
          {step === 'otp_code' && (
            <div className="space-y-6 animate-fade-up">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Check your email
                </h2>
                <p className="text-xs text-zinc-400">
                  We sent a secure sign-in code to <strong className="text-white font-mono">{email}</strong>
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* 6 Digit Inputs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2" onPaste={handleOtpPaste}>
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputsRef.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      autoFocus={index === 0}
                      className="size-11 sm:size-12 rounded-lg bg-zinc-950 border border-zinc-800 text-center font-mono text-base font-bold text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => verifyOtpCode(otpCode.join(''))}
                  disabled={isSubmitting || otpCode.some((d) => !d)}
                  className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Verifying code…</span>
                    </>
                  ) : (
                    <span>Confirm Code</span>
                  )}
                </button>
              </div>

              {/* Resend microcopy */}
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-900">
                <span>Didn't receive it?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-violet-400 hover:text-violet-300 font-medium"
                  >
                    Resend code
                  </button>
                ) : (
                  <span className="font-mono text-zinc-500">
                    Resend in 0:{countdown < 10 ? `0${countdown}` : countdown}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 5: Magic Link Sent State */}
          {/* ------------------------------------------------------------ */}
          {step === 'magic_link_sent' && (
            <div className="space-y-6 animate-fade-up text-center">
              <div className="size-12 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto">
                <Mail className="size-6" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Check your inbox
                </h2>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  We sent a secure, passwordless sign-in link to <strong className="text-white font-mono">{email}</strong>.
                  Click the link to enter your workspace.
                </p>
              </div>

              {/* Action simulate */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setIsSubmitting(true);
                    setLoadingText('Verifying magic link token…');
                    const matched = knownWorkspaces.find((w) => w.email.toLowerCase() === email.toLowerCase()) || knownWorkspaces[0];
                    switchTenant(matched.tenantId);
                    setTimeout(async () => {
                      await login(matched.email, 'magic-link', matched.tenantId);
                      setIsSubmitting(false);
                      onSuccess();
                    }, 500);
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>{loadingText}</span>
                    </>
                  ) : (
                    <span>Simulate Clicking Magic Link</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('password')}
                  className="w-full py-2 px-3 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Use password instead
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 6: Passkey Biometric Prompt Overlay */}
          {/* ------------------------------------------------------------ */}
          {step === 'passkey_prompt' && (
            <div className="space-y-6 animate-fade-up text-center py-4">
              <div className="size-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-violet-400 shadow-xl relative">
                <Fingerprint className="size-8 animate-pulse" />
                <span className="absolute -bottom-1 -right-1 size-3 rounded-full bg-emerald-500 ring-2 ring-zinc-900" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  Authenticating with Passkey
                </h2>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Follow the prompt on your device (Face ID, Touch ID, or Windows Hello) to confirm your identity.
                </p>
              </div>

              <div className="text-[11px] font-mono text-zinc-500 pt-2 flex items-center justify-center gap-2">
                <div className="size-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                <span>Waiting for security enclave…</span>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 7: Invited Client Account Setup */}
          {/* ------------------------------------------------------------ */}
          {step === 'invited_setup' && (
            <div className="space-y-6 animate-fade-up">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                  Invitation Verified
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  You're invited to LevelUp
                </h2>
                <p className="text-xs text-zinc-400">
                  Let's finish setting up your client workspace account.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleInvitedSetupSubmit} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Your Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Create Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Min 8 characters"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Activating workspace…</span>
                    </>
                  ) : (
                    <>
                      <span>Activate Workspace</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
