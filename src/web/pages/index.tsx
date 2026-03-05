import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Globe,
  Rocket,
  Building2,
  Handshake,
  Search,
  Video,
  Link2,
  MessageCircle,
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  ChevronRight,
  Sparkles,
  Zap,
  Shield,
  BarChart3,
  Bot,
  Quote,
  Target,
  FileSearch,
  CheckCircle2,
  Send,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPinned,
  ArrowRight,
  Play,
  Star,
  Sun,
  Heart,
  Utensils,
} from "lucide-react";

// Animated Counter Hook
const useCountUp = (end: number, duration: number = 2000, suffix: string = "") => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return { count: count + suffix, ref };
};



// Hero Section with video background - Clean centered layout
const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const valueProps = [
    {
      icon: Rocket,
      title: "Ищу инвестиции",
      description: "Для стартапов и проектов",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Ищу проекты",
      description: "Для инвесторов",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Handshake,
      title: "Деловое сотрудничество",
      description: "B2B партнерства",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a1a]">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{
          transform: `scale(${1 + scrollY * 0.0003})`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <source src="./hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a1a] z-[1]" />
      
      {/* Subtle accent color overlay */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* Centered Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="animate-fadeInUp opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-cyan-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Будущее инвестиций уже здесь
          </span>
        </div>
        
        {/* Main Headline */}
        <h1 
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight animate-fadeInUp opacity-0"
          style={{ fontFamily: 'var(--font-orbitron)', animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">GLOBAL</span>
          <br />
          <span className="text-gradient drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">INVESTMENT</span>
          <br />
          <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">MAP</span>
        </h1>
        
        {/* Subtitle */}
        <p 
          className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl animate-fadeInUp opacity-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          style={{ fontFamily: 'var(--font-exo)', animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          Первая в мире визуальная инвестиционная экосистема
        </p>

        {/* CTA Buttons - Centered */}
        <div 
          className="flex flex-wrap gap-4 justify-center mb-16 animate-fadeInUp opacity-0"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          <Link href="/map">
            <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white flex items-center gap-2 hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all duration-300 transform hover:scale-105">
              <Globe className="w-5 h-5" />
              Открыть карту инвестиций
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <button className="px-8 py-4 glass rounded-xl font-bold text-white border border-purple-500/30 hover:border-purple-500/60 flex items-center gap-2 transition-all duration-300 backdrop-blur-md">
            <Rocket className="w-5 h-5 text-purple-400" />
            Разместить проект
          </button>
        </div>

        {/* Value Propositions - Centered below buttons */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl animate-fadeInUp opacity-0"
          style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
        >
          {valueProps.map((prop, index) => (
            <div
              key={prop.title}
              className="group p-6 glass rounded-2xl hover:border-cyan-500/30 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${prop.gradient} p-2.5 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <prop.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'var(--font-orbitron)' }}>
                {prop.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 rounded-full border-2 border-cyan-400/50 flex items-start justify-center p-2 backdrop-blur-sm">
          <div className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

// Featured Projects Data - Showcasing top EU investments
const featuredProjects = [
  {
    id: 19,
    name: "Mistral AI",
    category: "ai",
    amount: "€1.7B",
    roi: "Series B",
    description: "Европейский лидер генеративного AI",
    city: "Paris",
    country: "🇫🇷",
  },
  {
    id: 14,
    name: "Enpal",
    category: "energy",
    amount: "€810M",
    roi: "18% ROI",
    description: "Солнечные панели по подписке",
    city: "Berlin",
    country: "🇩🇪",
  },
  {
    id: 10,
    name: "Nscale",
    category: "ai",
    amount: "$1.53B",
    roi: "Series B",
    description: "GPU-дата центры для AI",
    city: "London",
    country: "🇬🇧",
  },
  {
    id: 43,
    name: "Klarna",
    category: "fintech",
    amount: "€1.2B",
    roi: "Series H",
    description: "Buy Now Pay Later лидер",
    city: "Stockholm",
    country: "🇸🇪",
  },
  {
    id: 35,
    name: "Stripe",
    category: "fintech",
    amount: "€500M",
    roi: "12% ROI",
    description: "Глобальная платежная инфраструктура",
    city: "Dublin",
    country: "🇮🇪",
  },
  {
    id: 33,
    name: "Grammarly",
    category: "ai",
    amount: "$1B",
    roi: "Series F",
    description: "AI-ассистент для письма",
    city: "Kyiv",
    country: "🇺🇦",
  },
];

const featuredCategoryConfig: Record<string, { color: string; label: string; icon: typeof Sun }> = {
  energy: { color: "#10b981", label: "Энергия", icon: Sun },
  tech: { color: "#3b82f6", label: "Технологии", icon: Zap },
  health: { color: "#ef4444", label: "Здоровье", icon: Heart },
  realestate: { color: "#f59e0b", label: "Недвижимость", icon: Building2 },
  food: { color: "#a855f7", label: "F&B", icon: Utensils },
  ai: { color: "#06b6d4", label: "AI/ML", icon: Sparkles },
  fintech: { color: "#22c55e", label: "FinTech", icon: DollarSign },
  mobility: { color: "#f59e0b", label: "Мобильность", icon: Globe },
  infrastructure: { color: "#6366f1", label: "Инфраструктура", icon: Building2 },
};

// Featured Projects Carousel
const FeaturedProjectsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0a0a1a 0%, #12122a 50%, #0a0a1a 100%)'
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-cyan-400 text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Избранные проекты
            </span>
            <h2 
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Топ <span className="text-gradient">возможности</span>
            </h2>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 hover:border-cyan-500/50 transition-all group"
            >
              <ChevronRight className="w-6 h-6 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10 hover:border-cyan-500/50 transition-all group"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-6 px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredProjects.map((project, index) => {
            const config = featuredCategoryConfig[project.category];
            const Icon = config?.icon || Building2;
            
            return (
              <div
                key={project.id}
                className="flex-shrink-0 w-[320px] snap-start group"
              >
                <div 
                  className="h-full p-6 glass rounded-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                  style={{
                    borderColor: 'transparent',
                    background: 'rgba(26, 26, 46, 0.6)',
                  }}
                >
                  {/* Gradient border on hover */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${config?.color}40, transparent 50%, #7c3aed40)`,
                      padding: '1px',
                    }}
                  />
                  <div 
                    className="absolute inset-[1px] rounded-2xl pointer-events-none"
                    style={{
                      background: 'rgba(26, 26, 46, 0.95)',
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Category badge & image placeholder */}
                    <div 
                      className="h-40 rounded-xl mb-5 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${config?.color}15, ${config?.color}05)`,
                        border: `1px solid ${config?.color}20`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon 
                          className="w-16 h-16 opacity-30" 
                          style={{ color: config?.color }}
                        />
                      </div>
                      <div 
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: `${config?.color}30`,
                          color: config?.color,
                        }}
                      >
                        {config?.label}
                      </div>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg glass-light text-xs text-gray-300">
                        <span className="text-sm">{project.country}</span>
                        {project.city}
                      </div>
                    </div>

                    {/* Project info */}
                    <h3 
                      className="text-lg font-bold text-white mb-2 line-clamp-1"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      {project.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-5 py-3 border-t border-white/10">
                      <div>
                        <p className="text-gray-500 text-xs">Сумма</p>
                        <p className="text-white font-bold" style={{ fontFamily: 'var(--font-orbitron)' }}>
                          {project.amount}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-xs">Доходность</p>
                        <p className="text-green-400 font-semibold">{project.roi}</p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button 
                      onClick={() => setLocation('/map')}
                      className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn hover:scale-[1.02] hover:shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${config?.color}, ${config?.color}cc)`,
                        boxShadow: `0 4px 20px ${config?.color}30`,
                      }}
                    >
                      <MapPin className="w-4 h-4" />
                      На карте
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all link */}
        <div className="text-center mt-8">
          <Link href="/map">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-cyan-400 font-semibold hover:bg-white/5 hover:border-cyan-500/50 transition-all group">
              Смотреть все проекты на карте
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Metrics Section
const MetricsSection = () => {
  const metrics = [
    { value: 402, suffix: "M", prefix: "$", label: "Выручка", icon: DollarSign },
    { value: 150, suffix: "K", prefix: "", label: "Проектов", icon: Building2 },
    { value: 350, suffix: "K", prefix: "", label: "Инвесторов", icon: Users },
    { value: 32, suffix: "+", prefix: "", label: "Стран", icon: MapPin },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0a0a1a 100%)'
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="glass rounded-3xl p-12 md:p-16">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Наши <span className="text-gradient-cyan">достижения</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => {
              const counter = useCountUp(metric.value, 2000);
              return (
                <div 
                  key={metric.label} 
                  ref={counter.ref}
                  className="text-center group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-light flex items-center justify-center group-hover:scale-110 transition-transform">
                    <metric.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div 
                    className="text-4xl md:text-5xl font-black text-gradient mb-2"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    {metric.prefix}{counter.count}{metric.suffix}
                  </div>
                  <div className="text-gray-400 font-medium">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// How It Works Section (NEW)
const HowItWorksSection = () => {
  const investorSteps = [
    { icon: Target, title: "Определите критерии", description: "Укажите предпочтительные отрасли, объем инвестиций и уровень риска" },
    { icon: FileSearch, title: "Изучите карту", description: "Используйте интерактивную карту для поиска проектов по всему миру" },
    { icon: MessageCircle, title: "Свяжитесь с основателями", description: "Назначайте встречи и ведите переговоры через платформу" },
    { icon: CheckCircle2, title: "Инвестируйте", description: "Безопасно проводите сделки с использованием блокчейн технологий" },
  ];

  const entrepreneurSteps = [
    { icon: Rocket, title: "Создайте профиль", description: "Зарегистрируйте проект и заполните детальную информацию" },
    { icon: Video, title: "Добавьте питч", description: "Загрузите видео-презентацию и материалы о компании" },
    { icon: MapPinned, title: "Отметьте на карте", description: "Укажите местоположение и появитесь перед глобальной аудиторией" },
    { icon: Handshake, title: "Получите финансирование", description: "Принимайте предложения от проверенных инвесторов" },
  ];

  const [activeTab, setActiveTab] = useState<'investor' | 'entrepreneur'>('investor');

  return (
    <section className="py-24 bg-[#0a0a1a] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Как это <span className="text-gradient">работает</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Простой путь к вашим инвестиционным целям
          </p>
          
          {/* Tab buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('investor')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'investor'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Для инвесторов
            </button>
            <button
              onClick={() => setActiveTab('entrepreneur')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'entrepreneur'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              <Rocket className="w-5 h-5 inline mr-2" />
              Для предпринимателей
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {(activeTab === 'investor' ? investorSteps : entrepreneurSteps).map((step, index) => (
            <div
              key={step.title}
              className="relative group"
            >
              {/* Connection line */}
              {index < 3 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent z-0" />
              )}
              
              <div className="relative z-10 p-6 glass rounded-2xl hover:border-cyan-500/30 transition-all duration-300 h-full">
                <div className={`w-12 h-12 rounded-xl ${
                  activeTab === 'investor' 
                    ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30' 
                    : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                } flex items-center justify-center mb-4`}>
                  <step.icon className={`w-6 h-6 ${activeTab === 'investor' ? 'text-cyan-400' : 'text-purple-400'}`} />
                </div>
                
                <div className="text-4xl font-black text-white/10 absolute top-4 right-4" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  0{index + 1}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section (NEW)
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "GIM полностью изменил наш подход к поиску инвестиций. За 3 месяца мы привлекли €2M от инвесторов из 5 стран.",
      author: "Алексей Петров",
      role: "CEO, TechVenture",
      avatar: "AP",
      rating: 5,
    },
    {
      quote: "Интерактивная карта — это гениально! Я нашел 3 перспективных проекта в секторе зеленой энергетики всего за неделю.",
      author: "Мария Соколова",
      role: "Angel Investor",
      avatar: "МС",
      rating: 5,
    },
    {
      quote: "AI-помощник NOVA сэкономил мне сотни часов анализа. Рекомендации точные и релевантные.",
      author: "Дмитрий Волков",
      role: "VC Partner, Horizon Fund",
      avatar: "ДВ",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0a0a1a 100%)'
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Отзывы <span className="text-gradient">партнеров</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Истории успеха от тех, кто уже использует платформу
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="p-8 glass rounded-2xl hover:border-purple-500/30 transition-all duration-500 transform hover:-translate-y-2 animate-fadeInUp opacity-0"
              style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <Quote className="w-10 h-10 text-cyan-400/30 mb-4" />
              
              <p className="text-gray-300 leading-relaxed mb-6 text-lg italic">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.author}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: Bot,
      title: "AI-поиск NOVA",
      description: "Искусственный интеллект анализирует тысячи проектов и находит идеальные совпадения для вашего портфеля",
      color: "cyan",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: Video,
      title: "Видео-презентации",
      description: "Создавайте и просматривайте профессиональные видео-питчи прямо на платформе",
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Link2,
      title: "Блокчейн токенизация",
      description: "Безопасные транзакции и токенизация активов на основе блокчейн технологий",
      color: "green",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: MessageCircle,
      title: "Real-time коммуникация",
      description: "Мгновенная связь между инвесторами и основателями проектов",
      color: "orange",
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <section className="py-24 bg-[#0a0a1a] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Возможности <span className="text-gradient">платформы</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Передовые технологии для эффективных инвестиций
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group flex gap-6 p-8 glass rounded-2xl hover:border-cyan-500/30 transition-all duration-300 animate-fadeInUp opacity-0"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3.5 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-full h-full text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Problem/Solution Section
const ProblemSolutionSection = () => {
  const problems = [
    "Разрозненные инвестиционные платформы",
    "Сложность поиска релевантных проектов",
    "Отсутствие визуализации возможностей",
    "Барьеры в коммуникации",
  ];

  const solutions = [
    "Единая глобальная экосистема",
    "AI-алгоритмы подбора",
    "Интерактивная карта инвестиций",
    "Встроенные инструменты связи",
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%)'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            От проблемы к <span className="text-gradient">решению</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Problems */}
          <div className="glass rounded-2xl p-8 border-red-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
                Проблемы рынка
              </h3>
            </div>
            <ul className="space-y-4">
              {problems.map((problem, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-300">
                  <span className="w-2 h-2 bg-red-400 rounded-full" />
                  {problem}
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="glass rounded-2xl p-8 border-green-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
                Наше решение
              </h3>
            </div>
            <ul className="space-y-4">
              {solutions.map((solution, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-300">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  {solution}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// Business Model Section
const BusinessModelSection = () => {
  const streams = [
    { icon: BarChart3, label: "Премиум подписки" },
    { icon: Search, label: "Рекламные размещения" },
    { icon: Link2, label: "Комиссии за сделки" },
    { icon: Video, label: "Продвижение проектов" },
    { icon: Bot, label: "API доступ" },
    { icon: Users, label: "Консалтинг" },
    { icon: Shield, label: "Верификация" },
  ];

  return (
    <section className="py-24 bg-[#0a0a1a] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Бизнес-модель: <span className="text-gradient">7 потоков</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Диверсифицированная монетизация для устойчивого роста
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {streams.map((stream, index) => (
            <div
              key={stream.label}
              className="group px-6 py-4 glass rounded-full flex items-center gap-3 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105"
            >
              <stream.icon className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">{stream.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 50%, rgba(0, 212, 255, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 50%, rgba(124, 58, 237, 0.2) 0%, transparent 50%),
            #0a0a1a
          `
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-4xl md:text-6xl font-black text-white mb-6"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Готовы начать <span className="text-gradient">инвестировать</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Присоединяйтесь к глобальному сообществу инвесторов и предпринимателей уже сегодня
          </p>

          <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/map">
              <button className="group px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl font-bold text-white text-lg flex items-center gap-3 hover:shadow-[0_0_50px_rgba(0,212,255,0.5)] transition-all duration-300 transform hover:scale-105">
                <Globe className="w-6 h-6" />
                Открыть карту инвестиций
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
            <button className="px-10 py-5 glass rounded-2xl font-bold text-white text-lg border border-white/20 hover:border-white/40 flex items-center gap-3 transition-all duration-300">
              <Rocket className="w-6 h-6 text-purple-400" />
              Разместить проект
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Footer
const Footer = () => {
  const footerLinks = {
    platform: [
      { label: "Карта инвестиций", href: "/map" },
      { label: "AI-помощник NOVA", href: "#" },
      { label: "Токенизация", href: "#" },
      { label: "API для разработчиков", href: "#" },
    ],
    company: [
      { label: "О нас", href: "#" },
      { label: "Команда", href: "#" },
      { label: "Карьера", href: "#" },
      { label: "Пресс-кит", href: "#" },
    ],
    resources: [
      { label: "Блог", href: "#" },
      { label: "Справочный центр", href: "#" },
      { label: "Руководства", href: "#" },
      { label: "Сообщество", href: "#" },
    ],
    legal: [
      { label: "Политика конфиденциальности", href: "#" },
      { label: "Условия использования", href: "#" },
      { label: "Правовая информация", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  };

  return (
    <footer className="pt-20 pb-10 bg-[#050510] border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
                GIM
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Глобальная визуальная инвестиционная экосистема, соединяющая инвесторов и проекты по всему миру.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <a href="mailto:contact@gim.io" className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors">
                <Mail className="w-5 h-5" />
                contact@gim.io
              </a>
              <a href="tel:+442071234567" className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors">
                <Phone className="w-5 h-5" />
                +44 207 123 4567
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPinned className="w-5 h-5" />
                London, UK
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>Платформа</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-cyan-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>Компания</h4>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-cyan-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>Ресурсы</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-cyan-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>Правовая информация</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-cyan-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm">
            © 2024 Global Investment Map. Все права защищены.
          </p>
          
          {/* Social links */}
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
              <Send className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Page Component
const Index = () => {
  return (
    <div className="min-h-screen bg-[#0a0a1a] page-transition">
      <HeroSection />
      <MetricsSection />
      <FeaturedProjectsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FeaturesSection />
      <ProblemSolutionSection />
      <BusinessModelSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
