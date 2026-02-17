'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { FRAMEWORK_STEPS } from '@/lib/framework';
import { FrameworkStep } from '@/types';

export default function FrameworkPage() {
  const [activeStep, setActiveStep] = useState<string>(FRAMEWORK_STEPS[0].id);
  const step = FRAMEWORK_STEPS.find((s) => s.id === activeStep) ?? FRAMEWORK_STEPS[0];

  return (
    <AppShell>
      <div style={{ padding: '40px 48px', maxWidth: '1100px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--ink-subtle)',
              fontFamily: 'sans-serif',
              marginBottom: '8px',
            }}
          >
            Study Guide
          </div>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              color: 'var(--navy)',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            The 5-Step Product<br />Sense Framework
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--ink-muted)',
              marginTop: '12px',
              fontFamily: 'sans-serif',
              maxWidth: '560px',
              lineHeight: 1.6,
            }}
          >
            A structured methodology for approaching any product question with clarity, depth, and strategic thinking. Internalize this framework to answer consistently and confidently.
          </p>
        </div>

        {/* Framework overview — all steps */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '32px',
            padding: '16px',
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '14px',
          }}
        >
          {FRAMEWORK_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              style={{
                flex: 1,
                padding: '12px 8px',
                border: 'none',
                borderRadius: '10px',
                background: activeStep === s.id ? s.color : 'transparent',
                color: activeStep === s.id ? 'white' : 'var(--ink-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '18px', opacity: activeStep === s.id ? 1 : 0.5 }}>{s.icon}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: activeStep === s.id ? '600' : '400',
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.02em',
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}
              >
                {i + 1}. {s.title}
              </span>
            </button>
          ))}
        </div>

        {/* Step detail */}
        <StepDetail step={step} key={step.id} />

        {/* Next / Prev navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
          {FRAMEWORK_STEPS.findIndex((s) => s.id === activeStep) > 0 ? (
            <button
              onClick={() => {
                const idx = FRAMEWORK_STEPS.findIndex((s) => s.id === activeStep);
                setActiveStep(FRAMEWORK_STEPS[idx - 1].id);
              }}
              style={{
                padding: '12px 24px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'white',
                color: 'var(--navy)',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'sans-serif',
              }}
            >
              ← Previous Step
            </button>
          ) : (
            <div />
          )}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/practice"
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                background: 'var(--navy)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'sans-serif',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Practice This Framework →
            </Link>
            {FRAMEWORK_STEPS.findIndex((s) => s.id === activeStep) < FRAMEWORK_STEPS.length - 1 && (
              <button
                onClick={() => {
                  const idx = FRAMEWORK_STEPS.findIndex((s) => s.id === activeStep);
                  setActiveStep(FRAMEWORK_STEPS[idx + 1].id);
                }}
                style={{
                  padding: '12px 24px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'white',
                  color: 'var(--navy)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: 'sans-serif',
                }}
              >
                Next Step →
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StepDetail({ step }: { step: FrameworkStep }) {
  return (
    <div className="animate-fade-in">
      {/* Hero card */}
      <div
        style={{
          borderRadius: '16px',
          padding: '36px 40px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${step.color}15 0%, ${step.color}05 100%)`,
          border: `1px solid ${step.color}25`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            fontSize: '120px',
            opacity: 0.04,
            lineHeight: 1,
            fontFamily: 'Georgia, serif',
          }}
        >
          {step.icon}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: step.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0,
              color: 'white',
            }}
          >
            {step.icon}
          </div>
          <div>
            <div
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: step.color,
                fontFamily: 'sans-serif',
                marginBottom: '6px',
                fontWeight: '600',
              }}
            >
              Step {step.number} of {FRAMEWORK_STEPS.length}
            </div>
            <h2
              style={{
                fontSize: '26px',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                color: 'var(--navy)',
                margin: '0 0 4px',
              }}
            >
              {step.title}
            </h2>
            <div
              style={{
                fontSize: '15px',
                color: 'var(--ink-muted)',
                fontFamily: 'sans-serif',
                fontStyle: 'italic',
              }}
            >
              {step.subtitle}
            </div>
          </div>
        </div>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--ink)',
            fontFamily: 'sans-serif',
            lineHeight: 1.7,
            marginTop: '24px',
            marginBottom: 0,
            maxWidth: '680px',
          }}
        >
          {step.description}
        </p>
      </div>

      {/* Three columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Key Questions */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: step.color,
              fontFamily: 'sans-serif',
              fontWeight: '600',
              marginBottom: '16px',
            }}
          >
            Key Questions
          </div>
          <ol style={{ margin: 0, padding: '0 0 0 18px' }}>
            {step.keyQuestions.map((q, i) => (
              <li
                key={i}
                style={{
                  fontSize: '13px',
                  color: 'var(--ink)',
                  fontFamily: 'sans-serif',
                  lineHeight: 1.6,
                  marginBottom: '10px',
                }}
              >
                {q}
              </li>
            ))}
          </ol>
        </div>

        {/* Tips */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: step.color,
              fontFamily: 'sans-serif',
              fontWeight: '600',
              marginBottom: '16px',
            }}
          >
            Pro Tips
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
            {step.tips.map((tip, i) => (
              <li
                key={i}
                style={{
                  fontSize: '13px',
                  color: 'var(--ink)',
                  fontFamily: 'sans-serif',
                  lineHeight: 1.6,
                  marginBottom: '10px',
                }}
              >
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Examples */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: step.color,
              fontFamily: 'sans-serif',
              fontWeight: '600',
              marginBottom: '16px',
            }}
          >
            Example Phrases
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {step.examples.map((ex, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 14px',
                  background: `${step.color}08`,
                  border: `1px solid ${step.color}20`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'var(--ink)',
                  fontFamily: 'sans-serif',
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}
              >
                {ex}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step progress indicators */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '16px 20px',
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '12px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', marginRight: '4px' }}>
          Framework path:
        </span>
        {FRAMEWORK_STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: s.id === step.id ? s.color : 'var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: s.id === step.id ? 'white' : 'var(--ink-muted)',
                fontFamily: 'sans-serif',
                fontWeight: '600',
                flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
            >
              {s.number}
            </div>
            <span
              style={{
                fontSize: '12px',
                color: s.id === step.id ? s.color : 'var(--ink-subtle)',
                fontFamily: 'sans-serif',
                fontWeight: s.id === step.id ? '600' : '400',
              }}
            >
              {s.title}
            </span>
            {i < FRAMEWORK_STEPS.length - 1 && (
              <span style={{ color: 'var(--border-strong)', fontSize: '12px', margin: '0 4px' }}>→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
