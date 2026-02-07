'use client';

import { useState, useMemo } from 'react';

type Modo = 'markup' | 'margem' | 'preco';

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatPercent(value: number): string {
  return value.toFixed(2) + '%';
}

export default function Home() {
  const [modo, setModo] = useState<Modo>('markup');
  
  // Inputs
  const [custoProduto, setCustoProduto] = useState<string>('');
  const [despesasFixas, setDespesasFixas] = useState<string>('15'); // % sobre venda
  const [despesasVarPct, setDespesasVarPct] = useState<string>('10'); // % sobre venda (impostos, comissões)
  const [lucroDesejado, setLucroDesejado] = useState<string>('20'); // % sobre venda
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
      // Calcular preço de venda baseado no custo e percentuais desejados
      if (custo <= 0) return null;
      
      const totalDespesas = despFixas + despVar + lucro;
      if (totalDespesas >= 100) return { error: 'Total de despesas + lucro não pode ser ≥ 100%' };
      
      // Fórmula: Preço = Custo / (1 - (DF% + DV% + Lucro%) / 100)
      const divisor = 1 - (totalDespesas / 100);
      const precoCalculado = custo / divisor;
      const markup = ((precoCalculado - custo) / custo) * 100;
      const lucroRS = precoCalculado * (lucro / 100);
      const despFixasRS = precoCalculado * (despFixas / 100);
      const despVarRS = precoCalculado * (despVar / 100);
      
      return {
        precoVenda: precoCalculado,
        markup,
        margemLucro: lucro,
        lucroRS,
        despFixasRS,
        despVarRS,
        custoTotal: custo + despFixasRS + despVarRS,
      };
    } else if (modo === 'margem') {
      // Calcular margem de lucro baseado em preço e custo
      if (custo <= 0 || preco <= 0) return null;
      if (preco <= custo) return { error: 'Preço de venda deve ser maior que o custo' };
      
      const lucroRS = preco - custo - (preco * despFixas / 100) - (preco * despVar / 100);
      const margemLucro = (lucroRS / preco) * 100;
      const markup = ((preco - custo) / custo) * 100;
      
      return {
        precoVenda: preco,
        markup,
        margemLucro,
        lucroRS,
        despFixasRS: preco * despFixas / 100,
        despVarRS: preco * despVar / 100,
        custoTotal: custo + (preco * despFixas / 100) + (preco * despVar / 100),
      };
    } else {
      // Calcular preço baseado em markup desejado
      if (custo <= 0 || markupIn <= 0) return null;
      
      const precoCalculado = custo * (1 + markupIn / 100);
      const lucroRS = precoCalculado - custo - (precoCalculado * despFixas / 100) - (precoCalculado * despVar / 100);
      const margemLucro = (lucroRS / precoCalculado) * 100;
      
      return {
        precoVenda: precoCalculado,
        markup: markupIn,
        margemLucro,
        lucroRS,
        despFixasRS: precoCalculado * despFixas / 100,
        despVarRS: precoCalculado * despVar / 100,
        custoTotal: custo + (precoCalculado * despFixas / 100) + (precoCalculado * despVar / 100),
      };
    }
  }, [modo, custo, despFixas, despVar, lucro, preco, markupIn]);

  const modos = [
    { value: 'markup', label: 'Calcular Preço', icon: '🏷️', desc: 'Quanto cobrar?' },
    { value: 'margem', label: 'Analisar Preço', icon: '📊', desc: 'Qual meu lucro?' },
    { value: 'preco', label: 'Definir Markup', icon: '📈', desc: 'Aplicar markup fixo' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Header */}
      <div className="bg-orange-500 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            💰 Calculadora de Preço de Venda
          </h1>
          <p className="text-orange-100 text-lg">
            Calcule o preço ideal para seus produtos e serviços
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Modo Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            O que você quer calcular?
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {modos.map((m) => (
              <button
                key={m.value}
                onClick={() => setModo(m.value as Modo)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  modo === m.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{m.icon}</div>
                <div className="font-semibold">{m.label}</div>
                <div className="text-sm text-gray-500">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Preencha os dados
          </h2>

          <div className="space-y-6">
            {/* Custo do Produto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💵 Custo do produto/serviço (R$)
              </label>
              <input
                type="text"
                value={custoProduto}
                onChange={(e) => setCustoProduto(e.target.value)}
                placeholder="0,00"
                className="w-full px-4 py-3 text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Custo de aquisição ou produção
              </p>
            </div>

            {/* Despesas */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏢 Despesas fixas (% sobre venda)
                </label>
                <input
                  type="text"
                  value={despesasFixas}
                  onChange={(e) => setDespesasFixas(e.target.value)}
                  placeholder="15"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Aluguel, salários, etc.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📊 Despesas variáveis (% sobre venda)
                </label>
                <input
                  type="text"
                  value={despesasVarPct}
                  onChange={(e) => setDespesasVarPct(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Impostos, comissões, taxas
                </p>
              </div>
            </div>

            {/* Modo específico */}
            {modo === 'markup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 Lucro desejado (% sobre venda)
                </label>
                <input
                  type="text"
                  value={lucroDesejado}
                  onChange={(e) => setLucroDesejado(e.target.value)}
                  placeholder="20"
                  className="w-full px-4 py-3 text-xl font-bold border-2 border-green-200 rounded-xl focus:border-green-500 bg-green-50"
                />
              </div>
            )}

            {modo === 'margem' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏷️ Preço de venda atual (R$)
                </label>
                <input
                  type="text"
                  value={precoVenda}
                  onChange={(e) => setPrecoVenda(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-4 py-3 text-xl font-bold border-2 border-blue-200 rounded-xl focus:border-blue-500 bg-blue-50"
                />
              </div>
            )}

            {modo === 'preco' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📈 Markup desejado (%)
                </label>
                <input
                  type="text"
                  value={markupInput}
                  onChange={(e) => setMarkupInput(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 text-xl font-bold border-2 border-purple-200 rounded-xl focus:border-purple-500 bg-purple-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Markup de 100% = dobrar o preço
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {resultado && !('error' in resultado) && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <h3 className="text-xl font-bold mb-4 text-center">📊 Resultado</h3>
            
            <div className="bg-white/20 rounded-xl p-6 mb-4">
              <div className="text-center">
                <div className="text-sm opacity-75 mb-1">Preço de Venda Ideal</div>
                <div className="text-4xl font-bold">{formatCurrency(resultado.precoVenda)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-xs opacity-75">Markup</div>
                <div className="text-lg font-bold">{formatPercent(resultado.markup)}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-xs opacity-75">Margem de Lucro</div>
                <div className="text-lg font-bold">{formatPercent(resultado.margemLucro)}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-xs opacity-75">Lucro (R$)</div>
                <div className="text-lg font-bold">{formatCurrency(resultado.lucroRS)}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-xs opacity-75">Custo Total</div>
                <div className="text-lg font-bold">{formatCurrency(resultado.custoTotal)}</div>
              </div>
            </div>
          </div>
        )}

        {resultado && 'error' in resultado && (
          <div className="bg-red-100 border border-red-300 rounded-xl p-4 mb-8 text-red-700">
            ⚠️ {resultado.error}
          </div>
        )}

        {/* Composition Breakdown */}
        {resultado && !('error' in resultado) && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📋 Composição do Preço
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Custo do produto</span>
                <span className="font-semibold">{formatCurrency(custo)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Despesas fixas ({despFixas}%)</span>
                <span className="font-semibold text-red-600">- {formatCurrency(resultado.despFixasRS)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Despesas variáveis ({despVar}%)</span>
                <span className="font-semibold text-red-600">- {formatCurrency(resultado.despVarRS)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b bg-green-50 -mx-6 px-6">
                <span className="text-green-700 font-semibold">Lucro líquido</span>
                <span className="font-bold text-green-600">{formatCurrency(resultado.lucroRS)}</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-orange-50 -mx-6 px-6 rounded-b-xl">
                <span className="text-orange-700 font-bold">PREÇO DE VENDA</span>
                <span className="font-bold text-orange-600 text-xl">{formatCurrency(resultado.precoVenda)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">📈</span> O que é Markup?
            </h4>
            <p className="text-gray-600 text-sm">
              Markup é o percentual adicionado ao custo para formar o preço de venda. 
              Um markup de 100% significa que você dobra o custo.
            </p>
            <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm">
              <strong>Fórmula:</strong> Markup = ((Preço - Custo) / Custo) × 100
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span> O que é Margem?
            </h4>
            <p className="text-gray-600 text-sm">
              Margem de lucro é o percentual do preço de venda que representa seu lucro. 
              Uma margem de 20% significa que de cada R$100 vendido, R$20 é lucro.
            </p>
            <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm">
              <strong>Fórmula:</strong> Margem = (Lucro / Preço) × 100
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">
            🧮 É MEI? Calcule seus impostos!
          </h3>
          <p className="text-orange-100 mb-6">
            Descubra quanto você paga de DAS e se vale a pena ser MEI.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://curva-abc-app.vercel.app"
              target="_blank"
              className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
            >
              🎯 Curva ABC
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Calculadora de Preço © 2025</p>
          <p className="mt-1">
            Esta ferramenta é informativa. Consulte um contador para precificação estratégica.
          </p>
        </footer>
      </div>
    </main>
  );
}
