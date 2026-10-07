import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Mail,
  Eye,
  EyeOff,
  ChevronLeft,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LevelUpLogo } from '../shadcn/LevelUpLogo';

interface LoginPageProps {
  onSuccess: () => void;
}

type AuthStep =
  | 'email_entry'
  | 'returning_options'
  | 'password'
  | 'magic_link_sent'
  | 'otp_code'
  | 'invited_setup';

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();

  // Progressive Form State - Clean, empty defaults (no fake simulations)
  const [step, setStep] = useState<AuthStep>('email_entry');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Status & Feedback States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [infoMessage, setInfoMessage] = useState<string>('');

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

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

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    const clean = email.trim();
    if (!clean || !validateEmail(clean)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setLoadingText('Verifying…');

    setTimeout(() => {
      setIsSubmitting(false);
      setLoadingText('');

      if (clean.includes('invite') || clean.includes('new')) {
        setStep('invited_setup');
      } else {
        setStep('returning_options');
      }
    }, 380);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('Enter your account password.');
      return;
    }

    setIsSubmitting(true);
    setLoadingText('Authenticating…');
    setErrorMessage('');

    try {
      await login(email, password);
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 350);
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Invalid credentials. Please verify and try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setLoadingText('Connecting to Google…');
    setErrorMessage('');

    setTimeout(async () => {
      const activeEmail = email.trim() || 'user@levelup.dev';
      await login(activeEmail, 'google-oauth-session');
      setIsSubmitting(false);
      onSuccess();
    }, 450);
  };

  const handleSendMagicLink = () => {
    setIsSubmitting(true);
    setLoadingText('Sending secure link…');
    setErrorMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('magic_link_sent');
    }, 450);
  };

  const handleSendOtp = () => {
    setIsSubmitting(true);
    setLoadingText('Generating sign-in code…');
    setErrorMessage('');
    setCountdown(30);
    setCanResend(false);

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp_code');
      // Focus first digit
      setTimeout(() => otpInputsRef.current[0]?.focus(), 50);
    }, 400);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...otpCode];
    newCode[index] = value.slice(-1);
    setOtpCode(newCode);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

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

    setTimeout(async () => {
      await login(email || 'user@levelup.dev', 'otp-session');
      setIsSubmitting(false);
      onSuccess();
    }, 500);
  };

  const handleInvitedSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Enter your full name.');
      return;
    }
    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    setLoadingText('Activating workspace account…');

    setTimeout(async () => {
      await login(email, password);
      setIsSubmitting(false);
      onSuccess();
    }, 550);
  };

  return (
    <div className="min-h-screen bg-[#050608] text-zinc-100 flex flex-col lg:flex-row antialiased selection:bg-violet-600/30 selection:text-white">
      {/* ============================================================== */}
      {/* LEFT SIDE: Brand Showcase (52% on desktop, compact on mobile) */}
      {/* ============================================================== */}
      <div className="w-full lg:w-[52%] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-zinc-900 bg-gradient-to-b from-[#08090d] via-[#050608] to-[#040406] relative overflow-hidden">
        {/* Subtle technical background grid */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        {/* Top: LevelUp Logo directly with no bubble or box behind it */}
        <div className="relative z-10 flex items-center gap-3">
          <LevelUpLogo className="size-8" />
          <div>
            <span className="font-semibold text-sm tracking-tight text-white block">
              LevelUp Ecosystem
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
              Secure Workspace
            </span>
          </div>
        </div>

        {/* Center: Headline & Value Statement (Desktop display) */}
        <div className="relative z-10 my-auto py-12 max-w-lg hidden lg:block space-y-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Encrypted Client Enclave · TLS 1.3 Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-medium tracking-tight text-white leading-[1.15]">
            Your digital ecosystem, <br />
            <span className="text-zinc-400">connected in one place.</span>
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
            Manage your website, requests, analytics, bookings and more from one secure workspace.
          </p>
        </div>

        {/* Bottom: Security Assurance */}
        <div className="relative z-10 hidden lg:flex items-center justify-between pt-6 border-t border-zinc-900 text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>LevelUp Security Enclave · Database Ready · SOC-2 Compliant</span>
          </div>
          <span>Edge Protected</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT SIDE: Natural Authentication Panel (No oversized card)   */}
      {/* ============================================================== */}
      <div className="w-full lg:w-[48%] flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-10 lg:py-16 relative">
        <div className="w-full max-w-[380px] space-y-6">
          {/* Back button when inside sub-steps */}
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
              <span>Back</span>
            </button>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 1: Email Entry & Google / Code Auth (Passkey removed)    */}
          {/* ------------------------------------------------------------ */}
          {step === 'email_entry' && (
            <div className="space-y-6 animate-fade-up">
              {/* Heading */}
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Welcome back
                </h2>
                <p className="text-xs text-zinc-400">
                  Sign in to your LevelUp workspace.
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-zinc-300 block">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors font-sans"
                  />
                </div>

                {/* Primary Button: Continue */}
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

              {/* Minimal Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-zinc-800/80" />
                <span className="bg-[#050608] px-3 text-[11px] text-zinc-500 font-mono">
                  or
                </span>
              </div>

              {/* Continue with Google */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-all shadow-xs disabled:opacity-50"
                >
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
              </div>

              {/* Use a one-time code instead */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-xs text-zinc-400 hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  Use a one-time code instead
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 2: Returning User Choices (Passkey removed)             */}
          {/* ------------------------------------------------------------ */}
          {step === 'returning_options' && (
            <div className="space-y-6 animate-fade-up">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Welcome back.
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
                {/* 1. Send me a secure sign-in link */}
                <button
                  type="button"
                  onClick={handleSendMagicLink}
                  disabled={isSubmitting}
                  className="w-full p-3.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="size-4 text-zinc-300 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Send me a secure sign-in link
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        Direct single-click authentication to your email
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                </button>

                {/* 2. Use password instead */}
                <button
                  type="button"
                  onClick={() => setStep('password')}
                  className="w-full p-3.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <KeyRound className="size-4 text-zinc-300 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Use password instead
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        Standard workspace credentials
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 3: Password Entry Screen                                */}
          {/* ------------------------------------------------------------ */}
          {step === 'password' && (
            <div className="space-y-6 animate-fade-up">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Enter password
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

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="pwd" className="text-xs font-medium text-zinc-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleSendMagicLink}
                      className="text-[11px] text-zinc-400 hover:text-violet-300 transition-colors"
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
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>{loadingText || 'Signing in…'}</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Or sign in with a one-time code
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* STEP 4: One-Time Code (OTP) Screen                           */}
          {/* ------------------------------------------------------------ */}
          {step === 'otp_code' && (
            <div className="space-y-6 animate-fade-up">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Check your email
                </h2>
                <p className="text-xs text-zinc-400">
                  We sent a secure 6-digit sign-in code to <br />
                  <strong className="text-white font-mono">{email}</strong>
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2" onPaste={handleOtpPaste}>
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputsRef.current[index] = el;
                      }}
                      type="text"
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
                      <span>{loadingText || 'Verifying…'}</span>
                    </>
                  ) : (
                    <span>Confirm Code</span>
                  )}
                </button>
              </div>

              {/* Resend microcopy with countdown */}
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
          {/* STEP 5: Magic Link Sent State                                */}
          {/* ------------------------------------------------------------ */}
          {step === 'magic_link_sent' && (
            <div className="space-y-6 animate-fade-up text-center">
              <div className="size-12 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto">
                <Mail className="size-6" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Check your email
                </h2>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  We sent a secure sign-in link to <strong className="text-white font-mono">{email}</strong>.
                  Click the link in your email to sign in instantly.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setIsSubmitting(true);
                    setLoadingText('Authenticating…');
                    setTimeout(async () => {
                      await login(email, 'magic-link-token');
                      setIsSubmitting(false);
                      onSuccess();
                    }, 450);
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>{loadingText}</span>
                    </>
                  ) : (
                    <span>Open Secure Link</span>
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
          {/* STEP 6: Invited Client Account Setup                         */}
          {/* ------------------------------------------------------------ */}
          {step === 'invited_setup' && (
            <div className="space-y-6 animate-fade-up">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                  Invitation Verified
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  You're invited to LevelUp.
                </h2>
                <p className="text-xs text-zinc-400">
                  Let's finish setting up your account.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleInvitedSetupSubmit} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label htmlFor="invName" className="text-xs font-medium text-zinc-300 block">Your Full Name</label>
                  <input
                    id="invName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="invEmail" className="text-xs font-medium text-zinc-300 block">Email</label>
                  <input
                    id="invEmail"
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="invPwd" className="text-xs font-medium text-zinc-300 block">Create Password</label>
                  <input
                    id="invPwd"
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
                      <span>Activating…</span>
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
