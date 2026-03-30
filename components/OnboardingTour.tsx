'use client';

import { useState, useEffect } from 'react';

const STEPS = [
  {
    emoji: '✈️',
    title: 'Bem-vindo ao Family Trip Manager!',
    description:
      'Aqui você organiza todos os detalhes da viagem da sua família para Orlando. Vamos fazer um tour rápido pelas principais funcionalidades.',
    image: null,
  },
  {
    emoji: '🏠',
    title: 'Dashboard',
    description:
      'Seu painel central mostra a contagem regressiva para a viagem, status dos voos, hotel, documentos e orçamento. Tudo num só lugar para acompanhar o progresso.',
    image: null,
  },
  {
    emoji: '👨‍👩‍👦',
    title: 'Família',
    description:
      'Cadastre todos os viajantes com nome, idade e altura. Isso ajuda a personalizar dicas de atrações, restaurantes e o que levar na mala para cada membro da família.',
    image: null,
  },
  {
    emoji: '✈️',
    title: 'Voos, Hotel e Carro',
    description:
      'Registre seus voos de ida e volta, dados do hotel e aluguel de carro. As datas dos voos alimentam automaticamente a contagem regressiva e a agenda.',
    image: null,
  },
  {
    emoji: '🏰',
    title: 'Guia dos Parques',
    description:
      'Acesse dicas detalhadas para cada parque: atrações por idade, sugestões de roteiro, horários estratégicos e restaurantes dentro e fora dos parques.',
    image: null,
  },
  {
    emoji: '💰',
    title: 'Orçamento e Gastos',
    description:
      'Defina seu orçamento por categoria (alimentação, ingressos, compras...) e registre cada gasto. Acompanhe em reais e dólares com câmbio configurável.',
    image: null,
  },
  {
    emoji: '📋',
    title: 'Documentos e Checklists',
    description:
      'Acompanhe passaportes, vistos e seguros de todos os viajantes. Use os checklists de mala, mochila de parque e compras para não esquecer nada.',
    image: null,
  },
  {
    emoji: '🎉',
    title: 'Tudo pronto!',
    description:
      'Comece cadastrando sua família e adicionando os voos. O restante você preenche no seu ritmo. Boa viagem!',
    image: null,
  },
];

const ONBOARDING_KEY = 'family-trip-onboarding-completed';

export default function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) {
      setVisible(true);
    }
  }, []);

  function close() {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setVisible(false);
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      close();
    }
  }

  function prev() {
    if (step > 0) setStep(step - 1);
  }

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        padding: '20px',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          maxWidth: '480px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Header gradient */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--ocean), var(--sky))',
            padding: '40px 32px 32px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Skip button */}
          <button
            onClick={close}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'sans-serif',
              fontWeight: '500',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
          >
            Pular tour
          </button>

          <div style={{ fontSize: '56px', marginBottom: '12px', lineHeight: 1 }}>
            {current.emoji}
          </div>
          <h2
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: 'white',
              margin: 0,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
            }}
          >
            {current.title}
          </h2>
        </div>

        {/* Content */}
        <div style={{ padding: '28px 32px 24px' }}>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--ink-muted)',
              fontFamily: 'sans-serif',
              lineHeight: 1.7,
              margin: 0,
              textAlign: 'center',
            }}
          >
            {current.description}
          </p>
        </div>

        {/* Progress dots + nav */}
        <div
          style={{
            padding: '0 32px 28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Dots */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                aria-label={`Etapa ${i + 1}`}
                style={{
                  width: i === step ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === step ? 'var(--ocean)' : 'var(--border)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            {!isFirst && (
              <button
                onClick={prev}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'var(--background)',
                  color: 'var(--ink-muted)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'sans-serif',
                  transition: 'all 0.2s',
                }}
              >
                Voltar
              </button>
            )}
            <button
              onClick={next}
              style={{
                flex: isFirst ? undefined : 1,
                width: isFirst ? '100%' : undefined,
                padding: '14px',
                background: 'var(--ocean)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                transition: 'all 0.2s',
              }}
            >
              {isLast ? 'Começar a planejar!' : isFirst ? 'Iniciar tour' : 'Próximo'}
            </button>
          </div>

          {/* Step counter */}
          <div
            style={{
              fontSize: '12px',
              color: 'var(--ink-subtle)',
              fontFamily: 'sans-serif',
            }}
          >
            {step + 1} de {STEPS.length}
          </div>
        </div>
      </div>
    </div>
  );
}
