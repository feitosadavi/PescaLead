# ADR-0008 — Regra de prioridade e cobrança v1

- Estado: Aceita.
- Data: 2026-11-17.
- Responsável pela escolha técnica: Codex, durante a implementação autorizada pelo usuário.
- Substitui: [ADR-0004](0004-prioridade-explicavel.md).
- Implementação: [prospecting.ts](../../src/domain/prospecting.ts).

## Contexto

Sem histórico de vendas, não há base para probabilidade estatística de fechamento. O ranking precisa ser útil e auditável desde a primeira versão, sem apresentar margem, ticket ou acesso ao proprietário como fatos não confirmados.

## Decisão

Adotar regra versionada 1.0.0, com pontuação até 100, calculada pelo código e explicada ao usuário:

| Fator | Pontos |
| --- | --- |
| Margem estimada de implantação | min(25, arredondar(margem em R$ / 200)) |
| Margem potencial mensal | min(15, arredondar(margem mensal em R$ / 20)) |
| Contato comercial informado | 15 ou 0 |
| Site informado para investigar | 10 ou 0 |
| Acesso ao decisor | 20 se confirmado; 0 se há marca de rede; 7 como hipótese em outros casos |
| Menor esforço inicial | 10 até 80 h; 5 até 160 h; 0 acima |
| Endereço informado | 5 ou 0 |

Os 7 pontos para negócio sem marca são um sinal heurístico explícito, sem confirmar o acesso. A confiança é calculada separadamente pela disponibilidade de telefone, site, endereço, horários e confirmação do decisor: 4 ou 5 campos = Maior; 2 ou 3 = Moderada; menos de 2 = Baixa. Não mede confiabilidade estatística das fontes.

Prioridade manual (Priorizar/Automática/Depois) vem antes do score; empates usam distância e ID. Valores de ticket são estimativas do projeto sugerido, não orçamento conhecido do cliente. Avaliações não entram na versão 1 porque a fonte inicial não as fornece; adicionar esse sinal exige decisão futura e fonte compatível.

Cobrança sugerida: soma de horas × custo/hora ÷ (1 − margem/100), arredondada para cima em dezenas de reais. Aplicar o mesmo cálculo às horas mensais estimadas. Parâmetros iniciais editáveis: R$ 80/h e 35% de margem. Margem não é markup. Infraestrutura e licenças não estão incluídas. Todo valor pode ser revisado na proposta e valores inválidos são rejeitados.

## Alternativas consideradas

Ranking somente por avaliação não está disponível na fonte adotada e não comprova capacidade de investimento. Ordenar somente por preço ignora esforço e manutenção. Um modelo preditivo sem dados de fechamento não seria validável.

## Consequências

A regra privilegia informação útil para contato e projetos com margem potencial. Não comprova demanda ou intenção de compra. Preços e ranking mudam quando escopo, custo/hora ou margem são revisados. A seleção inicial por regras pode limitar quais candidatos recebem análise de IA; a interface informa que a cobertura é parcial.

## Funcionalidades e código relacionados

- [F003](../features/F003-descoberta-e-selecao.md)
- [F006](../features/F006-analise-inicial-ia.md)
- [F007](../features/F007-priorizacao-comercial.md)
- [F008](../features/F008-analise-detalhada-e-cobranca.md)
- [F015](../features/F015-configuracoes-cotas-e-custos.md)
- [Regra de cálculo e ordenação](../../src/domain/prospecting.ts): scoreLead, rankLeads, estimate e parseAmount.
- [Testes de regras](../../tests/domain.test.ts).

## Validação e revisão

Validar com o usuário a utilidade da ordenação e calibrar quando houver negócios reais ganhos/perdidos. Não alterar pesos silenciosamente: atualizar versão, histórico da funcionalidade e ADR. Testes cobrem cálculo de margem, fatores somáveis, prioridade manual e ausência de probabilidade inventada.

## Histórico

| Data | Decisão | Origem |
| --- | --- | --- |
| 2026-11-17 | Implementada e documentada a fórmula inicial, com limites e parâmetros editáveis. | Avaliação caso a caso delegada pelo usuário e pedido de implementação. |
