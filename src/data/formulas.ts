import type { Formula } from '../types';

export const formulas: Formula[] = [
  // ---------- ALGEBRA & PRECALCULUS ----------
  {
    id: 'alg-quadratic',
    category: 'algebra',
    label: 'x=(-b±√Δ)/2a',
    title: 'Quadratic Formula',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    variables: [
      { symbol: 'a, b, c', meaning: 'Coefficients of ax² + bx + c = 0' },
      { symbol: 'x', meaning: 'Roots of the equation' },
    ],
    related: ['alg-distance', 'geo-pythagorean'],
    keywords: ['roots', 'discriminant', 'polynomial'],
    calc: {
      vars: [
        { key: 'a', symbol: 'a' },
        { key: 'b', symbol: 'b' },
        { key: 'c', symbol: 'c' },
        { key: 'x', symbol: 'x' },
      ],
      residual: (v) => v.a * v.x * v.x + v.b * v.x + v.c,
    },
  },
  {
    id: 'alg-slope',
    category: 'algebra',
    label: 'm=Δy/Δx',
    title: 'Slope Formula',
    latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
    variables: [
      { symbol: 'm', meaning: 'Slope of the line' },
      { symbol: '(x₁,y₁), (x₂,y₂)', meaning: 'Two points on the line' },
    ],
    related: ['alg-point-slope', 'alg-distance'],
    calc: {
      vars: [
        { key: 'm', symbol: 'm' },
        { key: 'x1', symbol: 'x₁' },
        { key: 'y1', symbol: 'y₁' },
        { key: 'x2', symbol: 'x₂' },
        { key: 'y2', symbol: 'y₂' },
      ],
      residual: (v) => v.m * (v.x2 - v.x1) - (v.y2 - v.y1),
    },
  },
  {
    id: 'alg-point-slope',
    category: 'algebra',
    label: 'y-y₁=m(x-x₁)',
    title: 'Point-Slope Form',
    latex: 'y - y_1 = m(x - x_1)',
    variables: [
      { symbol: 'm', meaning: 'Slope of the line' },
      { symbol: '(x₁,y₁)', meaning: 'A known point on the line' },
    ],
    related: ['alg-slope'],
    calc: {
      vars: [
        { key: 'y', symbol: 'y' },
        { key: 'y1', symbol: 'y₁' },
        { key: 'm', symbol: 'm' },
        { key: 'x', symbol: 'x' },
        { key: 'x1', symbol: 'x₁' },
      ],
      residual: (v) => (v.y - v.y1) - v.m * (v.x - v.x1),
    },
  },
  {
    id: 'alg-exp-growth',
    category: 'algebra',
    label: 'A=A₀eᵏᵗ',
    title: 'Exponential Growth / Decay',
    latex: 'A(t) = A_0 e^{kt}',
    variables: [
      { symbol: 'A₀', meaning: 'Initial amount' },
      { symbol: 'k', meaning: 'Growth (k>0) or decay (k<0) rate' },
      { symbol: 't', meaning: 'Time' },
    ],
    related: ['chem-half-life', 'alg-compound-interest'],
    calc: {
      vars: [
        { key: 'A', symbol: 'A' },
        { key: 'A0', symbol: 'A₀' },
        { key: 'k', symbol: 'k' },
        { key: 't', symbol: 't' },
      ],
      residual: (v) => v.A - v.A0 * Math.exp(v.k * v.t),
    },
  },
  {
    id: 'alg-compound-interest',
    category: 'algebra',
    label: 'A=P(1+r/n)ⁿᵗ',
    title: 'Compound Interest',
    latex: 'A = P\\left(1 + \\frac{r}{n}\\right)^{nt}',
    variables: [
      { symbol: 'P', meaning: 'Principal amount' },
      { symbol: 'r', meaning: 'Annual interest rate' },
      { symbol: 'n', meaning: 'Compounding periods per year' },
      { symbol: 't', meaning: 'Time in years' },
    ],
    related: ['alg-exp-growth'],
    calc: {
      vars: [
        { key: 'A', symbol: 'A' },
        { key: 'P', symbol: 'P' },
        { key: 'r', symbol: 'r' },
        { key: 'n', symbol: 'n' },
        { key: 't', symbol: 't' },
      ],
      residual: (v) => v.A - v.P * Math.pow(1 + v.r / v.n, v.n * v.t),
    },
  },
  {
    id: 'alg-log-change-base',
    category: 'algebra',
    label: 'logᵦx=ln x/ln b',
    title: 'Change of Base Formula',
    latex: '\\log_b x = \\frac{\\ln x}{\\ln b}',
    variables: [
      { symbol: 'b', meaning: 'Original base' },
      { symbol: 'x', meaning: 'Argument of the logarithm' },
    ],
    calc: {
      vars: [
        { key: 'y', symbol: 'logᵦx' },
        { key: 'b', symbol: 'b' },
        { key: 'x', symbol: 'x' },
      ],
      residual: (v) => v.y - Math.log(v.x) / Math.log(v.b),
    },
  },
  {
    id: 'alg-binomial-theorem',
    category: 'algebra',
    label: '(a+b)ⁿ=ΣC(n,k)',
    title: 'Binomial Theorem',
    latex: '(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^{k}',
    variables: [
      { symbol: 'n', meaning: 'Power / exponent' },
      { symbol: 'C(n,k)', meaning: 'Binomial coefficient, "n choose k"' },
    ],
    related: ['alg-combination'],
  },
  {
    id: 'alg-distance',
    category: 'algebra',
    label: 'd=√(Δx²+Δy²)',
    title: 'Distance Formula',
    latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}',
    variables: [
      { symbol: '(x₁,y₁), (x₂,y₂)', meaning: 'Two points in the plane' },
    ],
    related: ['geo-pythagorean', 'alg-midpoint'],
    calc: {
      vars: [
        { key: 'd', symbol: 'd' },
        { key: 'x1', symbol: 'x₁' },
        { key: 'y1', symbol: 'y₁' },
        { key: 'x2', symbol: 'x₂' },
        { key: 'y2', symbol: 'y₂' },
      ],
      residual: (v) => v.d - Math.sqrt((v.x2 - v.x1) ** 2 + (v.y2 - v.y1) ** 2),
    },
  },
  {
    id: 'alg-arithmetic-series',
    category: 'algebra',
    label: 'Sₙ=n/2(a₁+aₙ)',
    title: 'Arithmetic Series Sum',
    latex: 'S_n = \\frac{n}{2}(a_1 + a_n)',
    variables: [
      { symbol: 'n', meaning: 'Number of terms' },
      { symbol: 'a₁, aₙ', meaning: 'First and last term' },
    ],
    related: ['alg-geometric-series'],
    calc: {
      vars: [
        { key: 'Sn', symbol: 'Sₙ' },
        { key: 'n', symbol: 'n' },
        { key: 'a1', symbol: 'a₁' },
        { key: 'an', symbol: 'aₙ' },
      ],
      residual: (v) => v.Sn - (v.n / 2) * (v.a1 + v.an),
    },
  },
  {
    id: 'alg-geometric-series',
    category: 'algebra',
    label: 'Sₙ=a₁(1-rⁿ)/(1-r)',
    title: 'Geometric Series Sum',
    latex: 'S_n = \\frac{a_1(1-r^n)}{1-r}',
    variables: [
      { symbol: 'a₁', meaning: 'First term' },
      { symbol: 'r', meaning: 'Common ratio' },
      { symbol: 'n', meaning: 'Number of terms' },
    ],
    related: ['alg-arithmetic-series'],
    calc: {
      vars: [
        { key: 'Sn', symbol: 'Sₙ' },
        { key: 'a1', symbol: 'a₁' },
        { key: 'r', symbol: 'r' },
        { key: 'n', symbol: 'n' },
      ],
      residual: (v) => v.Sn - (v.a1 * (1 - Math.pow(v.r, v.n))) / (1 - v.r),
    },
  },
  {
    id: 'alg-combination',
    category: 'algebra',
    label: 'C(n,k)=n!/(k!(n-k)!)',
    title: 'Combinations',
    latex: '\\binom{n}{k} = \\frac{n!}{k!(n-k)!}',
    variables: [
      { symbol: 'n', meaning: 'Total number of items' },
      { symbol: 'k', meaning: 'Items chosen' },
    ],
    related: ['alg-binomial-theorem', 'calc-binomial-prob'],
  },
  {
    id: 'alg-midpoint',
    category: 'algebra',
    label: 'M=((x₁+x₂)/2,…)',
    title: 'Midpoint Formula',
    latex: 'M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)',
    variables: [
      { symbol: '(x₁,y₁), (x₂,y₂)', meaning: 'Endpoints of a segment' },
    ],
    related: ['alg-distance'],
  },

  // ---------- GEOMETRY & TRIGONOMETRY ----------
  {
    id: 'geo-pythagorean',
    category: 'geometry',
    label: 'a²+b²=c²',
    title: 'Pythagorean Theorem',
    latex: 'a^2 + b^2 = c^2',
    variables: [
      { symbol: 'a, b', meaning: 'Legs of a right triangle' },
      { symbol: 'c', meaning: 'Hypotenuse' },
    ],
    related: ['alg-distance', 'geo-law-cosines'],
    calc: {
      vars: [
        { key: 'a', symbol: 'a' },
        { key: 'b', symbol: 'b' },
        { key: 'c', symbol: 'c' },
      ],
      residual: (v) => v.a * v.a + v.b * v.b - v.c * v.c,
    },
  },
  {
    id: 'geo-law-cosines',
    category: 'geometry',
    label: 'c²=a²+b²-2ab cosC',
    title: 'Law of Cosines',
    latex: 'c^2 = a^2 + b^2 - 2ab\\cos(C)',
    variables: [
      { symbol: 'a, b, c', meaning: 'Triangle side lengths' },
      { symbol: 'C', meaning: 'Angle opposite side c' },
    ],
    related: ['geo-pythagorean', 'geo-law-sines'],
    calc: {
      vars: [
        { key: 'a', symbol: 'a' },
        { key: 'b', symbol: 'b' },
        { key: 'c', symbol: 'c' },
        { key: 'C', symbol: 'C (deg)' },
      ],
      residual: (v) => v.c * v.c - (v.a * v.a + v.b * v.b - 2 * v.a * v.b * Math.cos((v.C * Math.PI) / 180)),
    },
  },
  {
    id: 'geo-law-sines',
    category: 'geometry',
    label: 'a/sinA=b/sinB',
    title: 'Law of Sines',
    latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}',
    variables: [
      { symbol: 'a, b, c', meaning: 'Triangle side lengths' },
      { symbol: 'A, B, C', meaning: 'Angles opposite each side' },
    ],
    related: ['geo-law-cosines'],
    calc: {
      vars: [
        { key: 'a', symbol: 'a' },
        { key: 'A', symbol: 'A (deg)' },
        { key: 'b', symbol: 'b' },
        { key: 'B', symbol: 'B (deg)' },
      ],
      residual: (v) => v.a * Math.sin((v.B * Math.PI) / 180) - v.b * Math.sin((v.A * Math.PI) / 180),
    },
  },
  {
    id: 'geo-circle-area',
    category: 'geometry',
    label: 'A=πr²',
    title: 'Area of a Circle',
    latex: 'A = \\pi r^2',
    variables: [{ symbol: 'r', meaning: 'Radius' }],
    related: ['geo-circumference'],
    calc: {
      vars: [
        { key: 'A', symbol: 'A' },
        { key: 'r', symbol: 'r' },
      ],
      residual: (v) => v.A - Math.PI * v.r * v.r,
    },
  },
  {
    id: 'geo-circumference',
    category: 'geometry',
    label: 'C=2πr',
    title: 'Circumference of a Circle',
    latex: 'C = 2\\pi r',
    variables: [{ symbol: 'r', meaning: 'Radius' }],
    related: ['geo-circle-area'],
    calc: {
      vars: [
        { key: 'C', symbol: 'C' },
        { key: 'r', symbol: 'r' },
      ],
      residual: (v) => v.C - 2 * Math.PI * v.r,
    },
  },
  {
    id: 'geo-sphere-volume',
    category: 'geometry',
    label: 'V=4/3πr³',
    title: 'Volume of a Sphere',
    latex: 'V = \\frac{4}{3}\\pi r^3',
    variables: [{ symbol: 'r', meaning: 'Radius' }],
    calc: {
      vars: [
        { key: 'V', symbol: 'V' },
        { key: 'r', symbol: 'r' },
      ],
      residual: (v) => v.V - (4 / 3) * Math.PI * v.r ** 3,
    },
  },
  {
    id: 'geo-cylinder-volume',
    category: 'geometry',
    label: 'V=πr²h',
    title: 'Volume of a Cylinder',
    latex: 'V = \\pi r^2 h',
    variables: [
      { symbol: 'r', meaning: 'Radius of base' },
      { symbol: 'h', meaning: 'Height' },
    ],
    related: ['geo-cone-volume'],
    calc: {
      vars: [
        { key: 'V', symbol: 'V' },
        { key: 'r', symbol: 'r' },
        { key: 'h', symbol: 'h' },
      ],
      residual: (v) => v.V - Math.PI * v.r * v.r * v.h,
    },
  },
  {
    id: 'geo-cone-volume',
    category: 'geometry',
    label: 'V=1/3πr²h',
    title: 'Volume of a Cone',
    latex: 'V = \\frac{1}{3}\\pi r^2 h',
    variables: [
      { symbol: 'r', meaning: 'Radius of base' },
      { symbol: 'h', meaning: 'Height' },
    ],
    related: ['geo-cylinder-volume'],
    calc: {
      vars: [
        { key: 'V', symbol: 'V' },
        { key: 'r', symbol: 'r' },
        { key: 'h', symbol: 'h' },
      ],
      residual: (v) => v.V - (1 / 3) * Math.PI * v.r * v.r * v.h,
    },
  },
  {
    id: 'geo-triangle-area',
    category: 'geometry',
    label: 'A=½bh',
    title: 'Area of a Triangle',
    latex: 'A = \\frac{1}{2}bh',
    variables: [
      { symbol: 'b', meaning: 'Base length' },
      { symbol: 'h', meaning: 'Height' },
    ],
    calc: {
      vars: [
        { key: 'A', symbol: 'A' },
        { key: 'b', symbol: 'b' },
        { key: 'h', symbol: 'h' },
      ],
      residual: (v) => v.A - 0.5 * v.b * v.h,
    },
  },
  {
    id: 'geo-interior-angles',
    category: 'geometry',
    label: 'S=(n-2)·180°',
    title: 'Sum of Interior Angles',
    latex: 'S = (n-2) \\times 180^\\circ',
    variables: [{ symbol: 'n', meaning: 'Number of polygon sides' }],
    calc: {
      vars: [
        { key: 'S', symbol: 'S' },
        { key: 'n', symbol: 'n' },
      ],
      residual: (v) => v.S - (v.n - 2) * 180,
    },
  },
  {
    id: 'geo-pythagorean-identity',
    category: 'geometry',
    label: 'sin²θ+cos²θ=1',
    title: 'Pythagorean Identity',
    latex: '\\sin^2(\\theta) + \\cos^2(\\theta) = 1',
    variables: [{ symbol: 'θ', meaning: 'Angle' }],
    related: ['geo-pythagorean', 'geo-double-angle'],
  },
  {
    id: 'geo-double-angle',
    category: 'geometry',
    label: 'sin2θ=2sinθcosθ',
    title: 'Double Angle (Sine)',
    latex: '\\sin(2\\theta) = 2\\sin(\\theta)\\cos(\\theta)',
    variables: [{ symbol: 'θ', meaning: 'Angle' }],
    related: ['geo-pythagorean-identity'],
  },

  // ---------- CALCULUS & STATISTICS ----------
  {
    id: 'calc-power-rule',
    category: 'calculus',
    label: 'd/dx xⁿ=nxⁿ⁻¹',
    title: 'Power Rule (Derivative)',
    latex: '\\frac{d}{dx}x^n = nx^{n-1}',
    variables: [{ symbol: 'n', meaning: 'Constant exponent' }],
    related: ['calc-integral-power'],
  },
  {
    id: 'calc-product-rule',
    category: 'calculus',
    label: "(fg)'=f'g+fg'",
    title: 'Product Rule',
    latex: "(fg)' = f'g + fg'",
    variables: [
      { symbol: 'f, g', meaning: 'Differentiable functions of x' },
    ],
    related: ['calc-chain-rule'],
  },
  {
    id: 'calc-chain-rule',
    category: 'calculus',
    label: 'dy/dx=dy/du·du/dx',
    title: 'Chain Rule',
    latex: '\\frac{dy}{dx} = \\frac{dy}{du}\\cdot\\frac{du}{dx}',
    variables: [{ symbol: 'u', meaning: 'Intermediate function' }],
    related: ['calc-product-rule'],
  },
  {
    id: 'calc-ftc',
    category: 'calculus',
    label: '∫f\'(x)dx=f(b)-f(a)',
    title: 'Fundamental Theorem of Calculus',
    latex: '\\int_a^b f\'(x)\\,dx = f(b) - f(a)',
    variables: [
      { symbol: 'a, b', meaning: 'Bounds of integration' },
    ],
    related: ['calc-integral-power'],
  },
  {
    id: 'calc-integral-power',
    category: 'calculus',
    label: '∫xⁿdx=xⁿ⁺¹/(n+1)',
    title: 'Power Rule (Integral)',
    latex: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C',
    variables: [{ symbol: 'n', meaning: 'Constant exponent, n ≠ -1' }],
    related: ['calc-power-rule', 'calc-ftc'],
  },
  {
    id: 'calc-limit-def',
    category: 'calculus',
    label: "f'(x)=lim(Δf/Δx)",
    title: 'Limit Definition of the Derivative',
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h}",
    variables: [{ symbol: 'h', meaning: 'Infinitesimal step' }],
    related: ['calc-power-rule'],
  },
  {
    id: 'calc-mean',
    category: 'calculus',
    label: 'x̄=Σxᵢ/n',
    title: 'Mean (Average)',
    latex: '\\bar{x} = \\frac{\\sum x_i}{n}',
    variables: [
      { symbol: 'xᵢ', meaning: 'Each data value' },
      { symbol: 'n', meaning: 'Number of values' },
    ],
    related: ['calc-std-dev'],
  },
  {
    id: 'calc-std-dev',
    category: 'calculus',
    label: 'σ=√(Σ(xᵢ-x̄)²/n)',
    title: 'Standard Deviation',
    latex: '\\sigma = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{n}}',
    variables: [
      { symbol: 'xᵢ', meaning: 'Each data value' },
      { symbol: 'x̄', meaning: 'Mean of the data' },
    ],
    related: ['calc-mean', 'calc-normal-dist'],
  },
  {
    id: 'calc-normal-dist',
    category: 'calculus',
    label: 'f(x)=1/(σ√2π)e^…',
    title: 'Normal Distribution (PDF)',
    latex: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
    variables: [
      { symbol: 'μ', meaning: 'Mean' },
      { symbol: 'σ', meaning: 'Standard deviation' },
    ],
    related: ['calc-std-dev'],
    calc: {
      vars: [
        { key: 'f', symbol: 'f(x)' },
        { key: 'x', symbol: 'x' },
        { key: 'mu', symbol: 'μ' },
        { key: 'sigma', symbol: 'σ' },
      ],
      residual: (v) =>
        v.f - (1 / (v.sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-((v.x - v.mu) ** 2) / (2 * v.sigma * v.sigma)),
    },
  },
  {
    id: 'calc-binomial-prob',
    category: 'calculus',
    label: 'P(k)=C(n,k)pᵏ(1-p)ⁿ⁻ᵏ',
    title: 'Binomial Probability',
    latex: 'P(k) = \\binom{n}{k} p^k (1-p)^{n-k}',
    variables: [
      { symbol: 'n', meaning: 'Number of trials' },
      { symbol: 'k', meaning: 'Number of successes' },
      { symbol: 'p', meaning: 'Probability of success' },
    ],
    related: ['alg-combination'],
    calc: {
      vars: [
        { key: 'P', symbol: 'P(k)' },
        { key: 'n', symbol: 'n' },
        { key: 'k', symbol: 'k' },
        { key: 'p', symbol: 'p' },
      ],
      residual: (v) => {
        const factorial = (x: number) => {
          const r = Math.round(x);
          if (r < 0) return NaN;
          let result = 1;
          for (let i = 2; i <= r; i++) result *= i;
          return result;
        };
        const choose = factorial(v.n) / (factorial(v.k) * factorial(v.n - v.k));
        return v.P - choose * Math.pow(v.p, v.k) * Math.pow(1 - v.p, v.n - v.k);
      },
    },
  },
  {
    id: 'calc-bayes',
    category: 'calculus',
    label: 'P(A|B)=P(B|A)P(A)/P(B)',
    title: "Bayes' Theorem",
    latex: 'P(A|B) = \\frac{P(B|A)P(A)}{P(B)}',
    variables: [
      { symbol: 'P(A|B)', meaning: 'Probability of A given B' },
    ],
    calc: {
      vars: [
        { key: 'pAB', symbol: 'P(A|B)' },
        { key: 'pBA', symbol: 'P(B|A)' },
        { key: 'pA', symbol: 'P(A)' },
        { key: 'pB', symbol: 'P(B)' },
      ],
      residual: (v) => v.pAB - (v.pBA * v.pA) / v.pB,
    },
  },
  {
    id: 'calc-taylor-series',
    category: 'calculus',
    label: 'f(x)=Σf⁽ⁿ⁾(a)/n!(x-a)ⁿ',
    title: 'Taylor Series',
    latex: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n',
    variables: [{ symbol: 'a', meaning: 'Center of expansion' }],
  },

  // ---------- PHYSICS ----------
  {
    id: 'phys-newton-2nd',
    category: 'physics',
    label: 'F=ma',
    title: "Newton's Second Law",
    latex: 'F = ma',
    variables: [
      { symbol: 'F', meaning: 'Net force' },
      { symbol: 'm', meaning: 'Mass' },
      { symbol: 'a', meaning: 'Acceleration' },
    ],
    related: ['phys-momentum', 'phys-work'],
    calc: {
      vars: [
        { key: 'F', symbol: 'F' },
        { key: 'm', symbol: 'm' },
        { key: 'a', symbol: 'a' },
      ],
      residual: (v) => v.F - v.m * v.a,
    },
  },
  {
    id: 'phys-kinetic-energy',
    category: 'physics',
    label: 'KE=½mv²',
    title: 'Kinetic Energy',
    latex: 'KE = \\frac{1}{2}mv^2',
    variables: [
      { symbol: 'm', meaning: 'Mass' },
      { symbol: 'v', meaning: 'Velocity' },
    ],
    related: ['phys-work', 'phys-mass-energy'],
    calc: {
      vars: [
        { key: 'KE', symbol: 'KE' },
        { key: 'm', symbol: 'm' },
        { key: 'v', symbol: 'v' },
      ],
      residual: (v) => v.KE - 0.5 * v.m * v.v * v.v,
    },
  },
  {
    id: 'phys-potential-energy',
    category: 'physics',
    label: 'PE=mgh',
    title: 'Gravitational Potential Energy',
    latex: 'PE = mgh',
    variables: [
      { symbol: 'm', meaning: 'Mass' },
      { symbol: 'g', meaning: 'Gravitational acceleration' },
      { symbol: 'h', meaning: 'Height' },
    ],
    related: ['phys-kinetic-energy'],
    calc: {
      vars: [
        { key: 'PE', symbol: 'PE' },
        { key: 'm', symbol: 'm' },
        { key: 'g', symbol: 'g', defaultValue: 9.8 },
        { key: 'h', symbol: 'h' },
      ],
      residual: (v) => v.PE - v.m * v.g * v.h,
    },
  },
  {
    id: 'phys-gravitation',
    category: 'physics',
    label: 'F=Gm₁m₂/r²',
    title: 'Universal Gravitation',
    latex: 'F = G\\frac{m_1 m_2}{r^2}',
    variables: [
      { symbol: 'G', meaning: 'Gravitational constant' },
      { symbol: 'm₁, m₂', meaning: 'Masses of the two bodies' },
      { symbol: 'r', meaning: 'Distance between centers' },
    ],
    related: ['phys-coulomb'],
    calc: {
      vars: [
        { key: 'F', symbol: 'F' },
        { key: 'G', symbol: 'G', defaultValue: 6.674e-11 },
        { key: 'm1', symbol: 'm₁' },
        { key: 'm2', symbol: 'm₂' },
        { key: 'r', symbol: 'r' },
      ],
      residual: (v) => v.F - (v.G * v.m1 * v.m2) / (v.r * v.r),
    },
  },
  {
    id: 'phys-ohms-law',
    category: 'physics',
    label: 'V=IR',
    title: "Ohm's Law",
    latex: 'V = IR',
    variables: [
      { symbol: 'V', meaning: 'Voltage' },
      { symbol: 'I', meaning: 'Current' },
      { symbol: 'R', meaning: 'Resistance' },
    ],
    related: ['phys-power'],
    calc: {
      vars: [
        { key: 'V', symbol: 'V' },
        { key: 'I', symbol: 'I' },
        { key: 'R', symbol: 'R' },
      ],
      residual: (v) => v.V - v.I * v.R,
    },
  },
  {
    id: 'phys-coulomb',
    category: 'physics',
    label: 'F=kq₁q₂/r²',
    title: "Coulomb's Law",
    latex: 'F = k\\frac{q_1 q_2}{r^2}',
    variables: [
      { symbol: 'k', meaning: "Coulomb's constant" },
      { symbol: 'q₁, q₂', meaning: 'Electric charges' },
      { symbol: 'r', meaning: 'Distance between charges' },
    ],
    related: ['phys-gravitation'],
    calc: {
      vars: [
        { key: 'F', symbol: 'F' },
        { key: 'k', symbol: 'k', defaultValue: 8.988e9 },
        { key: 'q1', symbol: 'q₁' },
        { key: 'q2', symbol: 'q₂' },
        { key: 'r', symbol: 'r' },
      ],
      residual: (v) => v.F - (v.k * v.q1 * v.q2) / (v.r * v.r),
    },
  },
  {
    id: 'phys-mass-energy',
    category: 'physics',
    label: 'E=mc²',
    title: 'Mass-Energy Equivalence',
    latex: 'E = mc^2',
    variables: [
      { symbol: 'm', meaning: 'Mass' },
      { symbol: 'c', meaning: 'Speed of light' },
    ],
    related: ['phys-kinetic-energy'],
    calc: {
      vars: [
        { key: 'E', symbol: 'E' },
        { key: 'm', symbol: 'm' },
        { key: 'c', symbol: 'c', defaultValue: 2.998e8 },
      ],
      residual: (v) => v.E - v.m * v.c * v.c,
    },
  },
  {
    id: 'phys-kinematics',
    category: 'physics',
    label: 'x=x₀+v₀t+½at²',
    title: 'Kinematic Equation (Position)',
    latex: 'x = x_0 + v_0 t + \\frac{1}{2}at^2',
    variables: [
      { symbol: 'x₀, v₀', meaning: 'Initial position and velocity' },
      { symbol: 'a', meaning: 'Acceleration' },
    ],
    related: ['phys-newton-2nd'],
    calc: {
      vars: [
        { key: 'x', symbol: 'x' },
        { key: 'x0', symbol: 'x₀' },
        { key: 'v0', symbol: 'v₀' },
        { key: 't', symbol: 't' },
        { key: 'a', symbol: 'a' },
      ],
      residual: (v) => v.x - (v.x0 + v.v0 * v.t + 0.5 * v.a * v.t * v.t),
    },
  },
  {
    id: 'phys-momentum',
    category: 'physics',
    label: 'p=mv',
    title: 'Momentum',
    latex: 'p = mv',
    variables: [
      { symbol: 'm', meaning: 'Mass' },
      { symbol: 'v', meaning: 'Velocity' },
    ],
    related: ['phys-newton-2nd'],
    calc: {
      vars: [
        { key: 'p', symbol: 'p' },
        { key: 'm', symbol: 'm' },
        { key: 'v', symbol: 'v' },
      ],
      residual: (v) => v.p - v.m * v.v,
    },
  },
  {
    id: 'phys-work',
    category: 'physics',
    label: 'W=Fd cosθ',
    title: 'Work',
    latex: 'W = Fd\\cos(\\theta)',
    variables: [
      { symbol: 'F', meaning: 'Applied force' },
      { symbol: 'd', meaning: 'Displacement' },
      { symbol: 'θ', meaning: 'Angle between F and d' },
    ],
    related: ['phys-kinetic-energy', 'phys-power'],
    calc: {
      vars: [
        { key: 'W', symbol: 'W' },
        { key: 'F', symbol: 'F' },
        { key: 'd', symbol: 'd' },
        { key: 'theta', symbol: 'θ (deg)' },
      ],
      residual: (v) => v.W - v.F * v.d * Math.cos((v.theta * Math.PI) / 180),
    },
  },
  {
    id: 'phys-power',
    category: 'physics',
    label: 'P=W/t',
    title: 'Power',
    latex: 'P = \\frac{W}{t}',
    variables: [
      { symbol: 'W', meaning: 'Work done' },
      { symbol: 't', meaning: 'Time' },
    ],
    related: ['phys-work', 'phys-ohms-law'],
    calc: {
      vars: [
        { key: 'P', symbol: 'P' },
        { key: 'W', symbol: 'W' },
        { key: 't', symbol: 't' },
      ],
      residual: (v) => v.P - v.W / v.t,
    },
  },
  {
    id: 'phys-wave-speed',
    category: 'physics',
    label: 'v=fλ',
    title: 'Wave Speed',
    latex: 'v = f\\lambda',
    variables: [
      { symbol: 'f', meaning: 'Frequency' },
      { symbol: 'λ', meaning: 'Wavelength' },
    ],
    calc: {
      vars: [
        { key: 'v', symbol: 'v' },
        { key: 'f', symbol: 'f' },
        { key: 'lambda', symbol: 'λ' },
      ],
      residual: (v) => v.v - v.f * v.lambda,
    },
  },

  // ---------- CHEMISTRY ----------
  {
    id: 'chem-ideal-gas',
    category: 'chemistry',
    label: 'PV=nRT',
    title: 'Ideal Gas Law',
    latex: 'PV = nRT',
    variables: [
      { symbol: 'P', meaning: 'Pressure' },
      { symbol: 'V', meaning: 'Volume' },
      { symbol: 'n', meaning: 'Moles of gas' },
      { symbol: 'R', meaning: 'Gas constant' },
      { symbol: 'T', meaning: 'Temperature (K)' },
    ],
    related: ['chem-combined-gas'],
    calc: {
      vars: [
        { key: 'P', symbol: 'P' },
        { key: 'V', symbol: 'V' },
        { key: 'n', symbol: 'n' },
        { key: 'R', symbol: 'R', defaultValue: 8.314 },
        { key: 'T', symbol: 'T' },
      ],
      residual: (v) => v.P * v.V - v.n * v.R * v.T,
    },
  },
  {
    id: 'chem-molarity',
    category: 'chemistry',
    label: 'M=mol/L',
    title: 'Molarity',
    latex: 'M = \\frac{\\text{mol solute}}{\\text{L solution}}',
    variables: [{ symbol: 'M', meaning: 'Molar concentration' }],
    related: ['chem-dilution'],
    calc: {
      vars: [
        { key: 'M', symbol: 'M' },
        { key: 'mol', symbol: 'mol solute' },
        { key: 'L', symbol: 'L solution' },
      ],
      residual: (v) => v.M - v.mol / v.L,
    },
  },
  {
    id: 'chem-dilution',
    category: 'chemistry',
    label: 'M₁V₁=M₂V₂',
    title: 'Dilution Equation',
    latex: 'M_1 V_1 = M_2 V_2',
    variables: [
      { symbol: 'M₁, V₁', meaning: 'Initial concentration & volume' },
      { symbol: 'M₂, V₂', meaning: 'Final concentration & volume' },
    ],
    related: ['chem-molarity'],
    calc: {
      vars: [
        { key: 'M1', symbol: 'M₁' },
        { key: 'V1', symbol: 'V₁' },
        { key: 'M2', symbol: 'M₂' },
        { key: 'V2', symbol: 'V₂' },
      ],
      residual: (v) => v.M1 * v.V1 - v.M2 * v.V2,
    },
  },
  {
    id: 'chem-ph',
    category: 'chemistry',
    label: 'pH=-log[H⁺]',
    title: 'pH',
    latex: '\\text{pH} = -\\log[H^+]',
    variables: [{ symbol: '[H⁺]', meaning: 'Hydrogen ion concentration' }],
    calc: {
      vars: [
        { key: 'pH', symbol: 'pH' },
        { key: 'H', symbol: '[H⁺]' },
      ],
      residual: (v) => v.pH - -Math.log10(v.H),
    },
  },
  {
    id: 'chem-percent-yield',
    category: 'chemistry',
    label: '%Y=actual/theoretical',
    title: 'Percent Yield',
    latex: '\\%\\,\\text{Yield} = \\frac{\\text{actual}}{\\text{theoretical}} \\times 100\\%',
    variables: [],
    calc: {
      vars: [
        { key: 'Y', symbol: '% Yield' },
        { key: 'actual', symbol: 'actual' },
        { key: 'theoretical', symbol: 'theoretical' },
      ],
      residual: (v) => v.Y - (v.actual / v.theoretical) * 100,
    },
  },
  {
    id: 'chem-combined-gas',
    category: 'chemistry',
    label: 'P₁V₁/T₁=P₂V₂/T₂',
    title: 'Combined Gas Law',
    latex: '\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}',
    variables: [
      { symbol: 'P, V, T', meaning: 'Pressure, volume, temperature' },
    ],
    related: ['chem-ideal-gas'],
    calc: {
      vars: [
        { key: 'P1', symbol: 'P₁' },
        { key: 'V1', symbol: 'V₁' },
        { key: 'T1', symbol: 'T₁' },
        { key: 'P2', symbol: 'P₂' },
        { key: 'V2', symbol: 'V₂' },
        { key: 'T2', symbol: 'T₂' },
      ],
      residual: (v) => (v.P1 * v.V1) / v.T1 - (v.P2 * v.V2) / v.T2,
    },
  },
  {
    id: 'chem-rate-law',
    category: 'chemistry',
    label: 'rate=k[A]ᵐ[B]ⁿ',
    title: 'Rate Law',
    latex: '\\text{rate} = k[A]^m[B]^n',
    variables: [
      { symbol: 'k', meaning: 'Rate constant' },
      { symbol: 'm, n', meaning: 'Reaction orders' },
    ],
  },
  {
    id: 'chem-gibbs',
    category: 'chemistry',
    label: 'ΔG=ΔH-TΔS',
    title: 'Gibbs Free Energy',
    latex: '\\Delta G = \\Delta H - T\\Delta S',
    variables: [
      { symbol: 'ΔH', meaning: 'Change in enthalpy' },
      { symbol: 'T', meaning: 'Temperature (K)' },
      { symbol: 'ΔS', meaning: 'Change in entropy' },
    ],
    calc: {
      vars: [
        { key: 'G', symbol: 'ΔG' },
        { key: 'H', symbol: 'ΔH' },
        { key: 'T', symbol: 'T' },
        { key: 'S', symbol: 'ΔS' },
      ],
      residual: (v) => v.G - (v.H - v.T * v.S),
    },
  },
  {
    id: 'chem-half-life',
    category: 'chemistry',
    label: 'N(t)=N₀(½)^(t/T)',
    title: 'Radioactive Half-Life',
    latex: 'N(t) = N_0 \\left(\\frac{1}{2}\\right)^{t/t_{1/2}}',
    variables: [
      { symbol: 'N₀', meaning: 'Initial quantity' },
      { symbol: 't½', meaning: 'Half-life' },
    ],
    related: ['alg-exp-growth'],
    calc: {
      vars: [
        { key: 'N', symbol: 'N(t)' },
        { key: 'N0', symbol: 'N₀' },
        { key: 't', symbol: 't' },
        { key: 'thalf', symbol: 't½' },
      ],
      residual: (v) => v.N - v.N0 * Math.pow(0.5, v.t / v.thalf),
    },
  },
  {
    id: 'chem-density',
    category: 'chemistry',
    label: 'ρ=m/V',
    title: 'Density',
    latex: '\\rho = \\frac{m}{V}',
    variables: [
      { symbol: 'm', meaning: 'Mass' },
      { symbol: 'V', meaning: 'Volume' },
    ],
    calc: {
      vars: [
        { key: 'rho', symbol: 'ρ' },
        { key: 'm', symbol: 'm' },
        { key: 'V', symbol: 'V' },
      ],
      residual: (v) => v.rho - v.m / v.V,
    },
  },
  {
    id: 'chem-daltons-law',
    category: 'chemistry',
    label: 'Pₜ=ΣPᵢ',
    title: "Dalton's Law of Partial Pressures",
    latex: 'P_{total} = \\sum_i P_i',
    variables: [{ symbol: 'Pᵢ', meaning: 'Partial pressure of gas i' }],
    related: ['chem-ideal-gas'],
  },
  {
    id: 'chem-avg-atomic-mass',
    category: 'chemistry',
    label: 'M=Σ(fᵢ·mᵢ)',
    title: 'Average Atomic Mass',
    latex: 'M = \\sum_i f_i \\cdot m_i',
    variables: [
      { symbol: 'fᵢ', meaning: 'Fractional abundance of isotope i' },
      { symbol: 'mᵢ', meaning: 'Mass of isotope i' },
    ],
  },

  // ---------- COMPUTER SCIENCE / TECH ----------
  {
    id: 'cs-big-o',
    category: 'compsci',
    label: 'f(n)=O(g(n))',
    title: 'Big-O Notation',
    latex: 'f(n) = O(g(n)) \\iff f(n) \\le c\\cdot g(n)',
    variables: [
      { symbol: 'f(n)', meaning: "Algorithm's growth rate" },
      { symbol: 'c', meaning: 'A positive constant' },
    ],
    related: ['cs-master-theorem'],
  },
  {
    id: 'cs-master-theorem',
    category: 'compsci',
    label: 'T(n)=aT(n/b)+f(n)',
    title: 'Master Theorem (Recurrence)',
    latex: 'T(n) = aT\\!\\left(\\frac{n}{b}\\right) + f(n)',
    variables: [
      { symbol: 'a', meaning: 'Number of subproblems' },
      { symbol: 'b', meaning: 'Factor by which n shrinks' },
    ],
    related: ['cs-big-o'],
  },
  {
    id: 'cs-de-morgan',
    category: 'compsci',
    label: '¬(A∧B)=¬A∨¬B',
    title: "De Morgan's Law",
    latex: '\\neg(A \\land B) = \\neg A \\lor \\neg B',
    variables: [{ symbol: 'A, B', meaning: 'Boolean propositions' }],
  },
  {
    id: 'cs-shannon-entropy',
    category: 'compsci',
    label: 'H(X)=-Σp(x)log₂p(x)',
    title: 'Shannon Entropy',
    latex: 'H(X) = -\\sum_{x} p(x)\\log_2 p(x)',
    variables: [{ symbol: 'p(x)', meaning: 'Probability of symbol x' }],
    related: ['cs-channel-capacity'],
  },
  {
    id: 'cs-channel-capacity',
    category: 'compsci',
    label: 'C=B log₂(1+S/N)',
    title: 'Shannon-Hartley Channel Capacity',
    latex: 'C = B\\log_2\\left(1 + \\frac{S}{N}\\right)',
    variables: [
      { symbol: 'B', meaning: 'Bandwidth' },
      { symbol: 'S/N', meaning: 'Signal-to-noise ratio' },
    ],
    related: ['cs-shannon-entropy', 'cs-nyquist'],
    calc: {
      vars: [
        { key: 'C', symbol: 'C' },
        { key: 'B', symbol: 'B' },
        { key: 'SNR', symbol: 'S/N' },
      ],
      residual: (v) => v.C - v.B * (Math.log(1 + v.SNR) / Math.log(2)),
    },
  },
  {
    id: 'cs-amdahls-law',
    category: 'compsci',
    label: 'Speedup=1/((1-P)+P/S)',
    title: "Amdahl's Law",
    latex: '\\text{Speedup} = \\frac{1}{(1-P) + \\frac{P}{S}}',
    variables: [
      { symbol: 'P', meaning: 'Proportion that can be parallelized' },
      { symbol: 'S', meaning: 'Speedup of the parallel portion' },
    ],
    calc: {
      vars: [
        { key: 'total', symbol: 'Speedup' },
        { key: 'P', symbol: 'P' },
        { key: 'S', symbol: 'S' },
      ],
      residual: (v) => v.total - 1 / (1 - v.P + v.P / v.S),
    },
  },
  {
    id: 'cs-sigmoid',
    category: 'compsci',
    label: 'σ(x)=1/(1+e⁻ˣ)',
    title: 'Sigmoid (Logistic) Function',
    latex: '\\sigma(x) = \\frac{1}{1 + e^{-x}}',
    variables: [{ symbol: 'x', meaning: 'Input value' }],
    related: ['cs-gradient-descent'],
    calc: {
      vars: [
        { key: 'sigma', symbol: 'σ(x)' },
        { key: 'x', symbol: 'x' },
      ],
      residual: (v) => v.sigma - 1 / (1 + Math.exp(-v.x)),
    },
  },
  {
    id: 'cs-cross-entropy',
    category: 'compsci',
    label: 'L=-Σy log(ŷ)',
    title: 'Cross-Entropy Loss',
    latex: 'L = -\\sum_i y_i \\log(\\hat{y}_i)',
    variables: [
      { symbol: 'y', meaning: 'True label' },
      { symbol: 'ŷ', meaning: 'Predicted probability' },
    ],
    related: ['cs-sigmoid', 'cs-gradient-descent'],
  },
  {
    id: 'cs-gradient-descent',
    category: 'compsci',
    label: 'θ=θ-α∇J(θ)',
    title: 'Gradient Descent Update',
    latex: '\\theta \\leftarrow \\theta - \\alpha \\nabla J(\\theta)',
    variables: [
      { symbol: 'α', meaning: 'Learning rate' },
      { symbol: 'J(θ)', meaning: 'Cost function' },
    ],
    related: ['cs-cross-entropy'],
  },
  {
    id: 'cs-hash-load-factor',
    category: 'compsci',
    label: 'α=n/m',
    title: 'Hash Table Load Factor',
    latex: '\\alpha = \\frac{n}{m}',
    variables: [
      { symbol: 'n', meaning: 'Number of stored entries' },
      { symbol: 'm', meaning: 'Number of buckets' },
    ],
    calc: {
      vars: [
        { key: 'alpha', symbol: 'α' },
        { key: 'n', symbol: 'n' },
        { key: 'm', symbol: 'm' },
      ],
      residual: (v) => v.alpha - v.n / v.m,
    },
  },
  {
    id: 'cs-twos-complement',
    category: 'compsci',
    label: '-2ⁿ⁻¹ … 2ⁿ⁻¹-1',
    title: "n-bit Two's Complement Range",
    latex: '[-2^{n-1},\\ 2^{n-1}-1]',
    variables: [{ symbol: 'n', meaning: 'Number of bits' }],
  },
  {
    id: 'cs-nyquist',
    category: 'compsci',
    label: 'fₛ≥2f_max',
    title: 'Nyquist Sampling Rate',
    latex: 'f_s \\ge 2f_{max}',
    variables: [
      { symbol: 'fₛ', meaning: 'Sampling frequency' },
      { symbol: 'f_max', meaning: 'Highest frequency in the signal' },
    ],
    related: ['cs-channel-capacity'],
  },
];
