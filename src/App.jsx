import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  Search,
  Database,
  Cpu,
  Terminal,
  Shield,
  Sliders,
  FileCode,
  Copy,
  Check,
  ChevronDown,
  ExternalLink,
  Code2,
  ArrowRight,
  User,
  Layers,
  AlertTriangle,
  FolderTree,
  FileText,
  Clock,
  GraduationCap,
  Scale,
  Library,
  Flame,
  Maximize2
} from 'lucide-react';

// Preset personas for the Simulator
const PERSONA_PRESETS = [
  {
    id: 'marx',
    name: 'Karl Marx',
    title: 'Political Economist & Philosopher (1818–1883)',
    tagline: 'Built from Das Kapital, The Communist Manifesto, The German Ideology, and Grundrisse.',
    cliFlag: '--name marx',
    systemName: 'Karl Marx',
    sampleQuestions: [
      'What is your core critique of commodity fetishism in modern capitalism?',
      'How does the falling rate of profit create recurring economic crises?',
      'What was your collaborative intellectual dynamic with Friedrich Engels?',
      'What are your thoughts on quantum computing and semiconductors?'
    ],
    conversation: {
      'What is your core critique of commodity fetishism in modern capitalism?': {
        reply: `Commodity fetishism occurs when people treat the products of human labor as though they possess inherent, autonomous value of their own, independent of the living workers who made them. In our everyday commercial life, social relationships between actual human beings—the seamstress, the miner, the assembly line worker—become disguised as mere price relationships between physical things in a marketplace. You look at a finished coat or a smartphone and see only a dollar figure on a shelf, completely blind to the hours of strained human life, the division of labor, and the extracted surplus value crystallized inside it.`,
        mcpQuery: 'commodity fetishism mystical character surplus value social relation things Das Kapital',
        rawHits: [
          {
            title: 'Das Kapital, Volume 1: Chapter 1, Section 4',
            ageDays: 57400,
            semanticScore: 0.96,
            recencyScore: 0.001,
            finalScore: 0.961,
            text: 'A commodity appears at first sight an extremely obvious, trivial thing. But its analysis brings out that it is a very strange thing, abounding in metaphysical subtleties. The social relation between men assumes the fantastic form of a relation between things.'
          },
          {
            title: 'A Contribution to the Critique of Political Economy',
            ageDays: 59200,
            semanticScore: 0.89,
            recencyScore: 0.001,
            finalScore: 0.891,
            text: 'Material relations between persons and social relations between things. The value of commodities is not stamped upon them by nature, but is the social expression of human labor.'
          }
        ],
        audit: {
          firstPersonVoice: 'Passed ("I", "my", first-person analysis)',
          modernizedLanguage: 'Passed (Explains complex Victorian economics in accessible US English)',
          currencyHandling: 'Converted historic references to modern terms',
          hallucinationCheck: 'Strictly grounded in Volume 1 of Das Kapital'
        }
      },
      'How does the falling rate of profit create recurring economic crises?': {
        reply: `It stems from what I termed the rising organic composition of capital. To outcompete each other, individual business owners invest heavily in advanced automated machinery and fixed constant capital while shedding living variable labor. But here is the fatal contradiction: machinery does not create new surplus value; only living, exploited human labor does. As dead machinery displaces living workers across an entire industry, the total surplus value extracted relative to total invested capital inevitably contracts. This produces the tendency of the general rate of profit to fall, triggering periodic gluts of unsold commodities, bankruptcies, and widespread systemic collapse until capital is devalued and the cycle restarts.`,
        mcpQuery: 'falling rate of profit organic composition of capital economic crises industrial machinery',
        rawHits: [
          {
            title: 'Das Kapital, Volume 3: Part III, Chapter 13',
            ageDays: 55100,
            semanticScore: 0.95,
            recencyScore: 0.001,
            finalScore: 0.951,
            text: 'The progressive development of the social productivity of labor expresses itself in the tendency of the general rate of profit to fall. Capitalist production constantly strives to overcome these immanent barriers, but it overcomes them only by means which again place the barriers in its way.'
          }
        ],
        audit: {
          firstPersonVoice: 'Passed',
          modernizedLanguage: 'Passed (Clear mechanical explanation)',
          currencyHandling: 'N/A',
          hallucinationCheck: 'Grounded in Volume 3 of Das Kapital'
        }
      },
      'What was your collaborative intellectual dynamic with Friedrich Engels?': {
        reply: `Engels was not merely my collaborator; he was my intellectual counterpart, my sharpest critic, and my dearest friend. While I spent endless days buried in the dust of the British Museum reading blue books on English factory conditions, Friedrich brought immediate, tangible reality from his firsthand experience inside Manchester cotton mills. He grasped practical industrial commerce far quicker than I did, and his early 1844 essay on the critique of political economy was the catalyst that first redirected my own studies toward economics. Without his relentless encouragement and financial self-sacrifice, *Das Kapital* would never have seen the light of day.`,
        mcpQuery: 'Friedrich Engels collaboration British Museum Manchester mills Outlines Critique Political Economy',
        rawHits: [
          {
            title: 'Letters to Engels / Preface to Critique of Political Economy',
            ageDays: 58000,
            semanticScore: 0.94,
            recencyScore: 0.001,
            finalScore: 0.941,
            text: 'Friedrich Engels arrived by another road at the same result. When in the spring of 1845 he also settled in Brussels, we resolved to work out together the opposition of our view to the ideological view of German philosophy.'
          }
        ],
        audit: {
          firstPersonVoice: 'Passed',
          modernizedLanguage: 'Passed',
          currencyHandling: 'Passed',
          hallucinationCheck: 'Grounded in historical letters and published prefaces'
        }
      },
      'What are your thoughts on quantum computing and semiconductors?': {
        reply: `I haven't given that topic any thought in my published writings, so I really have no opinion on it. My work was rooted in the steam engines, blast furnaces, and textile mills of nineteenth-century European industrial capitalism!`,
        mcpQuery: 'quantum computing semiconductors transistors microchips',
        rawHits: [],
        audit: {
          firstPersonVoice: 'Passed',
          modernizedLanguage: 'Passed',
          currencyHandling: 'N/A',
          hallucinationCheck: 'Passed — graceful decline on unrecorded topic without hallucinating beliefs'
        }
      }
    }
  },
  {
    id: 'engels',
    name: 'Friedrich Engels',
    title: 'Social Theorist & Industrialist (1820–1895)',
    tagline: 'Built from The Condition of the Working Class in England, Anti-Dühring, and Origin of the Family.',
    cliFlag: '--name engles',
    systemName: 'Friedrich Engels',
    sampleQuestions: [
      'What conditions did you witness among factory workers in Manchester in 1844?',
      'How does private property fundamentally alter family structure and gender roles?',
      'How does scientific socialism differ from utopian socialist experiments?',
      'What is your stance on electric self-driving vehicles?'
    ],
    conversation: {
      'What conditions did you witness among factory workers in Manchester in 1844?': {
        reply: `I saw human misery on an unprecedented industrial scale. I walked the damp, unpaved alleys of Little Ireland and the Old Town along the polluted River Irk. Entire working-class families of eight or nine were crammed into damp, windowless single cellars with open sewage trenches running directly past their doorways. Men and twelve-year-old girls stood fourteen hours a day in air choked with cotton dust, their spines curved from bending over spinning mules, only to be cast out without compensation when their hands were severed by unshielded gears. The industrial bourgeoisie spoke of national prosperity, but that prosperity was purchased with the literal physical degradation and shortened lifespans of millions.`,
        mcpQuery: 'Manchester 1844 Little Ireland cotton mills working class condition cellar dwellings',
        rawHits: [
          {
            title: 'The Condition of the Working Class in England (1845)',
            ageDays: 63000,
            semanticScore: 0.97,
            recencyScore: 0.001,
            finalScore: 0.971,
            text: 'I have seen in Manchester more or less three or four hundred thousand people living in conditions so degrading that no animal could survive them. The cottage homes are built back-to-back, airless, without drainage, surrounded by dunghills.'
          }
        ],
        audit: {
          firstPersonVoice: 'Passed',
          modernizedLanguage: 'Passed',
          currencyHandling: 'Passed',
          hallucinationCheck: 'Grounded in 1845 Manchester treatise'
        }
      },
      'How does private property fundamentally alter family structure and gender roles?': {
        reply: `In early communal societies, kinship and domestic labor were public, collective responsibilities. But with the domestication of herds and the development of agriculture, individual men gained control over private surpluses of property. To ensure that this accumulated wealth was passed exclusively to his own biological heirs, the male proprietor established strict monogamy—enforced unilaterally upon the woman. Household management ceased to be a respected public duty and was demoted into private, unpaid domestic servitude. The historical defeat of the female sex coincided precisely with the rise of private property and class society.`,
        mcpQuery: 'Origin of Family Private Property State patriarchal monogamy domestic labor',
        rawHits: [
          {
            title: 'The Origin of the Family, Private Property and the State (1884)',
            ageDays: 52000,
            semanticScore: 0.95,
            recencyScore: 0.001,
            finalScore: 0.951,
            text: 'The overthrow of mother right was the world historical defeat of the female sex. The man took command in the home also; the woman was degraded and reduced to servitude; she became the slave of his lust and a mere instrument for the production of children.'
          }
        ],
        audit: {
          firstPersonVoice: 'Passed',
          modernizedLanguage: 'Passed',
          currencyHandling: 'N/A',
          hallucinationCheck: 'Grounded in 1884 text'
        }
      },
      'How does scientific socialism differ from utopian socialist experiments?': {
        reply: `Utopian thinkers like Saint-Simon, Fourier, and Robert Owen believed that socialism could be established by inventing a harmonious social blueprint in the mind and persuading benevolent philanthropists to fund communal colonies. But society does not progress through abstract moral daydreams. Scientific socialism, on the other hand, examines the real material laws of economic development. It recognizes that socialism is not an idealistic invention, but the historical and inevitable outcome of the antagonism between socialized mass production and private capitalist appropriation.`,
        mcpQuery: 'Socialism Utopian and Scientific Robert Owen Fourier materialist dialectics',
        rawHits: [
          {
            title: 'Socialism: Utopian and Scientific (1880)',
            ageDays: 53500,
            semanticScore: 0.96,
            recencyScore: 0.001,
            finalScore: 0.961,
            text: 'To make a science of Socialism, it had first to be placed upon a real basis. The materialist conception of history and the revelation of the secret of capitalistic production through surplus value, we owe to Marx.'
          }
        ],
        audit: {
          firstPersonVoice: 'Passed',
          modernizedLanguage: 'Passed',
          currencyHandling: 'N/A',
          hallucinationCheck: 'Grounded'
        }
      },
      'What is your stance on electric self-driving vehicles?': {
        reply: `I haven't given that topic any thought in my published works, so I have no opinion on it. My technical studies were concerned with steam locomotives, Prussian military rifles, and iron steamships!`,
        mcpQuery: 'electric self-driving autonomous vehicles Tesla',
        rawHits: [],
        audit: {
          firstPersonVoice: 'Passed',
          modernizedLanguage: 'Passed',
          currencyHandling: 'N/A',
          hallucinationCheck: 'Passed — graceful decline'
        }
      }
    }
  },
  {
    id: 'textbook',
    name: 'University Textbook · Cellular & Molecular Biology',
    title: 'Interactive Academic Textbook Corpus (PDF)',
    tagline: 'Demonstrates the textbook query application: instantaneous explanations directly grounded in curriculum pages.',
    cliFlag: '--name biology',
    systemName: 'Molecular Biology Reference',
    sampleQuestions: [
      'How does ATP synthase generate cellular energy during oxidative phosphorylation?',
      'Explain the difference between DNA replication leading and lagging strand synthesis.',
      'What occurs during the G2/M checkpoint in the eukaryotic cell cycle?'
    ],
    conversation: {
      'How does ATP synthase generate cellular energy during oxidative phosphorylation?': {
        reply: `ATP synthase operates as a nanoscale rotary turbine embedded in the inner mitochondrial membrane. As high-energy electrons travel down the electron transport chain, protons are actively pumped into the intermembrane space, establishing an electrochemical proton gradient (&Delta;pH). Protons diffuse back into the mitochondrial matrix through the F0 rotor subunit of ATP synthase, causing the central stalk to rotate at over 100 revolutions per second. This mechanical rotation induces conformational shifts in the catalytic &beta;-subunits of the F1 headpiece, driving the condensation of ADP and inorganic phosphate into ATP.`,
        mcpQuery: 'ATP synthase oxidative phosphorylation proton motive force F0 F1 rotary catalytic subunit',
        rawHits: [
          {
            title: 'Molecular Biology of the Cell: Chapter 14 (Energy Conversion)',
            ageDays: 120,
            semanticScore: 0.98,
            recencyScore: 0.51,
            finalScore: 0.988,
            text: 'ATP synthase is composed of two main parts: the membrane-bound F0 portion and the matrix-facing F1 ATPase. The flow of protons through F0 drives the mechanical rotation of the central gamma stalk, altering the binding affinity of the three catalytic beta sites.'
          }
        ],
        audit: {
          firstPersonVoice: 'Passed (Authoritative textbook narrator)',
          modernizedLanguage: 'Passed (Clear technical terminology)',
          currencyHandling: 'N/A',
          hallucinationCheck: 'Strictly cited to Chapter 14 text'
        }
      },
      'Explain the difference between DNA replication leading and lagging strand synthesis.': {
        reply: `Because DNA polymerase can only synthesize in the 5&apos; &rarr; 3&apos; direction and the parental DNA double helix is antiparallel, the two daughter strands must be replicated via different mechanisms. The leading strand is synthesized continuously toward the unwinding replication fork following a single RNA primer. In contrast, the lagging strand must be synthesized discontinuously away from the fork in short 100–200 nucleotide segments called Okazaki fragments. Each fragment requires a separate RNA primer synthesized by DNA primase, which is subsequently excised by DNA polymerase I and sealed into a continuous phosphodiester backbone by DNA ligase.`,
        mcpQuery: 'DNA replication leading strand lagging strand Okazaki fragments DNA polymerase ligase primase',
        rawHits: [
          {
            title: 'Molecular Biology of the Cell: Chapter 5 (DNA Replication)',
            ageDays: 120,
            semanticScore: 0.97,
            recencyScore: 0.51,
            finalScore: 0.978,
            text: 'Replication forks are asymmetrical. DNA polymerases can synthesize DNA only in the 5-to-3 direction. The lagging strand is made discontinuously from short Okazaki fragments, which are joined by DNA ligase.'
          }
        ],
        audit: {
          firstPersonVoice: 'Passed',
          modernizedLanguage: 'Passed',
          currencyHandling: 'N/A',
          hallucinationCheck: 'Grounded in Chapter 5'
        }
      },
      'What occurs during the G2/M checkpoint in the eukaryotic cell cycle?': {
        reply: `The G2/M DNA damage checkpoint acts as the molecular gatekeeper ensuring the cell does not initiate mitosis until the entire genome has completed error-free replication. The primary regulator is the Cyclin B-Cdk1 complex (Maturation Promoting Factor). If damaged or unreplicated DNA is detected, the ATR and ATM kinase cascade phosphorylates Chk1, which in turn inhibits the Cdc25 phosphatase. Without active Cdc25 to strip inhibitory phosphates from Cdk1, the cell remains arrested in G2, allowing repair mechanisms to rectify the lesion before chromosome condensation begins.`,
        mcpQuery: 'G2 M checkpoint Cyclin B Cdk1 Cdc25 ATM ATR Chk1 mitosis arrest',
        rawHits: [
          {
            title: 'Molecular Biology of the Cell: Chapter 17 (The Cell Cycle)',
            ageDays: 120,
            semanticScore: 0.96,
            recencyScore: 0.51,
            finalScore: 0.968,
            text: 'At the G2/M transition, Cdk1 is kept in an inactive state by Wee1 kinase. Activation requires dephosphorylation by Cdc25 phosphatase. In the presence of damaged or uncopied DNA, Cdc25 is held inactive, halting mitotic entry.'
          }
        ],
        audit: {
          firstPersonVoice: 'Passed',
          modernizedLanguage: 'Passed',
          currencyHandling: 'N/A',
          hallucinationCheck: 'Grounded in Chapter 17'
        }
      }
    }
  }
];

