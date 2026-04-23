'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { FRAMEWORK_STEPS } from '@/lib/framework';
import { FrameworkStep } from '@/types';

export default function FrameworkPage() {
  const [activeStep, setActiveStep] = useState<string>(FRAMEWORK_STEPS[0].id);
  const step = FRAMEWORK_STEPS.find((s) => s.id === activeStep) ?? FRAMEWORK_STEPS[0];
  const activeIndex = FRAMEWORK_STEPS.findIndex((s) => s.id === activeStep);

  return (
    <AppShell>
      <div className="page-content animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div className="section-label">Study Guide</div>
          <h1
            style={{
              fontSize: '38px',
              fontWeight: '800',
              letterSpacing: '-0.04em',
              color: 'var(--navy)',
              margin: 0,
              lineHeight: 1.12,
            }}
          >
            The 5-Step Product<br />Sense Framework
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--ink-muted)',
              marginTop: '14px',
              maxWidth: '560px',
              lineHeight: 1.65,
            }}
          >
            A structured methodology for approaching any product question with clarity, depth, and strategic thinking.
          </p>
        </div>

        {/* Step selector */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            marginBottom: '28px',
            padding: '8px',
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {FRAMEWORK_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              style={{
                flex: 1,
                padding: '11px 8px',
                border: 'none',
                borderRadius: '10px',
                background: activeStep === s.id ? s.color : 'transparent',
                color: activeStep === s.id ? 'white' : 'var(--ink-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                boxShadow: activeStep === s.id ? `0 4px 12px ${s.color}40` : 'none',
              }}
            >
              <span style={{ fontSize: '18px', opacity: activeStep === s.id ? 1 : 0.45 }}>{s.icon}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: activeStep === s.id ? '700' : '400',
                  letterSpacing: '0.01em',
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

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px' }}>
          {activeIndex > 0 ? (
            <button
              onClick={() => setActiveStep(FRAMEWORK_STEPS[activeIndex - 1].id)}
              className="btn-secondary"
            >
              <ArrowLeft size={14} />
              Previous Step
            </button>
          ) : (
            <div />
          )}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/practice" className="btn-primary">
              <Zap size={14} />
              Practice This Framework
            </Link>
            {activeIndex < FRAMEWORK_STEPS.length - 1 && (
              <button
                onClick={() => setActiveStep(FRAMEWORK_STEPS[activeIndex + 1].id)}
                className="btn-secondary"
              >
                Next Step
                <ArrowRight size={14} />
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
          borderRadius: '18px',
          padding: '36px 40px',
          marginBottom: '20px',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${step.color}12 0%, ${step.color}04 100%)`,
          border: `1px solid ${step.color}20`,
          boxShadow: `0 4px 24px ${step.color}10`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            fontSize: '130px',
            opacity: 0.04,
            lineHeight: 1,
            fontFamily: 'Georgia, serif',
            userSelect: 'none',
          }}
        >
          {step.icon}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: step.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0,
              color: 'white',
              boxShadow: `0 4px 16px ${step.color}40`,
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
                fontWeight: '700',
                marginBottom: '6px',
              }}
            >
              Step {step.number} of {FRAMEWORK_STEPS.length}
            </div>
            <h2
              style={{
                fontSize: '26px',
                fontWeight: '800',
                letterSpacing: '-0.03em',
                color: 'var(--navy)',
                margin: '0 0 4px',
              }}
            >
              {step.title}
            </h2>
            <div style={{ fontSize: '14px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
              {step.subtitle}
            </div>
          </div>
        </div>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--ink)',
            lineHeight: 1.75,
            marginTop: '24px',
            marginBottom: 0,
            maxWidth: '680px',
          }}
        >
          {step.description}
        </p>
      </div>

      {/* Three columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '20px' }}>
        <div className="content-card">
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: step.color, fontWeight: '700', marginBottom: '16px' }}>
            Key Questions
          </div>
          <ol style={{ margin: 0, padding: '0 0 0 18px' }}>
            {step.keyQuestions.map((q, i) => (
              <li key={i} style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '10px' }}>
                {q}
              </li>
            ))}
          </ol>
        </div>

        <div className="content-card">
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: step.color, fontWeight: '700', marginBottom: '16px' }}>
            Pro Tips
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
            {step.tips.map((tip, i) => (
              <li key={i} style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '10px' }}>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="content-card">
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: step.color, fontWeight: '700', marginBottom: '16px' }}>
            Example Phrases
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {step.examples.map((ex, i) => (
              <div
                key={i}
                style={{
                  padding: '11px 14px',
                  background: `${step.color}07`,
                  border: `1px solid ${step.color}18`,
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: 'var(--ink)',
                  lineHeight: 1.55,
                  fontStyle: 'italic',
                }}
              >
                {ex}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Framework path */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          padding: '14px 20px',
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          alignItems: 'center',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--ink-subtle)', marginRight: '6px', fontWeight: '500' }}>
          Framework path:
        </span>
        {FRAMEWORK_STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: s.id === step.id ? s.color : 'var(--surface-raised)',
                border: `1px solid ${s.id === step.id ? s.color : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: s.id === step.id ? 'white' : 'var(--ink-muted)',
                fontWeight: '600',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                boxShadow: s.id === step.id ? `0 2px 8px ${s.color}40` : 'none',
              }}
            >
              {s.number}
            </div>
            <span
              style={{
                fontSize: '12px',
                color: s.id === step.id ? s.color : 'var(--ink-subtle)',
                fontWeight: s.id === step.id ? '600' : '400',
              }}
            >
              {s.title}
            </span>
            {i < FRAMEWORK_STEPS.length - 1 && (
              <span style={{ color: 'var(--border-strong)', fontSize: '11px', margin: '0 2px' }}>→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
