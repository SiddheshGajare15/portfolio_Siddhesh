import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, ChevronRight, Copy, Loader2, FileCheck2, Smartphone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

// UPI details
const UPI_ID     = 'siddheshgajare15@okicici';
const UPI_MOBILE = '9921990983';
const AMOUNT     = 299;

const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(
  `upi://pay?pa=${UPI_ID}&pn=Siddhesh%20Gajare&am=${AMOUNT}&cu=INR`
)}`;

const PaymentModal = ({ onClose }) => {
  const { user, refreshDbUser } = useAuth();
  const [step, setStep]           = useState(1);
  const [txId, setTxId]           = useState('');
  const [email, setEmail]         = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]         = useState(null);
  const [copied, setCopied]       = useState(null); // tracks which field was copied

  // ── Lock body scroll while modal is open ──────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const copy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 1800);
    } catch { /* silent */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { setError('You must be logged in.'); return; }
    if (!txId.trim()) { setError('Please enter your Transaction ID.'); return; }

    setIsSubmitting(true);
    setError(null);

    const { error: dbErr } = await supabase.from('payments').insert({
      user_id: user.id,
      transaction_id: txId.trim(),
      status: 'pending',
    });

    setIsSubmitting(false);

    if (dbErr) {
      setError(
        dbErr.message.includes('unique')
          ? 'This Transaction ID was already submitted. Contact support if you think this is an error.'
          : dbErr.message
      );
    } else {
      refreshDbUser();
      setStep(3);
    }
  };

  return (
    /*
     * Overlay: fills screen, flex-centered on desktop.
     * On mobile the overlay is scrollable itself (overflow-y-auto), 
     * so the modal card aligns to top on very small screens.
     */
    <div
      className="fixed inset-0 z-[1200] overflow-y-auto bg-slate-950/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Inner centering wrapper — padding gives safe space on mobile */}
      <div className="min-h-full flex items-center justify-center p-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          className="
            relative w-full max-w-md
            bg-white dark:bg-slate-900
            rounded-[2rem] shadow-2xl
            /* No overflow-hidden here — let content scroll naturally */
          "
        >
          {/* ── Sticky header ──────────────────────────────────────── */}
          <div className="sticky top-0 z-10 flex items-start justify-between px-7 py-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-t-[2rem]">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Premium Test Series</h2>
              <p className="text-slate-400 font-bold text-sm mt-0.5">One-time · ₹{AMOUNT} · Lifetime access</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 ml-3"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Scrollable body ────────────────────────────────────── */}
          <div className="px-7 py-6 pb-8">
            <AnimatePresence mode="wait">

              {/* STEP 1 — What you get */}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  className="space-y-5"
                >
                  <div className="space-y-3">
                    {[
                      '5 Full-Length CCAT Mock Tests',
                      '100 Questions · 2 Sections per test',
                      '120 minutes per test — real exam timer',
                      'Detailed results after every attempt',
                      'Unlimited reattempts',
                    ].map(f => (
                      <div key={f} className="flex items-center gap-3 font-medium text-slate-700 dark:text-slate-300">
                        <CheckCircle2 size={17} className="text-emerald-500 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex gap-3 items-start">
                    <ShieldCheck size={17} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                      Manual UPI verification. Access granted within 1–3 hours.
                    </p>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group hover:bg-primary/95 transition-all"
                  >
                    Pay ₹{AMOUNT} — Get Full Access
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {/* STEP 2 — QR + Form */}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  className="space-y-5"
                >
                  {/* Numbered instructions */}
                  <div className="space-y-2">
                    {[
                      'Scan QR code or pay via UPI ID below.',
                      `Pay exactly ₹${AMOUNT} — no more, no less.`,
                      'Enter the UPI Transaction ID from your payment app.',
                    ].map((t, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-black flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        {t}
                      </div>
                    ))}
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center pt-1">
                    <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-100 inline-flex flex-col items-center">
                      <img
                        src={QR_URL}
                        alt="UPI Payment QR — siddheshgajare15@okicici"
                        width={160}
                        height={160}
                        className="block rounded-xl"
                        onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                      />
                      <p className="text-[11px] font-black text-slate-500 mt-2 uppercase tracking-wider">
                        Scan to Pay ₹{AMOUNT}
                      </p>
                    </div>
                  </div>

                  {/* UPI copy rows */}
                  <div className="space-y-2">
                    {[
                      { label: 'UPI ID', value: UPI_ID, field: 'upi' },
                      { label: 'Mobile', value: UPI_MOBILE, field: 'mob' },
                    ].map(({ label, value, field }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl"
                      >
                        <div className="min-w-0 mr-3">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
                          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{value}</p>
                        </div>
                        <button
                          onClick={() => copy(value, field)}
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400 hover:text-primary transition-colors text-xs font-bold"
                        >
                          <Copy size={13} />
                          {copied === field ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                      <p className="text-red-600 text-sm font-bold">{error}</p>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                        Your Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                        UPI Transaction ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        value={txId}
                        onChange={e => setTxId(e.target.value)}
                        placeholder="e.g. 4057839201847362"
                        inputMode="numeric"
                        className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-800 dark:text-slate-200"
                      />
                      <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                        Find this in your UPI app under payment history.
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => { setStep(1); setError(null); }}
                        className="px-5 py-3.5 font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3.5 bg-primary text-white font-black rounded-xl flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 disabled:opacity-70"
                      >
                        {isSubmitting
                          ? <><Loader2 className="animate-spin" size={17} /> Submitting…</>
                          : 'Submit Payment'
                        }
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 3 — Success */}
              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-5"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <FileCheck2 size={38} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Payment Submitted!</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Your payment is under review. Premium access will be activated within{' '}
                    <strong className="text-slate-800 dark:text-slate-200">1–3 hours</strong>.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-start gap-3 text-left">
                    <Smartphone size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      For faster activation, WhatsApp your payment screenshot to{' '}
                      <strong className="text-slate-800 dark:text-white">{UPI_MOBILE}</strong>.
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-2xl hover:opacity-90 transition-opacity"
                  >
                    Close
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentModal;