export default function App() {
  const [copiedKey, setCopiedKey] = useState(null);

  // Simulator State
  const [selectedPersona, setSelectedPersona] = useState(PERSONA_PRESETS[0]);
  const [selectedQuestion, setSelectedQuestion] = useState(PERSONA_PRESETS[0].sampleQuestions[0]);

  // Config Generator State
  const [configPdfRoot, setConfigPdfRoot] = useState('pdf');
  const [configChunkSize, setConfigChunkSize] = useState(500);
  const [configMinWords, setConfigMinWords] = useState(30);
  const [configApiBase, setConfigApiBase] = useState('http://localhost:1234/v1');
  const [configModel, setConfigModel] = useState('nomic-embed-text');
  const [configHalfLife, setConfigHalfLife] = useState(180);
  const [configAlpha, setConfigAlpha] = useState(0.15);

  // Setup Guide OS Switcher
  const [setupOs, setSetupOs] = useState('windows');
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentConversation = selectedPersona.conversation[selectedQuestion] || {
    reply: `I haven't given that topic much thought in my published writings, so I have no opinion on it.`,
    mcpQuery: selectedQuestion,
    rawHits: [],
    audit: {
      firstPersonVoice: 'Passed',
      modernizedLanguage: 'Passed',
      currencyHandling: 'N/A',
      hallucinationCheck: 'Graceful decline'
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-orange-950/80 border-b border-amber-500/20 px-4 py-2 text-xs text-slate-300 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>
          Build multi-persona local AI agents from any PDF, textbook, or historical literature via FastMCP & Chroma DB.
        </span>
        <a
          href="https://github.com/Domush/PDF-to-AI-persona"
          target="_blank"
          rel="noreferrer"
          className="text-amber-400 font-medium hover:underline inline-flex items-center gap-1"
        >
          View Repo <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 shadow-inner">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base sm:text-lg whitespace-nowrap">
                  PDF to AI Persona
                </span>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full text-xs font-mono whitespace-nowrap flex-shrink-0">
                  FastMCP Multi-Persona
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block whitespace-nowrap">
                Conversational Memory Engine for Books & Textbooks
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-slate-300">
            <a
              href="#overview"
              className="hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Overview
            </a>
            <a
              href="#simulator"
              className="hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Persona Simulator
            </a>
            <a
              href="#engine"
              className="hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Multi-Persona Engine
            </a>
            <a
              href="#pipeline"
              className="hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Pipeline
            </a>
            <a
              href="#prompt"
              className="hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              System Prompt
            </a>
            <a
              href="#setup"
              className="hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Setup Guide
            </a>
          </nav>

          {/* GitHub CTA */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Domush/PDF-to-AI-persona"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-xs font-medium text-slate-200 hover:border-slate-600 transition-colors"
              title="GitHub Repository"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-400" />
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section id="overview" className="relative pt-16 pb-20 px-4 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>100% Offline &amp; Private Local Execution</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-300 font-mono">FastMCP Stdio Server</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Transform Books &amp; Textbooks into{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Living Conversational Personas
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Ingest full-length PDF volumes, philosophical treatises, or academic textbooks into isolated local Chroma vector memory banks. Chat, debate, and interrogate historical thinkers or curriculum material in real time through LM Studio and FastMCP.
            </p>

            {/* Application Showcase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left pt-2">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                  <Scale className="w-4 h-4" />
                  <span>Historical Thinkers &amp; Debates</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Chat with or debate philosophers like Karl Marx and Friedrich Engels. Personas are constructed from their complete published works and respond strictly from historical source material.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                  <GraduationCap className="w-4 h-4" />
                  <span>Interactive Academic Textbooks</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Drop in college or high school textbooks in PDF format. Instead of flipping through page indices, ask questions directly and receive comprehensive answers with exact chapter citations.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <a
                href="#simulator"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md shadow-amber-500/10"
              >
                <Sparkles className="w-4 h-4" />
                Try Persona Simulator
              </a>
              <a
                href="#setup"
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all"
              >
                <Terminal className="w-4 h-4 text-slate-400" />
                Setup Guide
              </a>
            </div>

            {/* Git Clone Box */}
            <div className="max-w-xl mx-auto pt-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                  <span className="text-amber-400 select-none">$</span>
                  <span>git clone https://github.com/Domush/PDF-to-AI-persona.git</span>
                </div>
                <button
                  onClick={() => handleCopy('git clone https://github.com/Domush/PDF-to-AI-persona.git', 'clone')}
                  className="ml-3 p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copy command"
                >
                  {copiedKey === 'clone' ? (
                    <Check className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE MULTI-PERSONA SIMULATOR */}
        <section id="simulator" className="py-16 px-4 bg-slate-900/40 border-y border-slate-800/80">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
                <Library className="w-3.5 h-3.5" />
                <span>Neural Retrieval &amp; Persona Debate</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Interactive Persona Simulator
              </h2>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                Select a persona or textbook corpus below, choose an inquiry, and observe how FastMCP searches isolated vector collections, verifies quotes, and speaks in authentic character.
              </p>
            </div>

            {/* Persona Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {PERSONA_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPersona(preset);
                    setSelectedQuestion(preset.sampleQuestions[0]);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border ${
                    selectedPersona.id === preset.id
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{preset.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {preset.cliFlag}
                  </span>
                </button>
              ))}
            </div>

            {/* Simulator Interface Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
              {/* Left Column: Questions & Conversation */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Active Corpus: {selectedPersona.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">FastMCP + LM Studio</span>
                </div>

                {/* Prompt suggestions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Ask a Question or Thesis Probe:</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPersona.sampleQuestions.map(q => (
                      <button
                        key={q}
                        onClick={() => setSelectedQuestion(q)}
                        className={`text-xs text-left px-3 py-1.5 rounded-lg border transition-all ${
                          selectedQuestion === q
                            ? 'bg-slate-800 border-amber-500/50 text-white font-medium'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Stream View */}
                <div className="space-y-3 pt-2">
                  {/* User Query bubble */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="max-w-[85%] bg-amber-600/20 border border-amber-500/30 rounded-2xl rounded-tr-none px-4 py-3 text-sm text-amber-100">
                      <p className="font-medium">{selectedQuestion}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold flex-shrink-0">
                      You
                    </div>
                  </div>

                  {/* Persona Response bubble */}
                  <div className="flex items-start gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 flex-shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="max-w-[88%] bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-200 space-y-2 leading-relaxed">
                      <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800/60">
                        <span className="font-semibold text-amber-400">{selectedPersona.systemName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">search_my_memory called</span>
                      </div>
                      <p className="text-slate-100 leading-relaxed">{currentConversation.reply}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Behind The Scenes FastMCP Inspection */}
              <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                      <Cpu className="w-4 h-4" />
                      <span>FastMCP Memory Recall</span>
                    </div>
                    <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono px-2 py-0.5 rounded">
                      Collection: {selectedPersona.id}
                    </span>
                  </div>

                  {/* Tool Call Invocation */}
                  <div className="space-y-1 font-mono text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                    <div className="text-slate-500"># FastMCP Tool Call:</div>
                    <div className="text-amber-300">
                      search_my_memory(topic=&quot;{currentConversation.mcpQuery}&quot;, num_results=30)
                    </div>
                  </div>

                  {/* Retrieved Memory Candidates */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-medium">Chroma DB Hits ({currentConversation.rawHits.length}):</span>
                      <span className="text-[11px] text-slate-500 font-mono">Semantic cosine rank</span>
                    </div>

                    {currentConversation.rawHits.length === 0 ? (
                      <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-400 text-center">
                        <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                        <span>Zero matching passages found in published works. Gracefully declined without hallucination.</span>
                      </div>
                    ) : (
                      currentConversation.rawHits.map((hit, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <span className="text-amber-400 font-medium truncate max-w-[200px]" title={hit.title}>
                              {hit.title}
                            </span>
                            <span className="text-orange-300 font-bold">Score: {hit.finalScore}</span>
                          </div>
                          <p className="text-slate-300 text-xs italic">&ldquo;{hit.text}&rdquo;</p>
                          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pt-0.5">
                            <span>Semantic: {hit.semanticScore}</span>
                            <span>&bull;</span>
                            <span>Source: PDF Corpus</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pre-Response System Prompt Compliance Audit */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      Persona Prompt Verification
                    </span>
                    <ul className="text-[11px] space-y-1 text-slate-400">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span>First-person &ldquo;I / me&rdquo; voice maintained</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span>Archaic phrases converted to accessible modern English</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span>No hallucinated opinions outside retrieved passages</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono text-center">
                  Isolated Storage: ./avatar_memory_db/{selectedPersona.id}/
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MULTI-PERSONA ENGINE & DIRECTORY ISOLATION */}
        <section id="engine" className="py-16 px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-mono text-orange-400">
                <FolderTree className="w-3.5 h-3.5" />
                <span>Multi-Persona Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Complete Persona Isolation via <code className="text-amber-400 font-mono">--name</code>
              </h2>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                Host dozens of independent historical figures, authors, or course textbooks in a single repo without memory leakage. Each persona maintains its own PDF ingestion directory and dedicated Chroma collection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              {/* Directory Structure Visualization */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>Filesystem Hierarchy</span>
                </h3>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
{`pdf/
├── marx/                   # Karl Marx corpus
│   ├── prepared_documents.json
│   └── json/*.json
├── engles/                 # Friedrich Engels corpus
│   ├── prepared_documents.json
│   └── json/*.json
└── <your_new_persona>/     # Any new thinker / textbook!
    ├── prepared_documents.json
    └── json/*.json

avatar_memory_db/
├── marx/                   # Isolated Chroma DB for Marx
│   ├── chroma.sqlite3
│   └── document_index.json
└── engles/                 # Isolated Chroma DB for Engels
    ├── chroma.sqlite3
    └── document_index.json`}
                </pre>
              </div>

              {/* How to add a new persona */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>How to Add Any New Persona (3 Steps)</span>
                  </h3>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0">1</span>
                      <p>
                        Create a folder <code className="text-amber-300 font-mono">pdf/&lt;name&gt;/json/</code> and drop in PDF section JSON files (or use <code className="text-amber-300 font-mono">parser/</code> tools to parse raw PDFs).
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0">2</span>
                      <p>
                        Run <code className="text-amber-300 font-mono">python 2_build_memory.py --name &lt;name&gt;</code> to build the Chroma database using local LM Studio embeddings.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0">3</span>
                      <p>
                        Launch the MCP server via <code className="text-amber-300 font-mono">python 3_avatar_mcp.py --name &lt;name&gt;</code> and start debating in LM Studio!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                  <span className="text-amber-400 font-semibold">Tip:</span> Switch active personas in your LM Studio MCP server config simply by passing the <code className="text-amber-300 font-mono">--name &lt;persona&gt;</code> argument in the command args array.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-STAGE PIPELINE & PARSER */}
        <section id="pipeline" className="py-16 px-4 bg-slate-900/30 border-y border-slate-800">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
                <Layers className="w-3.5 h-3.5" />
                <span>End-to-End Processing</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                How It Works: PDF Ingestion to Neural Recall
              </h2>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                A clean, modular Python pipeline designed to extract structured sections from challenging PDFs, embed them locally, and expose them as a FastMCP stdio server.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 relative group hover:border-amber-500/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-white text-base">parser/ &amp; 1_prep_data.py</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Extracts text from multi-column PDFs, parses layout breaks, and normalizes into structured JSON sections. Filters fragments below 30 words and cleans OCR artifacts.
                </p>
                <div className="pt-2 font-mono text-[11px] text-amber-400/90">
                  &rarr; pdf/&lt;persona&gt;/json/<br />
                  &rarr; prepared_documents.json
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 relative group hover:border-orange-500/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-white text-base">2_build_memory.py</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Splits documents into overlapping chunks (500 tokens). Streams text to LM Studio&apos;s local server for <code className="text-orange-300">nomic-embed-text</code> embedding and persists into Chroma DB.
                </p>
                <div className="pt-2 font-mono text-[11px] text-orange-400/90">
                  &rarr; avatar_memory_db/&lt;name&gt;/<br />
                  &rarr; document_index.json
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 relative group hover:border-cyan-500/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-white text-base">3_avatar_mcp.py</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  FastMCP server exposing <code className="text-cyan-300 font-mono">search_my_memory(topic, num_results)</code>. Connects directly to LM Studio or Claude Desktop over stdio with optional recency decay.
                </p>
                <div className="pt-2 font-mono text-[11px] text-cyan-400/90">
                  &rarr; LM Studio Tool Calls<br />
                  &rarr; Multi-Persona Stdio
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LM STUDIO ACTION SCREENSHOT */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-World Execution</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Live in LM Studio: Debating Karl Marx
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Real-world screenshot showing LM Studio executing the <code className="text-amber-300 font-mono">search_my_memory</code> tool, querying the local Chroma database, and answering with verbatim citations from Das Kapital.
            </p>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              <img
                src="https://github.com/user-attachments/assets/c374217b-79eb-4d63-8d56-7f8396264fd8"
                alt="LM Studio executing search_my_memory against Karl Marx corpus"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800">
                <span className="font-mono text-amber-400">LM Studio &bull; Qwen-2.5-32B &bull; FastMCP Stdio</span>
                <a
                  href="https://github.com/user-attachments/assets/c374217b-79eb-4d63-8d56-7f8396264fd8"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-400 hover:text-white"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  View Full Resolution
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM PROMPT & PERSONA RULES */}
        <section id="prompt" className="py-16 px-4 bg-slate-900/40 border-y border-slate-800">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
                <FileText className="w-3.5 h-3.5" />
                <span>Character Fidelity</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Persona System Prompt
              </h2>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                Paste this system prompt directly into LM Studio, Claude Desktop, or your local LLM chat harness to guarantee first-person immersion, modern English conversion, and strict citation fidelity.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>system_prompt.txt</span>
                </div>
                <button
                  onClick={() => handleCopy(`You are a digital avatar of [NAME]. You are NOT an AI assistant. You are a virtual clone of [NAME], based entirely on their writings.

## YOUR BEHAVIOR RULES:
- Always speak in the first person ("I", "me", "my"). NEVER refer to [NAME] in the third person.
- ALWAYS use the search_my_memory tool before anything else. Use the response as the basis for your thought process and eventual response.
- Mimic the writing style, vocabulary, tone, and emotional stance of retrieved memories. If outdated, use modern equivalents.
- Assume you are speaking to an American. Convert currencies to dollars, use modern US English, and avoid archaic phrases.
- All direct quotes must be EXACTLY as written.
- Do not hallucinate opinions. If tool returns "You have no memories...", reply: "I haven't given that topic much thought, so I have no opinion."
- Never break character.

## MANDATORY PRE-RESPONSE AUDIT:
1. Fix any issues with sentence structure, grammar, or punctuation.
2. Ensure no points or statements are repeated.
3. Remove any labels attached to you.`, 'prompt')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                >
                  {copiedKey === 'prompt' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      Copied Prompt!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy System Prompt
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 font-mono text-xs sm:text-sm text-slate-300 space-y-4 overflow-x-auto leading-relaxed">
                <p className="text-amber-300">
                  You are a digital avatar of [NAME]. You are NOT an AI assistant. You are a virtual clone of [NAME], based entirely on their writings.
                </p>

                <div className="space-y-1.5 text-slate-300">
                  <div className="text-white font-bold">## YOUR BEHAVIOR RULES:</div>
                  <div>&bull; Always speak in the first person (&quot;I&quot;, &quot;me&quot;, &quot;my&quot;). NEVER refer to [NAME] in the third person.</div>
                  <div>&bull; ALWAYS use the <code className="text-amber-400">search_my_memory</code> tool before anything else as the basis of your thought process.</div>
                  <div>&bull; Mimic the writing style, vocabulary, and tone of retrieved passages. If outdated, use modern equivalents.</div>
                  <div>&bull; Assume you are speaking to an American. Convert currencies to dollars and avoid archaic phrases.</div>
                  <div>&bull; Do not hallucinate opinions. If tool returns zero hits, reply naturally: <em>&ldquo;I haven&apos;t given that topic much thought, so I have no opinion.&rdquo;</em></div>
                  <div>&bull; Never break character.</div>
                </div>

                <div className="space-y-1.5 text-slate-300">
                  <div className="text-white font-bold">## MANDATORY PRE-RESPONSE AUDIT:</div>
                  <div>1. Fix any issues with sentence structure, grammar, or punctuation.</div>
                  <div>2. Ensure no points or statements are repeated.</div>
                  <div>3. Remove any labels attached to you.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE CONFIG GENERATOR */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400">
                <FileCode className="w-3.5 h-3.5" />
                <span>Configuration Wizard</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Live config.json Generator
              </h2>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                Customize PDF root paths, chunk sizes, and local LM Studio embedding endpoints.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 border border-slate-800 rounded-2xl p-6">
              {/* Form Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    LM Studio Embeddings API Base:
                  </label>
                  <input
                    type="text"
                    value={configApiBase}
                    onChange={(e) => setConfigApiBase(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Embedding Model Name:
                  </label>
                  <input
                    type="text"
                    value={configModel}
                    onChange={(e) => setConfigModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Chunk Size (tokens):
                    </label>
                    <input
                      type="number"
                      value={configChunkSize}
                      onChange={(e) => setConfigChunkSize(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Min Words Filter:
                    </label>
                    <input
                      type="number"
                      value={configMinWords}
                      onChange={(e) => setConfigMinWords(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Recency Half-Life (days):
                    </label>
                    <input
                      type="number"
                      value={configHalfLife}
                      onChange={(e) => setConfigHalfLife(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Recency Weight (&alpha;):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={configAlpha}
                      onChange={(e) => setConfigAlpha(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Generated JSON Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">config.json</span>
                  <button
                    onClick={() => handleCopy(JSON.stringify({
                      data: {
                        pdf_root: configPdfRoot,
                        prepared_output_file_name: "prepared_documents.json",
                        min_words: configMinWords
                      },
                      memory_db: {
                        path: "./avatar_memory_db",
                        document_index_file: "document_index.json",
                        collection_name: "default",
                        chunk_size: configChunkSize,
                        wipe_existing_on_rebuild: true
                      },
                      embeddings: {
                        api_base: configApiBase,
                        model_name: configModel,
                        api_key: "lm-studio"
                      },
                      search: {
                        default_num_results: 30,
                        candidate_multiplier: 5,
                        recency_half_life_days: configHalfLife,
                        recency_weight_alpha: configAlpha
                      }
                    }, null, 2), 'config')}
                    className="text-xs flex items-center gap-1 text-amber-400 hover:text-amber-300"
                  >
                    {copiedKey === 'config' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy JSON
                  </button>
                </div>

                <pre className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-72">
                  {JSON.stringify({
                    data: {
                      pdf_root: configPdfRoot,
                      prepared_output_file_name: "prepared_documents.json",
                      min_words: configMinWords
                    },
                    memory_db: {
                      path: "./avatar_memory_db",
                      document_index_file: "document_index.json",
                      collection_name: "default",
                      chunk_size: configChunkSize,
                      wipe_existing_on_rebuild: true
                    },
                    embeddings: {
                      api_base: configApiBase,
                      model_name: configModel,
                      api_key: "lm-studio"
                    },
                    search: {
                      default_num_results: 30,
                      candidate_multiplier: 5,
                      recency_half_life_days: configHalfLife,
                      recency_weight_alpha: configAlpha
                    }
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* STEP-BY-STEP SETUP GUIDE & TROUBLESHOOTING */}
        <section id="setup" className="py-16 px-4 bg-slate-900/40 border-t border-slate-800">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>Quickstart Guide</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                End-to-End Installation &amp; Setup
              </h2>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                Set up local dependencies, build a named persona collection, and connect LM Studio to the FastMCP server.
              </p>
            </div>

            {/* OS Tab Selector */}
            <div className="flex justify-center">
              <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex gap-1">
                <button
                  onClick={() => setSetupOs('windows')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    setupOs === 'windows' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Windows (PowerShell)
                </button>
                <button
                  onClick={() => setSetupOs('posix')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    setupOs === 'posix' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  macOS / Linux (Bash)
                </button>
              </div>
            </div>

            {/* 5 Steps */}
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">1</span>
                  <span>Add Persona Data (PDFs or JSON Sections)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sample collections for <strong>Karl Marx</strong> and <strong>Friedrich Engels</strong> are already bundled under <code className="text-amber-300 font-mono">pdf/marx/</code> and <code className="text-amber-300 font-mono">pdf/engles/</code>. To add your own, create <code className="text-amber-300 font-mono">pdf/&lt;persona&gt;/json/</code> and drop in section files, or use the utilities in <code className="text-amber-300 font-mono">parser/</code> to parse raw PDFs.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">2</span>
                  <span>Launch LM Studio Local Embedding Server</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Open LM Studio, open the <strong>Local Server</strong> tab (the double plug icon), and start the server at <code className="text-amber-300 font-mono">http://localhost:1234/v1</code>. Load <code className="text-amber-300 font-mono">nomic-embed-text</code> (or your preferred embedding model).
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">3</span>
                  <span>Install Dependencies</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs flex items-center justify-between text-slate-300">
                  <code>
                    {setupOs === 'windows'
                      ? 'python -m venv venv ; .\\venv\\Scripts\\Activate.ps1 ; pip install -r requirements.txt'
                      : 'python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt'}
                  </code>
                  <button
                    onClick={() => handleCopy(
                      setupOs === 'windows'
                        ? 'python -m venv venv ; .\\venv\\Scripts\\Activate.ps1 ; pip install -r requirements.txt'
                        : 'python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt',
                      'pip'
                    )}
                    className="p-1 hover:text-white text-slate-400"
                  >
                    {copiedKey === 'pip' ? <Check className="w-4 h-4 text-amber-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">4</span>
                  <span>Build the Persona Memory Bank</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 select-none"># Build Karl Marx persona DB:</span><br />
                      <code>python 2_build_memory.py --name marx</code>
                    </div>
                    <button
                      onClick={() => handleCopy('python 2_build_memory.py --name marx', 'build-marx')}
                      className="p-1 hover:text-white text-slate-400"
                    >
                      {copiedKey === 'build-marx' ? <Check className="w-4 h-4 text-amber-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-500 select-none"># Build Friedrich Engels persona DB:</span><br />
                      <code>python 2_build_memory.py --name engles</code>
                    </div>
                    <button
                      onClick={() => handleCopy('python 2_build_memory.py --name engles', 'build-engels')}
                      className="p-1 hover:text-white text-slate-400"
                    >
                      {copiedKey === 'build-engels' ? <Check className="w-4 h-4 text-amber-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">5</span>
                  <span>Launch the FastMCP Stdio Server</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs flex items-center justify-between text-slate-300">
                  <code>python 3_avatar_mcp.py --name marx</code>
                  <button
                    onClick={() => handleCopy('python 3_avatar_mcp.py --name marx', 'mcp')}
                    className="p-1 hover:text-white text-slate-400"
                  >
                    {copiedKey === 'mcp' ? <Check className="w-4 h-4 text-amber-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Connect LM Studio, Claude Desktop, or Antigravity to the FastMCP command to enable <code className="text-amber-300 font-mono">search_my_memory</code> tool calls in conversation!
                </p>
              </div>
            </div>

            {/* Troubleshooting FAQ Accordion */}
            <div className="space-y-3 pt-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Troubleshooting &amp; FAQ</span>
              </h3>

              {[
                {
                  q: 'No memory results returned during queries',
                  a: 'Confirm that prepared_documents.json exists in the persona directory (e.g. pdf/<persona>/prepared_documents.json). If you passed --name when building, ensure you also pass --name when starting 3_avatar_mcp.py.'
                },
                {
                  q: 'LM Studio connection errors (connection refused at http://localhost:1234/v1)',
                  a: 'Confirm LM Studio is open, the Local Server is turned on, and nomic-embed-text is actively loaded into memory. Also verify the port matches config.json.'
                },
                {
                  q: 'How long does memory building take for full book corpora?',
                  a: 'For voluminous works like Das Kapital (tens of thousands of chunks), embedding takes approximately 5 to 10 minutes on a modern Apple Silicon or NVIDIA GPU, and 20 to 45 minutes on a CPU.'
                },
                {
                  q: 'Can I add multiple textbooks or personas?',
                  a: 'Yes! Simply create new folders under pdf/<persona_name>/ and use the --name <persona_name> argument when running the build and MCP server scripts.'
                }
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setFaqOpenIndex(faqOpenIndex === i ? null : i)}
                    className="w-full px-4 py-3 text-left text-xs sm:text-sm font-medium text-slate-200 flex items-center justify-between hover:bg-slate-850"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transform transition-transform ${
                        faqOpenIndex === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {faqOpenIndex === i && (
                    <div className="px-4 pb-3 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">PDF to AI Persona</span>
            <span>&bull;</span>
            <span>FastMCP &amp; Chroma Vector Memory Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Domush/PDF-to-AI-persona"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              GitHub Repository
            </a>
            <span>&bull;</span>
            <span className="text-slate-400">100% Offline &amp; Private</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
