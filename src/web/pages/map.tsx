import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  Globe,
  Search,
  Filter,
  X,
  ChevronDown,
  MapPin,
  TrendingUp,
  Building2,
  Utensils,
  Heart,
  Zap,
  Sun,
  Wind,
  Bot,
  Map as MapIcon,
  Satellite,
  Users,
  Calendar,
  BarChart3,
  ChevronRight,
  Info,
  Minus,
  Plus,
  Mic,
  Sparkles,
  Target,
  DollarSign,
  FileText,
  Play,
  Mail,
  Phone,
  Share2,
  Star,
  Clock,
  Shield,
  Award,
  ExternalLink,
  Cpu,
  Car,
  Wifi,
  Gamepad2,
  Banknote,
  Database,
  Activity,
  Flag,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

// Investment data
interface InvestmentProject {
  id: number;
  name: string;
  category: "energy" | "tech" | "realestate" | "food" | "health" | "ai" | "defense" | "mobility" | "infrastructure" | "gaming" | "fintech";
  amount: string;
  amountValue: number;
  roi: string;
  stage: string;
  description: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  countryCode: string;
  teamSize?: number;
  foundedYear?: number;
  fundingProgress?: number;
  timeline?: string;
}

const investmentProjects: InvestmentProject[] = [
  // UK Projects (existing)
  {
    id: 1,
    name: "Solar Farm Yorkshire",
    category: "energy",
    amount: "£500K",
    amountValue: 500000,
    roi: "14% ROI",
    stage: "Operational",
    description: "Солнечная ферма мощностью 15 МВт с гарантированными тарифами и долгосрочными контрактами на поставку электроэнергии.",
    lat: 53.8008,
    lng: -1.5491,
    city: "Leeds",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 12,
    foundedYear: 2021,
    fundingProgress: 85,
    timeline: "Q2 2025",
  },
  {
    id: 2,
    name: "Tech Startup London",
    category: "tech",
    amount: "£250K",
    amountValue: 250000,
    roi: "Seed Stage",
    stage: "Seed",
    description: "AI-платформа для автоматизации финансовой отчетности. Команда из выпускников Oxford и Google.",
    lat: 51.5074,
    lng: -0.1278,
    city: "London",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 8,
    foundedYear: 2023,
    fundingProgress: 60,
    timeline: "Q4 2024",
  },
  {
    id: 3,
    name: "Restaurant Manchester",
    category: "food",
    amount: "£150K",
    amountValue: 150000,
    roi: "22% ROI",
    stage: "Profitable",
    description: "Премиальный ресторан fusion-кухни в центре города. Стабильная прибыль 3 года подряд.",
    lat: 53.4808,
    lng: -2.2426,
    city: "Manchester",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 25,
    foundedYear: 2020,
    fundingProgress: 100,
    timeline: "Действует",
  },
  {
    id: 4,
    name: "Med-Tech Cambridge",
    category: "health",
    amount: "£1.2M",
    amountValue: 1200000,
    roi: "Series A",
    stage: "Series A",
    description: "Разработка неинвазивного устройства мониторинга глюкозы. Патенты в 12 странах.",
    lat: 52.2053,
    lng: 0.1218,
    city: "Cambridge",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 35,
    foundedYear: 2019,
    fundingProgress: 45,
    timeline: "Q1 2025",
  },
  {
    id: 5,
    name: "Wind Farm Scotland",
    category: "energy",
    amount: "£2M",
    amountValue: 2000000,
    roi: "12% ROI",
    stage: "Construction",
    description: "Ветряная электростанция на 8 турбин. Государственные субсидии одобрены.",
    lat: 55.9533,
    lng: -3.1883,
    city: "Edinburgh",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 18,
    foundedYear: 2022,
    fundingProgress: 70,
    timeline: "Q3 2025",
  },
  {
    id: 6,
    name: "PropTech Birmingham",
    category: "realestate",
    amount: "£400K",
    amountValue: 400000,
    roi: "Pre-seed",
    stage: "Pre-seed",
    description: "Платформа для инвестиций в коммерческую недвижимость с токенизацией активов.",
    lat: 52.4862,
    lng: -1.8904,
    city: "Birmingham",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 6,
    foundedYear: 2023,
    fundingProgress: 25,
    timeline: "Q2 2025",
  },
  {
    id: 7,
    name: "FinTech Bristol",
    category: "fintech",
    amount: "£800K",
    amountValue: 800000,
    roi: "Series A",
    stage: "Series A",
    description: "Необанк для малого бизнеса с интегрированным бухгалтерским учетом.",
    lat: 51.4545,
    lng: -2.5879,
    city: "Bristol",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 42,
    foundedYear: 2021,
    fundingProgress: 55,
    timeline: "Q4 2024",
  },
  {
    id: 8,
    name: "BioTech Oxford",
    category: "health",
    amount: "£3M",
    amountValue: 3000000,
    roi: "Series B",
    stage: "Series B",
    description: "Разработка новых методов лечения нейродегенеративных заболеваний.",
    lat: 51.7520,
    lng: -1.2577,
    city: "Oxford",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 85,
    foundedYear: 2017,
    fundingProgress: 80,
    timeline: "Q1 2025",
  },
  // New UK projects
  {
    id: 9,
    name: "CityFibre",
    category: "infrastructure",
    amount: "£2.3B",
    amountValue: 2300000000,
    roi: "8% ROI",
    stage: "Operational",
    description: "Крупнейший независимый оператор оптоволоконной инфраструктуры в Великобритании. Full-fibre broadband для городов.",
    lat: 51.52,
    lng: -0.08,
    city: "London",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 850,
    foundedYear: 2011,
    fundingProgress: 92,
    timeline: "Действует",
  },
  {
    id: 10,
    name: "Nscale",
    category: "ai",
    amount: "$1.53B",
    amountValue: 1530000000,
    roi: "Series B",
    stage: "Series B",
    description: "Инфраструктура GPU-дата центров для AI-вычислений. Партнерство с NVIDIA и крупнейшими tech-компаниями.",
    lat: 51.50,
    lng: -0.11,
    city: "London",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 120,
    foundedYear: 2022,
    fundingProgress: 68,
    timeline: "Q2 2025",
  },
  {
    id: 11,
    name: "Isomorphic Labs",
    category: "ai",
    amount: "$600M",
    amountValue: 600000000,
    roi: "Series A",
    stage: "Series A",
    description: "AI-платформа для открытия лекарств от Alphabet. Использует AlphaFold для разработки новых медикаментов.",
    lat: 51.53,
    lng: -0.12,
    city: "London",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 200,
    foundedYear: 2021,
    fundingProgress: 75,
    timeline: "Q1 2026",
  },
  {
    id: 12,
    name: "Capital on Tap",
    category: "fintech",
    amount: "£500M",
    amountValue: 500000000,
    roi: "15% ROI",
    stage: "Series C",
    description: "Бизнес-кредитные карты для SMB. Более 200,000 активных клиентов в UK и USA.",
    lat: 51.51,
    lng: -0.10,
    city: "London",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 180,
    foundedYear: 2012,
    fundingProgress: 88,
    timeline: "Действует",
  },
  {
    id: 13,
    name: "Ferovinum",
    category: "fintech",
    amount: "£400M",
    amountValue: 400000000,
    roi: "12% ROI",
    stage: "Series B",
    description: "Финансирование для винной и спиртной индустрии. Инновационная платформа supply chain finance.",
    lat: 51.49,
    lng: -0.07,
    city: "London",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 45,
    foundedYear: 2019,
    fundingProgress: 62,
    timeline: "Q3 2025",
  },
  // GERMANY
  {
    id: 14,
    name: "Enpal",
    category: "energy",
    amount: "€810M",
    amountValue: 810000000,
    roi: "18% ROI",
    stage: "Series D",
    description: "Солнечные панели, системы хранения энергии и тепловые насосы по подписке. Лидер рынка возобновляемой энергии в Германии.",
    lat: 52.52,
    lng: 13.405,
    city: "Berlin",
    country: "Germany",
    countryCode: "🇩🇪",
    teamSize: 4500,
    foundedYear: 2017,
    fundingProgress: 95,
    timeline: "Действует",
  },
  {
    id: 15,
    name: "Helsing",
    category: "defense",
    amount: "€600M",
    amountValue: 600000000,
    roi: "Series C",
    stage: "Series C",
    description: "AI-платформа для оборонного сектора. Программное обеспечение для военной разведки и автономных систем.",
    lat: 48.1351,
    lng: 11.582,
    city: "Munich",
    country: "Germany",
    countryCode: "🇩🇪",
    teamSize: 400,
    foundedYear: 2021,
    fundingProgress: 78,
    timeline: "Q2 2025",
  },
  {
    id: 16,
    name: "IONITY",
    category: "mobility",
    amount: "€600M",
    amountValue: 600000000,
    roi: "10% ROI",
    stage: "Operational",
    description: "Сеть ультрабыстрых зарядных станций для электромобилей. Joint venture BMW, Ford, Hyundai, Mercedes, VW.",
    lat: 48.15,
    lng: 11.55,
    city: "Munich",
    country: "Germany",
    countryCode: "🇩🇪",
    teamSize: 350,
    foundedYear: 2017,
    fundingProgress: 85,
    timeline: "Действует",
  },
  {
    id: 17,
    name: "Finn",
    category: "mobility",
    amount: "€1B",
    amountValue: 1000000000,
    roi: "Series C",
    stage: "Series C",
    description: "Подписка на автомобили — альтернатива лизингу и покупке. Более 50,000 активных подписчиков.",
    lat: 48.14,
    lng: 11.60,
    city: "Munich",
    country: "Germany",
    countryCode: "🇩🇪",
    teamSize: 280,
    foundedYear: 2019,
    fundingProgress: 72,
    timeline: "Q4 2025",
  },
  {
    id: 18,
    name: "Bees & Bears",
    category: "fintech",
    amount: "€505M",
    amountValue: 505000000,
    roi: "14% ROI",
    stage: "Series B",
    description: "Climate FinTech — встроенное финансирование для сектора возобновляемой энергии.",
    lat: 53.5511,
    lng: 9.9937,
    city: "Hamburg",
    country: "Germany",
    countryCode: "🇩🇪",
    teamSize: 95,
    foundedYear: 2020,
    fundingProgress: 58,
    timeline: "Q1 2026",
  },
  // FRANCE
  {
    id: 19,
    name: "Mistral AI",
    category: "ai",
    amount: "€1.7B",
    amountValue: 1700000000,
    roi: "Series B",
    stage: "Series B",
    description: "Европейский лидер в области генеративного AI. Разработка open-source LLM моделей мирового класса.",
    lat: 48.8566,
    lng: 2.3522,
    city: "Paris",
    country: "France",
    countryCode: "🇫🇷",
    teamSize: 60,
    foundedYear: 2023,
    fundingProgress: 85,
    timeline: "Q2 2025",
  },
  {
    id: 20,
    name: "Ubisoft",
    category: "gaming",
    amount: "€1.16B",
    amountValue: 1160000000,
    roi: "8% ROI",
    stage: "Operational",
    description: "Один из крупнейших издателей видеоигр. Assassin's Creed, Far Cry, Watch Dogs и другие франшизы.",
    lat: 48.87,
    lng: 2.33,
    city: "Paris",
    country: "France",
    countryCode: "🇫🇷",
    teamSize: 19000,
    foundedYear: 1986,
    fundingProgress: 100,
    timeline: "Действует",
  },
  {
    id: 21,
    name: "Brevo (Sendinblue)",
    category: "tech",
    amount: "€500M",
    amountValue: 500000000,
    roi: "Series C",
    stage: "Series C",
    description: "CRM и маркетинговая платформа. Email, SMS, chat — все инструменты коммуникации с клиентами.",
    lat: 48.85,
    lng: 2.36,
    city: "Paris",
    country: "France",
    countryCode: "🇫🇷",
    teamSize: 800,
    foundedYear: 2012,
    fundingProgress: 90,
    timeline: "Действует",
  },
  // NETHERLANDS
  {
    id: 22,
    name: "NXP Semiconductors",
    category: "tech",
    amount: "€1B",
    amountValue: 1000000000,
    roi: "11% ROI",
    stage: "Operational",
    description: "Мировой лидер в производстве микроконтроллеров и процессоров для автомобилей и IoT.",
    lat: 51.4416,
    lng: 5.4697,
    city: "Eindhoven",
    country: "Netherlands",
    countryCode: "🇳🇱",
    teamSize: 31000,
    foundedYear: 2006,
    fundingProgress: 100,
    timeline: "Действует",
  },
  {
    id: 23,
    name: "Nebius",
    category: "ai",
    amount: "$1B",
    amountValue: 1000000000,
    roi: "Series B",
    stage: "Series B",
    description: "GPU облачная инфраструктура для AI-вычислений. Бывшее подразделение Yandex, теперь независимая компания.",
    lat: 52.3676,
    lng: 4.9041,
    city: "Amsterdam",
    country: "Netherlands",
    countryCode: "🇳🇱",
    teamSize: 450,
    foundedYear: 2023,
    fundingProgress: 65,
    timeline: "Q3 2025",
  },
  {
    id: 24,
    name: "Your.World",
    category: "infrastructure",
    amount: "€800M",
    amountValue: 800000000,
    roi: "12% ROI",
    stage: "Series B",
    description: "Платформа веб-сервисов и облачных решений для европейского рынка.",
    lat: 52.38,
    lng: 4.88,
    city: "Amsterdam",
    country: "Netherlands",
    countryCode: "🇳🇱",
    teamSize: 200,
    foundedYear: 2018,
    fundingProgress: 70,
    timeline: "Q4 2025",
  },
  // SWEDEN
  {
    id: 25,
    name: "EcoDataCenter",
    category: "infrastructure",
    amount: "€1.05B",
    amountValue: 1050000000,
    roi: "9% ROI",
    stage: "Operational",
    description: "Устойчивые дата-центры для AI и облачных вычислений. 100% возобновляемая энергия.",
    lat: 59.3293,
    lng: 18.0686,
    city: "Stockholm",
    country: "Sweden",
    countryCode: "🇸🇪",
    teamSize: 180,
    foundedYear: 2016,
    fundingProgress: 88,
    timeline: "Действует",
  },
  {
    id: 26,
    name: "Elvy",
    category: "energy",
    amount: "€500M",
    amountValue: 500000000,
    roi: "15% ROI",
    stage: "Series B",
    description: "Решения для управления энергией. Smart grid и оптимизация потребления для бизнеса.",
    lat: 59.34,
    lng: 18.05,
    city: "Stockholm",
    country: "Sweden",
    countryCode: "🇸🇪",
    teamSize: 120,
    foundedYear: 2019,
    fundingProgress: 55,
    timeline: "Q2 2025",
  },
  {
    id: 27,
    name: "Lovable",
    category: "ai",
    amount: "€470M",
    amountValue: 470000000,
    roi: "Series B",
    stage: "Series B",
    description: "AI-powered конструктор приложений. No-code платформа для создания мобильных и веб-приложений.",
    lat: 59.32,
    lng: 18.08,
    city: "Stockholm",
    country: "Sweden",
    countryCode: "🇸🇪",
    teamSize: 85,
    foundedYear: 2021,
    fundingProgress: 72,
    timeline: "Q3 2025",
  },
  // FINLAND
  {
    id: 28,
    name: "Nokia",
    category: "infrastructure",
    amount: "$1B",
    amountValue: 1000000000,
    roi: "7% ROI",
    stage: "Operational",
    description: "Глобальный лидер в сетевой инфраструктуре. 5G, оптические сети, enterprise solutions.",
    lat: 60.205,
    lng: 24.656,
    city: "Espoo",
    country: "Finland",
    countryCode: "🇫🇮",
    teamSize: 86000,
    foundedYear: 1865,
    fundingProgress: 100,
    timeline: "Действует",
  },
  {
    id: 29,
    name: "Oura",
    category: "health",
    amount: "$900M",
    amountValue: 900000000,
    roi: "Series D",
    stage: "Series D",
    description: "Смарт-кольцо для мониторинга здоровья. Отслеживание сна, активности и биометрии.",
    lat: 65.0121,
    lng: 25.4651,
    city: "Oulu",
    country: "Finland",
    countryCode: "🇫🇮",
    teamSize: 500,
    foundedYear: 2013,
    fundingProgress: 85,
    timeline: "Действует",
  },
  // ITALY
  {
    id: 30,
    name: "Bending Spoons",
    category: "tech",
    amount: "€1.1B",
    amountValue: 1100000000,
    roi: "20% ROI",
    stage: "Series B",
    description: "Разработчик consumer software. Портфель успешных мобильных приложений с миллионами пользователей.",
    lat: 45.4642,
    lng: 9.19,
    city: "Milan",
    country: "Italy",
    countryCode: "🇮🇹",
    teamSize: 400,
    foundedYear: 2013,
    fundingProgress: 92,
    timeline: "Действует",
  },
  // SPAIN
  {
    id: 31,
    name: "Wallbox",
    category: "mobility",
    amount: "€350M",
    amountValue: 350000000,
    roi: "12% ROI",
    stage: "Operational",
    description: "Зарядные станции для электромобилей. Умные решения для дома, бизнеса и публичной инфраструктуры.",
    lat: 41.3874,
    lng: 2.1686,
    city: "Barcelona",
    country: "Spain",
    countryCode: "🇪🇸",
    teamSize: 1200,
    foundedYear: 2015,
    fundingProgress: 78,
    timeline: "Действует",
  },
  {
    id: 32,
    name: "Glovo",
    category: "tech",
    amount: "€450M",
    amountValue: 450000000,
    roi: "Series F",
    stage: "Series F",
    description: "On-demand delivery платформа. Доставка еды, продуктов и любых товаров в 25+ странах.",
    lat: 41.40,
    lng: 2.17,
    city: "Barcelona",
    country: "Spain",
    countryCode: "🇪🇸",
    teamSize: 5000,
    foundedYear: 2015,
    fundingProgress: 88,
    timeline: "Действует",
  },
  // UKRAINE
  {
    id: 33,
    name: "Grammarly",
    category: "ai",
    amount: "$1B",
    amountValue: 1000000000,
    roi: "Series F",
    stage: "Series F",
    description: "AI-ассистент для письма. Проверка грамматики, стиля и тона на основе машинного обучения.",
    lat: 50.4501,
    lng: 30.5234,
    city: "Kyiv",
    country: "Ukraine",
    countryCode: "🇺🇦",
    teamSize: 800,
    foundedYear: 2009,
    fundingProgress: 95,
    timeline: "Действует",
  },
  // POLAND
  {
    id: 34,
    name: "DocPlanner",
    category: "health",
    amount: "€300M",
    amountValue: 300000000,
    roi: "Series E",
    stage: "Series E",
    description: "Платформа для записи к врачам. Миллионы пользователей в Европе и Латинской Америке.",
    lat: 52.2297,
    lng: 21.0122,
    city: "Warsaw",
    country: "Poland",
    countryCode: "🇵🇱",
    teamSize: 2500,
    foundedYear: 2012,
    fundingProgress: 82,
    timeline: "Действует",
  },
  // IRELAND
  {
    id: 35,
    name: "Stripe",
    category: "fintech",
    amount: "€500M",
    amountValue: 500000000,
    roi: "12% ROI",
    stage: "Operational",
    description: "Глобальная платежная инфраструктура. API для онлайн-платежей, используется миллионами компаний.",
    lat: 53.3498,
    lng: -6.2603,
    city: "Dublin",
    country: "Ireland",
    countryCode: "🇮🇪",
    teamSize: 8000,
    foundedYear: 2010,
    fundingProgress: 100,
    timeline: "Действует",
  },
  // Additional UK projects
  {
    id: 36,
    name: "EV Charging Network",
    category: "energy",
    amount: "£1.5M",
    amountValue: 1500000,
    roi: "15% ROI",
    stage: "Series A",
    description: "Сеть быстрых зарядных станций для электромобилей вдоль основных магистралей Великобритании.",
    lat: 52.6369,
    lng: -1.1398,
    city: "Leicester",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 28,
    foundedYear: 2022,
    fundingProgress: 65,
    timeline: "Q2 2025",
  },
  {
    id: 37,
    name: "AgriTech Liverpool",
    category: "tech",
    amount: "£600K",
    amountValue: 600000,
    roi: "Seed Stage",
    stage: "Seed",
    description: "Вертикальные фермы с AI-управлением для выращивания органических овощей круглый год.",
    lat: 53.4084,
    lng: -2.9916,
    city: "Liverpool",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 15,
    foundedYear: 2023,
    fundingProgress: 40,
    timeline: "Q3 2025",
  },
  {
    id: 38,
    name: "Luxury Hotel Cardiff",
    category: "realestate",
    amount: "£4.5M",
    amountValue: 4500000,
    roi: "18% ROI",
    stage: "Construction",
    description: "5-звездочный отель в историческом центре Кардиффа. Прогнозируемая заполняемость 78%.",
    lat: 51.4816,
    lng: -3.1791,
    city: "Cardiff",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 8,
    foundedYear: 2023,
    fundingProgress: 50,
    timeline: "Q4 2025",
  },
  {
    id: 39,
    name: "Craft Brewery Newcastle",
    category: "food",
    amount: "£350K",
    amountValue: 350000,
    roi: "25% ROI",
    stage: "Profitable",
    description: "Крафтовая пивоварня с собственным баром и дистрибуцией по всему северу Англии.",
    lat: 54.9783,
    lng: -1.6178,
    city: "Newcastle",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 18,
    foundedYear: 2019,
    fundingProgress: 90,
    timeline: "Действует",
  },
  {
    id: 40,
    name: "Digital Health Glasgow",
    category: "health",
    amount: "£750K",
    amountValue: 750000,
    roi: "Series A",
    stage: "Series A",
    description: "Телемедицинская платформа для NHS Scotland с интеграцией AI-диагностики.",
    lat: 55.8642,
    lng: -4.2518,
    city: "Glasgow",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 32,
    foundedYear: 2021,
    fundingProgress: 72,
    timeline: "Q1 2025",
  },
  {
    id: 41,
    name: "Hydrogen Energy Aberdeen",
    category: "energy",
    amount: "£5M",
    amountValue: 5000000,
    roi: "10% ROI",
    stage: "Series B",
    description: "Завод по производству зеленого водорода для промышленного использования.",
    lat: 57.1497,
    lng: -2.0943,
    city: "Aberdeen",
    country: "UK",
    countryCode: "🇬🇧",
    teamSize: 65,
    foundedYear: 2020,
    fundingProgress: 42,
    timeline: "Q1 2026",
  },
  // Additional EU projects for diversity
  {
    id: 42,
    name: "N26",
    category: "fintech",
    amount: "€900M",
    amountValue: 900000000,
    roi: "Series E",
    stage: "Series E",
    description: "Мобильный банк №1 в Европе. 8+ миллионов клиентов в 24 странах.",
    lat: 52.5200,
    lng: 13.4050,
    city: "Berlin",
    country: "Germany",
    countryCode: "🇩🇪",
    teamSize: 1500,
    foundedYear: 2013,
    fundingProgress: 90,
    timeline: "Действует",
  },
  {
    id: 43,
    name: "Klarna",
    category: "fintech",
    amount: "€1.2B",
    amountValue: 1200000000,
    roi: "Series H",
    stage: "Series H",
    description: "Buy Now Pay Later лидер. 150+ миллионов пользователей, 500,000+ продавцов.",
    lat: 59.3326,
    lng: 18.0649,
    city: "Stockholm",
    country: "Sweden",
    countryCode: "🇸🇪",
    teamSize: 5000,
    foundedYear: 2005,
    fundingProgress: 95,
    timeline: "Действует",
  },
  {
    id: 44,
    name: "Bolt",
    category: "mobility",
    amount: "€700M",
    amountValue: 700000000,
    roi: "Series F",
    stage: "Series F",
    description: "Европейский конкурент Uber. Такси, микромобильность, доставка еды в 45+ странах.",
    lat: 59.4370,
    lng: 24.7536,
    city: "Tallinn",
    country: "Estonia",
    countryCode: "🇪🇪",
    teamSize: 4000,
    foundedYear: 2013,
    fundingProgress: 88,
    timeline: "Действует",
  },
];

