/** Компактная экзаменная шпаргалка (~1 лист A4 landscape). theoryId — ссылка на тему. */
export const cheatsheetCompact = [
  { theoryId: 35, title: 'Выборочное среднее и дисперсия', lines: ['$\\bar X=\\frac1n\\sum X_i$', '$S^2=\\frac1{n-1}\\sum(X_i-\\bar X)^2$'] },
  { theoryId: 7, title: 'Несмещённая дисперсия', lines: ['$E[S^2]=\\sigma^2$', 'делитель $n-1$'] },
  { theoryId: 20, title: 'Критерий гипотез', lines: ['$T\\in S\\Rightarrow$ отвергаем $H_0$', '$P_{H_0}(T\\in S)\\le\\alpha$'] },
  { theoryId: 21, title: 'Ошибки I/II рода', lines: ['$\\alpha$ — ложная тревога', '$\\beta$ — пропуск; мощность $1-\\beta$'] },
  { theoryId: 22, title: 'Критическая область', lines: ['$H_0:\\theta=\\theta_0$', 'при $X\\in S$ отвергаем $H_0$'] },
  { theoryId: 23, title: 'z-критерий', lines: ['$Z=\\frac{\\bar X-\\mu_0}{\\sigma/\\sqrt n}\\sim N(0,1)$', '$\\sigma^2$ известна'] },
  { theoryId: 24, title: 't-критерий', lines: ['$t=\\frac{\\bar X-\\mu_0}{S/\\sqrt n}\\sim T_{n-1}$', '$\\sigma^2$ неизвестна'] },
  { theoryId: 25, title: 'ДИ и тест', lines: ['$\\theta_0\\notin[\\underline\\theta,\\overline\\theta]\\Leftrightarrow$ отвергаем $H_0$'] },
  { theoryId: 30, title: 'ДИ для $\\mu$', lines: ['$\\bar X\\pm z_{1-\\alpha/2}\\frac{\\sigma}{\\sqrt n}$', 'или $t$ при неизвестной $\\sigma^2$'] },
  { theoryId: 32, title: 'Уровень доверия', lines: ['$P(\\theta\\in[\\underline\\theta,\\overline\\theta])\\ge 1-\\alpha$'] },
  { theoryId: 13, title: 'Критерий согласия', lines: ['$H_0:F=F_0$', 'данные vs заявленный закон'] },
  { theoryId: 27, title: 'Колмогоров', lines: ['$D_n=\\sup|F_n-F_0|$', '$\\sqrt n\\,D_n$; $F_0$ задана полностью'] },
  { theoryId: 28, title: 'Пирсон $\\chi^2$', lines: ['$\\chi^2=\\sum\\frac{(n_i-np_i)^2}{np_i}$', '$df=k-1-r$'] },
  { theoryId: 14, title: 'Схема согласия', lines: ['$D=\\rho(F_n,F_0)$', '$D>D_{\\text{кр}}\\Rightarrow$ отвергаем'] },
  { theoryId: 11, title: 'Метод моментов', lines: ['$\\alpha_k(\\theta)=\\widehat\\alpha_k$', 'решить систему'] },
  { theoryId: 1, title: 'ЭФР $F_n$', lines: ['ступеньки по $X_{(i)}$', '$F_n\\to F$ (Гливенко–Кантелли)'] },
  { theoryId: 3, title: 'Гистограмма', lines: ['площадь столбца = доля', '$h_i=n_i/(n\\Delta_i)$'] },
  { theoryId: 36, title: 'Регрессия', lines: ['$Y=\\beta_0+\\beta_1 x+\\varepsilon$', 'МНК: $\\min\\sum(Y_i-\\hat Y_i)^2$'] },
  { theoryId: 39, title: 'Корреляция', lines: ['$r=\\widehat{\\mathrm{cov}}/(S_x S_y)$', '$-1\\le r\\le 1$'] },
  { theoryId: 19, title: 'Рао–Крамера', lines: ['$D\\hat\\theta\\ge 1/I_n(\\theta)$', 'нижняя грань дисперсии'] },
  { theoryId: 18, title: 'Фишер $I(\\theta)$', lines: ['$I(\\theta)=-E\\frac{\\partial^2}{\\partial\\theta^2}\\ln L$'] },
  { theoryId: 5, title: 'Выборочные моменты', lines: ['$\\widehat\\alpha_k=\\frac1n\\sum X_i^k$'] },
  { theoryId: 9, title: 'Медиана', lines: ['$\\hat m_e=X_{(\\lceil n/2\\rceil)}$'] },
  { theoryId: 10, title: 'Квантиль', lines: ['$F(\\hat x_p)\\approx p$'] },
]

export function compactItemsFromTheory(theoryList) {
  const byId = Object.fromEntries(theoryList.map((t) => [t.id, t]))
  return cheatsheetCompact.map((c) => {
    const t = byId[c.theoryId]
    return {
      ...c,
      mnemonic: t?.mnemonic || '',
      formulas: c.lines,
    }
  })
}
