'use client';

import { useState, useMemo } from 'react';

type Modo = 'markup' | 'margem' | 'preco';

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Home() {
  const [modo, setModo] = useState<Modo>('markup');
  const [custoProduto, setCustoProduto] = useState<string>('');
  const [despesasFixas, setDespesasFixas] = useState<string>('15');
  const [despesasVarPct, setDespesasVarPct] = useState<string>('10');
  const [lucroDesejado, setLucroDesejado] = useState<string>('20');
  const [precoVenda, setPrecoVenda] = useState<string>('');
  const [markupInput, setMarkupInput] = useState<string>('');

  const custo = parseFloat(custoProduto.replace(',', '.')) || 0;
  const despFixas = parseFloat(despesasFixas.replace(',', '.')) || 0;
  const despVar = parseFloat(despesasVarPct.replace(',', '.')) || 0;
  const lucro = parseFloat(lucroDesejado.replace(',', '.')) || 0;
  const preco = parseFloat(precoVenda.replace(',', '.')) || 0;
  const markupIn = parseFloat(markupInput.replace(',', '.')) || 0;

  const resultado = useMemo(() => {
    if (modo === 'markup') {
      if (custo <= 0) return null;
      const totalDespesas = despFixas + despVar + lucro;
      if (totalDespesas >= 100) return { error: 'Total de despesas + lucro deve ser menor que 100%' };
      const divisor = 1 - (totalDespesas / 100);
      const precoCalculado = custo / divisor;
      const markup = ((precoCalculado - custo) / custo) * 100;
      const lucroRS = precoCalculado * (lucro / 100);
      return { precoVenda: precoCalculado, markup, margemLucro: lucro, lucroRS, despFixasRS: precoCalculado * (despFixas / 100), despVarRS: precoCalculado * (despVar / 100) };
    } else if (modo === 'margem') {
      if (custo <= 0 || preco <= 0 || preco <= custo) return null;
      const lucroRS = preco - custo - (preco * despFixas / 100) - (preco * despVar / 100);
      const margemLucro = (lucroRS / preco) * 100;
      const markup = ((preco - custo) / custo) * 100;
      return { precoVenda: preco, markup, margemLucro, lucroRS, despFixasRS: preco * despFixas / 100, despVarRS: preco * despVar / 100 };
    } else {
      if (custo <= 0 || markupIn <= 0) return null;
      const precoCalculado = custo * (1 + markupIn / 100);
      const lucroRS = precoCalculado - custo - (precoCalculado * despFixas / 100) - (precoCalculado * despVar / 100);
      const margemLucro = (lucroRS / precoCalculado) * 100;
      return { precoVenda: precoCalculado, markup: markupIn, margemLucro, lucroRS, despFixasRS: precoCalculado * despFixas / 100, despVarRS: precoCalculado * despVar / 100 };
    }
  }, [modo, custo, despFixas, despVar, lucro, preco, markupIn]);

  const modos = [
    { value: 'markup', label: 'Calcular Preço', desc: 'Quanto devo cobrar?', icon: '🎯' },
    { value: 'margem', label: 'Analisar Preço', desc: 'Qual meu lucro atual?', icon: '📊' },
    { value: 'preco', label: 'Aplicar Markup', desc: 'Definir % de markup', icon: '📈' },
  ];

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-white relative overflow-hidden">
      {/* Luxury ambient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Top accent line */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      {/* Header */}
      <header className="relative z-10 pt-16 pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-amber-400/80 text-xs font-medium tracking-widest uppercase">Calculadora</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Preço de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Venda</span>
          </h1>
          <p className="text-white/40 text-lg">
            Calcule o preço ideal para lucrar de verdade
          </p>
        </div>
      </header>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-20">
        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {modos.map((m) => (
            <button
              key={m.value}
              onClick={() => setModo(m.value as Modo)}
              className={`relative p-5 rounded-2xl text-left transition-all duration-300 group ${
                modo === m.value
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-2 border-amber-500/30'
                  : 'bg-white/[0.02] border-2 border-white/5 hover:border-white/10'
              }`}
            >
              <span className="text-2xl block mb-2">{m.icon}</span>
              <span className={`font-semibold block text-sm ${modo === m.value ? 'text-amber-400' : 'text-white/70'}`}>
                {m.label}
              </span>
              <span className="text-white/30 text-xs">{m.desc}</span>
              {modo === m.value && (
                <div className="absolute top-3 right-3 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Calculator */}
        <div className="bg-white/[0.02] backdrop-blur border border-white/10 rounded-3xl p-8 mb-8">
          <div className="space-y-6">
            {/* Cost Input - Always visible */}
            <div>
              <label className="block text-white/30 text-xs uppercase tracking-widest mb-3">
                Custo do Produto
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500 text-lg">R$</span>
                <input
                  type="text"
                  value={custoProduto}
                  onChange={(e) => setCustoProduto(e.target.value)}
                  placeholder="0,00"
                  className="w-full pl-14 pr-6 py-4 text-2xl font-bold bg-black/30 border-2 border-white/10 rounded-xl focus:border-amber-500/50 outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Expenses */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/30 text-xs uppercase tracking-widest mb-3">
                  Despesas Fixas (%)
                </label>
                <input
                  type="text"
                  value={despesasFixas}
                  onChange={(e) => setDespesasFixas(e.target.value)}
                  className="w-full px-5 py-3 bg-black/30 border-2 border-white/10 rounded-xl focus:border-amber-500/50 outline-none transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-white/30 text-xs uppercase tracking-widest mb-3">
                  Despesas Variáveis (%)
                </label>
                <input
                  type="text"
                  value={despesasVarPct}
                  onChange={(e) => setDespesasVarPct(e.target.value)}
                  className="w-full px-5 py-3 bg-black/30 border-2 border-white/10 rounded-xl focus:border-amber-500/50 outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Mode-specific input */}
            {modo === 'markup' && (
              <div className="pt-4 border-t border-white/10">
                <label className="block text-amber-400 text-xs uppercase tracking-widest mb-3">
                  Lucro Desejado (%)
                </label>
                <input
                  type="text"
                  value={lucroDesejado}
                  onChange={(e) => setLucroDesejado(e.target.value)}
                  className="w-full px-5 py-4 text-xl font-bold bg-amber-500/10 border-2 border-amber-500/30 rounded-xl focus:border-amber-500 outline-none transition-all font-mono text-amber-400"
                />
              </div>
            )}

            {modo === 'margem' && (
              <div className="pt-4 border-t border-white/10">
                <label className="block text-amber-400 text-xs uppercase tracking-widest mb-3">
                  Preço de Venda Atual (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500">R$</span>
                  <input
                    type="text"
                    value={precoVenda}
                    onChange={(e) => setPrecoVenda(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-14 pr-6 py-4 text-xl font-bold bg-amber-500/10 border-2 border-amber-500/30 rounded-xl focus:border-amber-500 outline-none transition-all font-mono text-amber-400"
                  />
                </div>
              </div>
            )}

            {modo === 'preco' && (
              <div className="pt-4 border-t border-white/10">
                <label className="block text-amber-400 text-xs uppercase tracking-widest mb-3">
                  Markup Desejado (%)
                </label>
                <input
                  type="text"
                  value={markupInput}
                  onChange={(e) => setMarkupInput(e.target.value)}
                  placeholder="100"
                  className="w-full px-5 py-4 text-xl font-bold bg-amber-500/10 border-2 border-amber-500/30 rounded-xl focus:border-amber-500 outline-none transition-all font-mono text-amber-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {resultado && !('error' in resultado) && (
          <>
            {/* Price Hero */}
            <div className="relative bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/20 rounded-3xl p-8 mb-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <p className="text-white/40 text-sm uppercase tracking-widest mb-2">Preço de Venda Ideal</p>
                <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                  {formatCurrency(resultado.precoVenda)}
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Markup', value: `${resultado.markup.toFixed(1)}%`, color: 'text-white' },
                { label: 'Margem', value: `${resultado.margemLucro.toFixed(1)}%`, color: 'text-white' },
                { label: 'Lucro', value: formatCurrency(resultado.lucroRS), color: 'text-emerald-400' },
                { label: 'Desp. Total', value: formatCurrency(resultado.despFixasRS + resultado.despVarRS), color: 'text-rose-400' },
              ].map((metric) => (
                <div key={metric.label} className="bg-white/[0.02] border border-white/10 rounded-2xl p-5">
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-1">{metric.label}</p>
                  <p className={`text-xl font-bold font-mono ${metric.color}`}>{metric.value}</p>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <h3 className="font-semibold text-white/70">Composição do Preço</h3>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { label: 'Custo do produto', value: formatCurrency(custo), type: 'neutral' },
                  { label: `Despesas fixas (${despFixas}%)`, value: formatCurrency(resultado.despFixasRS), type: 'expense' },
                  { label: `Despesas variáveis (${despVar}%)`, value: formatCurrency(resultado.despVarRS), type: 'expense' },
                  { label: 'Lucro líquido', value: formatCurrency(resultado.lucroRS), type: 'profit' },
                ].map((row) => (
                  <div key={row.label} className={`flex justify-between items-center px-5 py-4 ${row.type === 'profit' ? 'bg-emerald-500/5' : ''}`}>
                    <span className="text-white/50">{row.label}</span>
                    <span className={`font-mono font-semibold ${
                      row.type === 'profit' ? 'text-emerald-400' : row.type === 'expense' ? 'text-white/40' : 'text-white'
                    }`}>
                      {row.type === 'expense' ? `- ${row.value}` : row.value}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center px-5 py-5 bg-amber-500/10">
                  <span className="font-semibold text-amber-400">PREÇO DE VENDA</span>
                  <span className="font-mono font-bold text-xl text-amber-400">{formatCurrency(resultado.precoVenda)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {resultado && 'error' in resultado && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 text-rose-400">
            ⚠️ {resultado.error}
          </div>
        )}

        {/* Empty state */}
        {!resultado && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center text-4xl">
              💰
            </div>
            <p className="text-white/40">Digite o custo do produto para calcular</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-white/20 text-sm">
            Calculadora de Preço © 2026 • Ferramenta informativa
          </p>
        </footer>
      </div>
    </main>
  );
}