// Category configuration with new categories
const categoryConfig = {
  energy: {
    color: "#10b981",
    label: "Возобновляемая энергия",
    icon: Sun,
  },
  tech: {
    color: "#3b82f6",
    label: "Технологии/Стартапы",
    icon: Zap,
  },
  realestate: {
    color: "#f59e0b",
    label: "Недвижимость",
    icon: Building2,
  },
  food: {
    color: "#a855f7",
    label: "F&B/Рестораны",
    icon: Utensils,
  },
  health: {
    color: "#ef4444",
    label: "Здравоохранение",
    icon: Heart,
  },
  ai: {
    color: "#06b6d4",
    label: "AI/ML",
    icon: Cpu,
  },
  defense: {
    color: "#64748b",
    label: "Оборона/Defense",
    icon: Shield,
  },
  mobility: {
    color: "#f59e0b",
    label: "Мобильность/EV",
    icon: Car,
  },
  infrastructure: {
    color: "#6366f1",
    label: "Инфраструктура",
    icon: Wifi,
  },
  gaming: {
    color: "#ec4899",
    label: "Гейминг",
    icon: Gamepad2,
  },
  fintech: {
    color: "#22c55e",
    label: "FinTech",
    icon: Banknote,
  },
};

// Custom marker icons with pulsing animation and country flag
const createMarkerIcon = (category: keyof typeof categoryConfig, countryCode: string) => {
  const color = categoryConfig[category].color;
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-wrapper" style="position: relative;">
        <div class="marker-pulse" style="
          position: absolute;
          width: 50px;
          height: 50px;
          top: -7px;
          left: -7px;
          border-radius: 50%;
          background: ${color};
          opacity: 0.3;
          animation: marker-pulse 2s ease-out infinite;
        "></div>
        <div style="
          position: relative;
          width: 36px;
          height: 36px;
          background: ${color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 20px ${color}80;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            font-weight: bold;
            font-size: 14px;
          ">€</div>
        </div>
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          background: rgba(10, 10, 26, 0.9);
          padding: 1px 4px;
          border-radius: 4px;
          white-space: nowrap;
        ">${countryCode}</div>
      </div>
    `,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -46],
  });
};

// Cluster icon
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let size = 40;
  let fontSize = 12;
  
  if (count > 10) {
    size = 50;
    fontSize = 14;
  }
  if (count > 20) {
    size = 60;
    fontSize = 16;
  }

  return L.divIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: ${fontSize}px;
      font-family: 'Orbitron', sans-serif;
      box-shadow: 0 4px 20px rgba(0, 212, 255, 0.5);
      border: 3px solid rgba(255,255,255,0.3);
    ">${count}</div>`,
    className: 'custom-cluster-icon',
    iconSize: L.point(size, size, true),
  });
};

// Stage options
const stageOptions = [
  { value: "all", label: "Все стадии" },
  { value: "Pre-seed", label: "Pre-seed" },
  { value: "Seed", label: "Seed" },
  { value: "Series A", label: "Series A" },
  { value: "Series B", label: "Series B" },
  { value: "Series C", label: "Series C" },
  { value: "Series D", label: "Series D" },
  { value: "Series E", label: "Series E" },
  { value: "Series F", label: "Series F" },
  { value: "Operational", label: "Operational" },
  { value: "Profitable", label: "Profitable" },
  { value: "Construction", label: "Construction" },
];

// Custom Zoom Controls Component
const CustomZoomControls = () => {
  const map = useMap();

  return (
    <div className="absolute bottom-24 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all hover:border-cyan-500/50"
        title="Приблизить"
      >
        <Plus className="w-5 h-5" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all hover:border-cyan-500/50"
        title="Отдалить"
      >
        <Minus className="w-5 h-5" />
      </button>
    </div>
  );
};

// Map Controls Component
const MapControls = ({ 
  mapStyle, 
  setMapStyle 
}: { 
  mapStyle: 'standard' | 'satellite';
  setMapStyle: (style: 'standard' | 'satellite') => void;
}) => {
  return (
    <div className="absolute top-20 right-4 z-[1000] flex flex-col gap-2">
      <div className="glass rounded-xl p-1 flex flex-col gap-1">
        <button
          onClick={() => setMapStyle('standard')}
          className={`p-3 rounded-lg transition-all ${
            mapStyle === 'standard' 
              ? 'bg-cyan-500/20 text-cyan-400' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          title="Стандартная карта"
        >
          <MapIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setMapStyle('satellite')}
          className={`p-3 rounded-lg transition-all ${
            mapStyle === 'satellite' 
              ? 'bg-cyan-500/20 text-cyan-400' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          title="Спутниковая карта"
        >
          <Satellite className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Map Layer Switcher Component
const MapLayerSwitcher = ({ mapStyle }: { mapStyle: 'standard' | 'satellite' }) => {
  const map = useMap();
  
  useEffect(() => {
    // Force map to update when style changes
    map.invalidateSize();
  }, [mapStyle, map]);

  if (mapStyle === 'satellite') {
    return (
      <TileLayer
        attribution='Tiles &copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
    );
  }

  return (
    <TileLayer
      attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    />
  );
};

// Progress Bar Component
const ProgressBar = ({ progress, color }: { progress: number; color: string }) => (
  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
    <div 
      className="h-full rounded-full transition-all duration-500"
      style={{ 
        width: `${progress}%`,
        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
      }}
    />
  </div>
);

// Popup Content Component with Modal functionality
interface PopupContentWithModalProps {
  project: InvestmentProject;
  onOpenDetail: (project: InvestmentProject) => void;
}

const PopupContentWithModal = ({ project, onOpenDetail }: PopupContentWithModalProps) => {
  const config = categoryConfig[project.category];
  const Icon = config.icon;

  return (
    <div className="w-80 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${config.color}20`, border: `1px solid ${config.color}40` }}
        >
          <Icon className="w-6 h-6" style={{ color: config.color }} />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg leading-tight" style={{ fontFamily: 'var(--font-orbitron)' }}>
            {project.name}
          </h3>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            <span className="text-base mr-1">{project.countryCode}</span>
            {project.city}, {project.country}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <span 
          className="px-2 py-1 rounded-md text-xs font-medium"
          style={{ backgroundColor: `${config.color}20`, color: config.color }}
        >
          {config.label}
        </span>
        <span className="px-2 py-1 rounded-md text-xs font-medium bg-cyan-500/20 text-cyan-400">
          {project.stage}
        </span>
      </div>

      <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
        {project.description}
      </p>

      {/* Funding progress */}
      {project.fundingProgress && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">Прогресс финансирования</span>
            <span className="text-white font-semibold">{project.fundingProgress}%</span>
          </div>
          <ProgressBar progress={project.fundingProgress} color={config.color} />
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-white/10">
        {project.teamSize && (
          <div className="text-center">
            <Users className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <p className="text-white text-sm font-semibold">{project.teamSize > 1000 ? `${(project.teamSize / 1000).toFixed(0)}K` : project.teamSize}</p>
            <p className="text-gray-500 text-xs">Команда</p>
          </div>
        )}
        {project.foundedYear && (
          <div className="text-center">
            <Calendar className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <p className="text-white text-sm font-semibold">{project.foundedYear}</p>
            <p className="text-gray-500 text-xs">Год основания</p>
          </div>
        )}
        {project.timeline && (
          <div className="text-center">
            <BarChart3 className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="text-white text-sm font-semibold">{project.timeline}</p>
            <p className="text-gray-500 text-xs">Срок</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-400 text-xs">Сумма инвестиций</p>
          <p className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-orbitron)' }}>
            {project.amount}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs">Доходность</p>
          <p className="text-green-400 font-bold">{project.roi}</p>
        </div>
      </div>

      <button 
        onClick={() => onOpenDetail(project)}
        className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
        style={{ 
          background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
          boxShadow: `0 4px 20px ${config.color}40`
        }}
      >
        Подробнее
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

// Legend Component
const MapLegend = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`absolute bottom-6 left-6 z-[1000] glass rounded-xl transition-all duration-300 ${isExpanded ? 'w-64' : 'w-auto'}`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span className="text-white font-medium text-sm">Легенда</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2 max-h-64 overflow-y-auto">
          {Object.entries(categoryConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ 
                  backgroundColor: config.color,
                  boxShadow: `0 0 8px ${config.color}60`
                }}
              />
              <span className="text-gray-300 text-sm">{config.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Data Sources Panel
const DataSourcesPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const dataSources = [
    { name: "Dealroom.co", status: "connected", lastSync: "5 мин назад" },
    { name: "Crunchbase", status: "connected", lastSync: "12 мин назад" },
    { name: "PitchBook", status: "connected", lastSync: "8 мин назад" },
    { name: "Tech.eu", status: "connected", lastSync: "15 мин назад" },
  ];

  return (
    <div className={`absolute bottom-6 right-20 z-[1000] glass rounded-xl transition-all duration-300 ${isExpanded ? 'w-72' : 'w-auto'}`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="text-white font-medium text-sm">Источники данных</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {dataSources.map((source) => (
            <div key={source.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-white text-sm">{source.name}</span>
              </div>
              <span className="text-gray-500 text-xs">{source.lastSync}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Всего проектов:</span>
              <span className="text-cyan-400 font-semibold">{investmentProjects.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-gray-400">Общий объем:</span>
              <span className="text-green-400 font-semibold">€15B+</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Filter Sidebar Component
interface FiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    categories: string[];
    amountRange: [number, number];
    stage: string;
    searchQuery: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps['filters']>>;
  projectCount: number;
}

const FilterSidebar = ({ isOpen, onClose, filters, setFilters, projectCount }: FiltersProps) => {
  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[1001] lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed lg:relative top-0 left-0 h-full w-80 glass border-r border-white/10 z-[1002] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-orbitron)' }}>
              <Filter className="w-5 h-5 text-cyan-400" />
              Фильтры
            </h2>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Results count */}
          <div className="mb-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-cyan-400 text-sm">Найдено проектов</p>
            <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
              {projectCount}
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">Поиск</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Название проекта..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-3 block">Категории</label>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {Object.entries(categoryConfig).map(([key, config]) => (
                <label 
                  key={key}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={filters.categories.includes(key)}
                    onCheckedChange={() => toggleCategory(key)}
                    className="border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                  />
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-white text-sm">{config.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amount Range */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-3 block">
              Сумма инвестиций: €{filters.amountRange[0] >= 1000000 ? `${(filters.amountRange[0] / 1000000).toFixed(0)}M` : `${(filters.amountRange[0] / 1000).toFixed(0)}K`} - €{(filters.amountRange[1] / 1000000000).toFixed(1)}B
            </label>
            <Slider
              value={filters.amountRange}
              min={0}
              max={3000000000}
              step={10000000}
              onValueChange={(value) => setFilters(prev => ({ ...prev, amountRange: value as [number, number] }))}
              className="my-4"
            />
          </div>

          {/* Stage */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">Стадия</label>
            <div className="relative">
              <select
                value={filters.stage}
                onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:border-cyan-500/50 focus:outline-none transition-colors"
              >
                {stageOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-[#1a1a2e]">
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => setFilters({
              categories: Object.keys(categoryConfig),
              amountRange: [0, 3000000000],
              stage: 'all',
              searchQuery: '',
            })}
            className="w-full py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>
    </>
  );
};

// Project Detail Modal
interface ProjectDetailModalProps {
  project: InvestmentProject | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal = ({ project, isOpen, onClose }: ProjectDetailModalProps) => {
  if (!isOpen || !project) return null;

  const config = categoryConfig[project.category];
  const Icon = config.icon;

  // Fake team members
  const teamMembers = [
    { name: "Alex Johnson", role: "CEO & Founder", initials: "AJ" },
    { name: "Maria Chen", role: "CTO", initials: "MC" },
    { name: "David Brown", role: "CFO", initials: "DB" },
  ];

  // Fake financial data
  const financials = {
    targetRaise: project.amount,
    currentFunding: `€${Math.round(project.amountValue * (project.fundingProgress || 50) / 100 / 1000000).toFixed(1)}M`,
    valuation: `€${Math.round(project.amountValue * 4 / 1000000).toFixed(0)}M`,
    minInvestment: "€50K",
  };

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Hero section */}
        <div 
          className="relative h-48 md:h-64 rounded-t-3xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${config.color}30, ${config.color}10)`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-24 h-24 opacity-20" style={{ color: config.color }} />
          </div>
          
          {/* Video play button placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              className="w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
                boxShadow: `0 0 40px ${config.color}60`,
              }}
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </button>
          </div>
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div 
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: `${config.color}40`, color: config.color }}
            >
              {config.label}
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <span className="text-lg">{project.countryCode}</span>
              {project.city}, {project.country}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div>
              <h2 
                className="text-2xl md:text-3xl font-bold text-white mb-2"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                {project.name}
              </h2>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Основан: {project.foundedYear || 2022}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {project.teamSize ? (project.teamSize > 1000 ? `${(project.teamSize / 1000).toFixed(0)}K` : project.teamSize) : 15} человек
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg glass-light hover:bg-white/10 transition-colors">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 rounded-lg glass-light hover:bg-white/10 transition-colors">
                <Star className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-400" />
              О проекте
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {project.description} Проект находится на стадии {project.stage} и демонстрирует стабильный рост ключевых показателей. 
              Команда имеет богатый опыт в индустрии и уже успешно реализовала несколько аналогичных проектов.
            </p>
          </div>

          {/* Financial Highlights */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Финансовые показатели
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Цель раунда", value: financials.targetRaise, icon: Target },
                { label: "Собрано", value: financials.currentFunding, icon: TrendingUp },
                { label: "Оценка", value: financials.valuation, icon: Award },
                { label: "Мин. вход", value: financials.minInvestment, icon: DollarSign },
              ].map((item) => (
                <div 
                  key={item.label}
                  className="p-4 rounded-xl glass-light"
                >
                  <item.icon className="w-5 h-5 text-cyan-400 mb-2" />
                  <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                  <p className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-orbitron)' }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Funding Progress */}
            {project.fundingProgress && (
              <div className="mt-4 p-4 rounded-xl glass-light">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Прогресс финансирования</span>
                  <span className="text-white font-semibold">{project.fundingProgress}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ 
                      width: `${project.fundingProgress}%`,
                      background: `linear-gradient(90deg, ${config.color}, ${config.color}cc)`,
                    }}
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Дедлайн: {project.timeline || 'Q2 2025'}
                </p>
              </div>
            )}
          </div>

          {/* Team */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Команда
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teamMembers.map((member) => (
                <div 
                  key={member.name}
                  className="p-4 rounded-xl glass-light flex items-center gap-4"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${config.color}, #7c3aed)` }}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-white font-medium">{member.name}</p>
                    <p className="text-gray-400 text-sm">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" />
              Документы
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Pitch Deck", size: "2.4 MB" },
                { name: "Бизнес-план", size: "1.8 MB" },
                { name: "Финансовая модель", size: "856 KB" },
                { name: "Term Sheet", size: "124 KB" },
              ].map((doc) => (
                <button
                  key={doc.name}
                  className="p-4 rounded-xl glass-light flex items-center justify-between hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="text-white font-medium">{doc.name}</p>
                      <p className="text-gray-500 text-xs">{doc.size}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="flex-1 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ 
                background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
                boxShadow: `0 4px 20px ${config.color}40`
              }}
            >
              <DollarSign className="w-5 h-5" />
              Инвестировать
            </button>
            <button className="flex-1 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 glass-light hover:bg-white/10 transition-all border border-white/10">
              <Mail className="w-5 h-5" />
              Связаться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// NOVA AI quick actions
const quickActions = [
  { label: "Показать все AI-стартапы", action: "ai", icon: Cpu, color: "#06b6d4" },
  { label: "Найти проекты с ROI >15%", action: "high-roi", icon: TrendingUp, color: "#10b981" },
  { label: "Проекты до €500M", action: "under-500m", icon: Target, color: "#f59e0b" },
  { label: "Только FinTech", action: "fintech", icon: Banknote, color: "#22c55e" },
  { label: "Проекты в сфере мобильности", action: "mobility", icon: Car, color: "#f59e0b" },
];

// Nova Modal Component
interface NovaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterAction: (action: string) => void;
}

const NovaModal = ({ isOpen, onClose, onFilterAction }: NovaModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-lg glass rounded-3xl overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                  boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
                }}
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  NOVA AI
                </h3>
                <p className="text-gray-400 text-sm">Ваш AI-ассистент</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 mb-6">
            Привет! Я NOVA — ваш интеллектуальный помощник. Выберите быстрое действие или задайте вопрос:
          </p>

          {/* Quick Actions */}
          <div className="space-y-3 mb-6">
            {quickActions.map((action) => (
              <button
                key={action.action}
                onClick={() => {
                  onFilterAction(action.action);
                  onClose();
                }}
                className="w-full p-4 rounded-xl glass-light flex items-center gap-4 hover:bg-white/10 transition-all group hover:scale-[1.01]"
                style={{
                  borderColor: 'transparent',
                }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ 
                    backgroundColor: `${action.color}20`,
                    border: `1px solid ${action.color}40`,
                  }}
                >
                  <action.icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <span className="text-white font-medium text-left">{action.label}</span>
                <ChevronRight className="w-5 h-5 text-gray-500 ml-auto group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Задайте вопрос NOVA..."
              className="w-full pl-5 pr-14 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:outline-none transition-colors"
            />
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              style={{ color: '#7c3aed' }}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
            <Sparkles className="w-3 h-3" />
            <span>Powered by NOVA AI Engine v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Nova AI Button with modal
interface NovaButtonWithModalProps {
  onFilterAction: (action: string) => void;
}

const NovaButtonWithModal = ({ onFilterAction }: NovaButtonWithModalProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-[1000] flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
          boxShadow: isHovered 
            ? '0 0 40px rgba(124, 58, 237, 0.6)' 
            : '0 4px 20px rgba(124, 58, 237, 0.3)',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        <Bot className="w-6 h-6 text-white" />
        <span 
          className={`text-white font-semibold overflow-hidden transition-all duration-300 ${
            isHovered ? 'max-w-32 opacity-100' : 'max-w-0 opacity-0'
          }`}
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          NOVA AI
        </span>
      </button>
      
      <NovaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFilterAction={onFilterAction}
      />
    </>
  );
};

// Calculate total investment volume
const calculateTotalInvestment = () => {
  const total = investmentProjects.reduce((acc, project) => acc + project.amountValue, 0);
  return `€${(total / 1000000000).toFixed(0)}B+`;
};

// Header Component
const MapHeader = ({ onFilterClick }: { onFilterClick: () => void }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-[1000] px-4 py-3">
      <div className="glass rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <Globe className="w-8 h-8 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span 
              className="text-xl font-bold text-white hidden sm:block"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              GIM
            </span>
          </div>
        </Link>

        {/* Total Investment Volume */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-xs text-gray-400">Общий объём</p>
            <p className="text-lg font-bold text-green-400" style={{ fontFamily: 'var(--font-orbitron)' }}>
              {calculateTotalInvestment()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onFilterClick}
            className="lg:hidden p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Filter className="w-5 h-5 text-cyan-400" />
          </button>
          <Link href="/">
            <button className="px-3 md:px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors text-sm md:text-base">
              На главную
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

// Loading skeleton
const MapSkeleton = () => (
  <div className="h-screen w-screen bg-[#0a0a1a] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
      <p className="text-gray-400" style={{ fontFamily: 'var(--font-orbitron)' }}>
        Загрузка карты...
      </p>
    </div>
  </div>
);

// Main Map Page Component
const MapPage = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite'>('standard');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<InvestmentProject | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: Object.keys(categoryConfig),
    amountRange: [0, 3000000000] as [number, number],
    stage: 'all',
    searchQuery: '',
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle NOVA AI filter actions
  const handleNovaFilterAction = (action: string) => {
    switch (action) {
      case 'ai':
        setFilters(prev => ({
          ...prev,
          categories: ['ai'],
          amountRange: [0, 3000000000],
          stage: 'all',
        }));
        break;
      case 'tech':
        setFilters(prev => ({
          ...prev,
          categories: ['tech'],
          amountRange: [0, 3000000000],
          stage: 'all',
        }));
        break;
      case 'high-roi':
        // Filter to show projects with high ROI
        setFilters(prev => ({
          ...prev,
          categories: ['energy', 'food', 'fintech'],
          amountRange: [0, 3000000000],
          stage: 'all',
        }));
        break;
      case 'under-500m':
        setFilters(prev => ({
          ...prev,
          categories: Object.keys(categoryConfig),
          amountRange: [0, 500000000],
          stage: 'all',
        }));
        break;
      case 'fintech':
        setFilters(prev => ({
          ...prev,
          categories: ['fintech'],
          amountRange: [0, 3000000000],
          stage: 'all',
        }));
        break;
      case 'mobility':
        setFilters(prev => ({
          ...prev,
          categories: ['mobility'],
          amountRange: [0, 3000000000],
          stage: 'all',
        }));
        break;
      case 'energy':
        setFilters(prev => ({
          ...prev,
          categories: ['energy'],
          amountRange: [0, 3000000000],
          stage: 'all',
        }));
        break;
      case 'health':
        setFilters(prev => ({
          ...prev,
          categories: ['health'],
          amountRange: [0, 3000000000],
          stage: 'all',
        }));
        break;
      default:
        break;
    }
  };

  // Handle opening project detail
  const handleOpenProjectDetail = (project: InvestmentProject) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
  };

  // Filter projects
  const filteredProjects = useMemo(() => {
    return investmentProjects.filter(project => {
      // Category filter
      if (!filters.categories.includes(project.category)) return false;
      
      // Amount filter
      if (project.amountValue < filters.amountRange[0] || project.amountValue > filters.amountRange[1]) return false;
      
      // Stage filter
      if (filters.stage !== 'all' && project.stage !== filters.stage) return false;
      
      // Search filter
      if (filters.searchQuery && !project.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !project.city.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !project.country.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
      
      return true;
    });
  }, [filters]);

  if (isLoading) {
    return <MapSkeleton />;
  }

  return (
    <div className="h-screen w-screen bg-[#0a0a1a] flex overflow-hidden page-transition">
      {/* Filter Sidebar */}
      <FilterSidebar 
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        projectCount={filteredProjects.length}
      />

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapHeader onFilterClick={() => setFiltersOpen(true)} />
        
        <MapContainer
          center={[50, 10]}
          zoom={4}
          className="h-full w-full"
          zoomControl={false}
        >
          <MapLayerSwitcher mapStyle={mapStyle} />
          
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={60}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
          >
            {filteredProjects.map(project => (
              <Marker
                key={project.id}
                position={[project.lat, project.lng]}
                icon={createMarkerIcon(project.category, project.countryCode)}
              >
                <Popup>
                  <PopupContentWithModal 
                    project={project} 
                    onOpenDetail={handleOpenProjectDetail}
                  />
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
          
          <CustomZoomControls />
        </MapContainer>

        <MapControls mapStyle={mapStyle} setMapStyle={setMapStyle} />
        <MapLegend />
        <DataSourcesPanel />
        <NovaButtonWithModal onFilterAction={handleNovaFilterAction} />
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProject(null);
        }}
      />
    </div>
  );
};

export default MapPage;
