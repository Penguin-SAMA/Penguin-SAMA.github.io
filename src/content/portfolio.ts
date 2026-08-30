export type Locale = 'zh' | 'en'

export interface LocalizedText {
  zh: string
  en: string
}

export type MediaItem =
  | {
      type: 'image'
      src: string
      alt: LocalizedText
      isPlaceholder: boolean
    }
  | {
      type: 'localVideo'
      src: string
      poster?: string
      alt: LocalizedText
      title?: LocalizedText
      isPlaceholder?: false
    }
  | {
      type: 'externalVideo'
      provider: 'bilibili' | 'youtube'
      embedUrl: string
      poster: string
      alt: LocalizedText
      title: LocalizedText
      isPlaceholder?: false
    }

export interface ProjectLink {
  href: string
  label: LocalizedText
}

export interface Project {
  slug: string
  title: LocalizedText
  status?: LocalizedText
  summary: LocalizedText
  highlights: LocalizedText[]
  tags: string[]
  media: MediaItem[]
  links?: ProjectLink[]
}

export interface SkillGroup {
  id: 'engine' | 'programming' | 'graphics' | 'workflow'
  title: LocalizedText
  description: LocalizedText
  items: LocalizedText[]
}

export interface ContactLink {
  kind: 'email' | 'github'
  label: LocalizedText
  value: string
  href: string
  external: boolean
}

export const localize = (text: LocalizedText, locale: Locale): string =>
  text[locale]

export const siteCopy = {
  seo: {
    title: {
      zh: '毛启德｜游戏客户端开发作品集',
      en: 'Qide Mao | Game Client Development Portfolio',
    },
    description: {
      zh: '毛启德的游戏客户端开发作品集，展示 Unreal Engine、Godot、C++、图形学与引擎工程实践。',
      en: 'Qide Mao’s game client development portfolio, featuring Unreal Engine, Godot, C++, graphics, and engine engineering projects.',
    },
  },
  accessibility: {
    skipToContent: {
      zh: '跳到主要内容',
      en: 'Skip to main content',
    },
    openMenu: {
      zh: '打开菜单',
      en: 'Open menu',
    },
    closeMenu: {
      zh: '关闭菜单',
      en: 'Close menu',
    },
    switchLanguage: {
      zh: '切换语言',
      en: 'Switch language',
    },
  },
  languageOptions: [
    {
      locale: 'zh' as const,
      label: { zh: '中文', en: '中文' },
    },
    {
      locale: 'en' as const,
      label: { zh: 'EN', en: 'EN' },
    },
  ],
  navigation: [
    { id: 'home', href: '#home', label: { zh: '首页', en: 'Home' } },
    {
      id: 'projects',
      href: '#projects',
      label: { zh: '作品', en: 'Projects' },
    },
    { id: 'skills', href: '#skills', label: { zh: '技术', en: 'Skills' } },
    { id: 'about', href: '#about', label: { zh: '关于', en: 'About' } },
    {
      id: 'contact',
      href: '#contact',
      label: { zh: '联系', en: 'Contact' },
    },
  ],
  hero: {
    name: { zh: '毛启德', en: 'Qide Mao' },
    title: { zh: '个人作品集', en: 'Portfolio' },
    description: {
      zh: '使用 Unreal Engine 5、C++、蓝图与 Godot 进行项目实践，探索图形学、跨平台工程化与 AI 协同开发。',
      en: 'Building projects with Unreal Engine 5, C++, Blueprints, and Godot while exploring graphics, cross-platform engineering, and AI-assisted development.',
    },
    education: {
      zh: '北京城市学院 · 软件工程硕士研究生',
      en: 'Beijing City University · Master’s Program in Software Engineering',
    },
    primaryAction: { zh: '浏览作品', en: 'View Projects' },
    secondaryAction: { zh: '访问 GitHub', en: 'View GitHub' },
  },
  sections: {
    projects: {
      title: { zh: '精选作品', en: 'Featured Projects' },
      description: {
        zh: '四项围绕游戏客户端、内容制作与引擎工程的项目实践。',
        en: 'Four projects spanning game client development, content creation, and engine engineering.',
      },
    },
    skills: {
      title: { zh: '技术栈', en: 'Technical Skills' },
    },
    about: {
      title: { zh: '关于我', en: 'About Me' },
    },
    contact: {
      title: { zh: '保持联系', en: 'Let’s Connect' },
    },
  },
  mediaPlaceholder: {
    zh: '项目素材待补充',
    en: 'Project media coming soon',
  },
  footer: {
    copyright: {
      zh: '© {year} 毛启德。保留所有权利。',
      en: '© {year} Qide Mao. All rights reserved.',
    },
    backToTop: { zh: '返回顶部', en: 'Back to top' },
    builtAs: {
      zh: '使用 React、TypeScript 与 Motion 构建',
      en: 'Built with React, TypeScript, and Motion',
    },
  },
} as const

export const projects: Project[] = [
  {
    slug: 'ue5-fps-demo',
    title: {
      zh: '基于 UE5.8 的第一人称射击游戏 DEMO',
      en: 'UE5.8 First-Person Shooter Demo',
    },
    status: {
      zh: '项目前中期',
      en: 'Early-to-mid development',
    },
    summary: {
      zh: '使用 UE5.8 开发的第一人称射击游戏 DEMO，尝试复刻《彩虹六号：围攻》《三角洲行动》《PUBG》等游戏的操作体验。',
      en: 'An early-to-mid-development first-person shooter demo built with UE5.8, focused on recreating the interaction feel of Rainbow Six Siege, Delta Force, and PUBG.',
    },
    highlights: [
      {
        zh: '运用 UE 蓝图设计站立、行走、奔跑、蹲伏、趴下与翻越等角色动画。',
        en: 'Built character animation behavior for standing, walking, running, crouching, going prone, and vaulting with Unreal Blueprints.',
      },
      {
        zh: '完成枪械模块化组件与多种投掷物设计。',
        en: 'Designed modular weapon components and multiple throwable types.',
      },
      {
        zh: '使用 Codex 配合 Unreal MCP，探索 AI 协同游戏开发。',
        en: 'Used Codex with Unreal MCP to explore AI-assisted game development.',
      },
    ],
    tags: ['UE5', 'Blueprint', 'Codex', 'Unreal MCP'],
    media: [
      {
        type: 'image',
        src: '/media/placeholders/project-fps-systems.webp',
        alt: {
          zh: '第一人称射击 DEMO 的抽象技术封面占位图',
          en: 'Abstract technical placeholder cover for the first-person shooter demo',
        },
        isPlaceholder: true,
      },
    ],
  },
  {
    slug: 'ue5-survival-building',
    title: {
      zh: '基于 UE5.6 的俯视角多人联机生存建造游戏',
      en: 'UE5.6 Top-Down Multiplayer Survival-Building Game',
    },
    status: {
      zh: '项目前中期',
      en: 'Early-to-mid development',
    },
    summary: {
      zh: '使用 UE5.6 开发的后末日题材俯视角生存游戏，核心玩法机制参考《僵尸毁灭工程》《深岩银河》等作品。',
      en: 'A post-apocalyptic top-down survival game built with UE5.6, with core mechanics inspired by Project Zomboid and Deep Rock Galactic.',
    },
    highlights: [
      {
        zh: '结合 UE C++ 与蓝图系统，完成基础地形构建及游戏前期关键功能开发。',
        en: 'Combined UE C++ and Blueprints to build the base terrain and key early-stage gameplay functionality.',
      },
      {
        zh: '集成 PCG 与 GAS，实现游戏内容的程序化生成与高效制作。',
        en: 'Integrated PCG and GAS to support procedural content generation and efficient production.',
      },
    ],
    tags: ['UE5.6', 'C++', 'Blueprint', 'PCG', 'GAS'],
    media: [
      {
        type: 'image',
        src: '/media/placeholders/project-survival-pcg.webp',
        alt: {
          zh: '俯视角生存建造项目的抽象系统封面占位图',
          en: 'Abstract systems placeholder cover for the top-down survival-building project',
        },
        isPlaceholder: true,
      },
    ],
  },
  {
    slug: 'wuhan-cultural-adventure',
    title: {
      zh: '基于 Godot 的武汉历史文化文字冒险游戏',
      en: 'Godot Wuhan History and Culture Text Adventure',
    },
    status: {
      zh: '腾讯游戏创作大赛项目',
      en: 'Tencent Game Creation Competition Project',
    },
    summary: {
      zh: '每个小关围绕一位 NPC 的“文化长河”，并通过独特的小游戏呈现对该 NPC 的理解。',
      en: 'Each stage follows one NPC’s cultural journey and uses a distinct minigame to express an understanding of that NPC.',
    },
    highlights: [
      {
        zh: '通过自建 RAG 建立 NPC 知识库，使 NPC 能根据玩家的自定义文本与行为做出不同反应。',
        en: 'Built a custom RAG knowledge base so NPCs can respond differently to player-written text and behavior.',
      },
      {
        zh: '使用 Godot 状态机与动画树设定玩家动画机制。',
        en: 'Used Godot state machines and animation trees to build player animation behavior.',
      },
      {
        zh: '配合 AI 生成工作流，制作游戏中的部分美术与音乐资源。',
        en: 'Used an AI-assisted workflow to produce some of the game’s art and music assets.',
      },
    ],
    tags: ['Godot', 'GDScript', 'RAG', 'AI Workflow'],
    media: [
      {
        type: 'image',
        src: '/media/placeholders/project-wuhan-rag.webp',
        alt: {
          zh: '武汉历史文化文字冒险项目的抽象叙事封面占位图',
          en: 'Abstract narrative placeholder cover for the Wuhan history and culture adventure',
        },
        isPlaceholder: true,
      },
    ],
  },
  {
    slug: 'hazel-modernization',
    title: {
      zh: 'Hazel C++ 游戏引擎的现代化改造',
      en: 'Modernizing the Hazel C++ Game Engine',
    },
    summary: {
      zh: '基于 Hazel 进行跨平台与现代 C++ 工程化改造，将教学向 Windows 引擎扩展为跨平台、多图形后端的桌面图形应用框架。',
      en: 'A cross-platform, modern C++ engineering overhaul of Hazel, extending the Windows-focused teaching engine into a desktop graphics framework with multiple platforms and rendering backends.',
    },
    highlights: [
      {
        zh: '添加 Linux 与 macOS 支持，以 xmake 替换 premake，统一多平台工程生成、依赖组织与示例项目构建流程。',
        en: 'Added Linux and macOS support and replaced premake with xmake to unify project generation, dependency organization, and example builds across platforms.',
      },
      {
        zh: '使用 C++20 优化引擎代码，并扩展 Vulkan 与 Metal 支持。',
        en: 'Modernized engine code with C++20 and extended support for Vulkan and Metal.',
      },
      {
        zh: '围绕 shader library、资源加载与渲染抽象进行模块归因、边界拆分与问题闭环。',
        en: 'Investigated modules, separated boundaries, and resolved issues around the shader library, resource loading, and rendering abstractions.',
      },
    ],
    tags: ['C++20', 'OpenGL', 'Vulkan', 'Metal', 'Lua', 'xmake'],
    media: [
      {
        type: 'image',
        src: '/media/placeholders/project-hazel-renderer.webp',
        alt: {
          zh: 'Hazel 引擎现代化改造项目的抽象引擎封面占位图',
          en: 'Abstract engine placeholder cover for the Hazel modernization project',
        },
        isPlaceholder: true,
      },
    ],
  },
]

export const skillGroups: SkillGroup[] = [
  {
    id: 'engine',
    title: { zh: '引擎与工具', en: 'Engine' },
    description: {
      zh: '熟悉 Unreal Engine 5、UE C++ 与蓝图可视化编程；熟悉 Godot 基本开发流程。',
      en: 'Experienced with Unreal Engine 5, UE C++, and visual scripting with Blueprints; familiar with the core Godot development workflow.',
    },
    items: [
      { zh: 'Unreal Engine 5', en: 'Unreal Engine 5' },
      { zh: 'UE C++', en: 'UE C++' },
      { zh: '蓝图', en: 'Blueprints' },
      { zh: 'Godot', en: 'Godot' },
    ],
  },
  {
    id: 'programming',
    title: { zh: '编程', en: 'Programming' },
    description: {
      zh: '熟练 C++、RAII、C++20/23 与面向对象编程，理解内存管理及底层机制；了解 Rust 与 Python。',
      en: 'Proficient in C++, RAII, C++20/23, and object-oriented programming; understands memory management and low-level mechanisms; familiar with Rust and Python fundamentals.',
    },
    items: [
      { zh: 'C++20/23', en: 'C++20/23' },
      { zh: 'RAII 与面向对象编程', en: 'RAII & OOP' },
      { zh: '内存管理', en: 'Memory Management' },
      { zh: 'Rust 与 Python 基础', en: 'Rust & Python Fundamentals' },
    ],
  },
  {
    id: 'graphics',
    title: { zh: '图形学', en: 'Graphics' },
    description: {
      zh: '独立开发过软光栅化渲染器，掌握模型加载、坐标变换、相机控制、光照计算和基础渲染管线。',
      en: 'Independently developed a software rasterizer and worked with model loading, coordinate transforms, camera control, lighting calculations, and the basic rendering pipeline.',
    },
    items: [
      { zh: '软光栅化渲染器', en: 'Software Rasterizer' },
      { zh: '模型加载与坐标变换', en: 'Model Loading & Transforms' },
      { zh: '相机与光照计算', en: 'Camera & Lighting' },
      { zh: '基础渲染管线', en: 'Rendering Pipeline' },
    ],
  },
  {
    id: 'workflow',
    title: { zh: '工程工作流', en: 'Workflow' },
    description: {
      zh: '熟悉 Linux、Git、SSH、Vim 与 CLI 工具，长期使用 Arch Linux 作为主要开发环境；使用 CodeBuddy、Claude Code、OpenCode、Codex 等 AI Agent 辅助开发与代码 Review。',
      en: 'Familiar with Linux, Git, SSH, Vim, and CLI tools, with long-term use of Arch Linux as the primary development environment; uses CodeBuddy, Claude Code, OpenCode, and Codex for AI-assisted development and code review.',
    },
    items: [
      { zh: 'Arch Linux 与 CLI', en: 'Arch Linux & CLI' },
      { zh: 'Git、SSH 与 Vim', en: 'Git, SSH & Vim' },
      { zh: 'AI Agent 辅助开发', en: 'AI-assisted Development' },
      { zh: '代码 Review', en: 'Code Review' },
    ],
  },
]

export const about = {
  body: {
    zh: '我专注于游戏客户端开发，项目覆盖 Unreal Engine 5、Godot、C++ 图形与引擎工程化实践，并持续探索 AI Agent 协同开发。',
    en: 'I focus on game client development, with project experience spanning Unreal Engine 5, Godot, C++ graphics, and engine engineering, alongside ongoing exploration of AI-assisted development.',
  },
  labels: {
    profile: { zh: '开发方向', en: 'Development Focus' },
    education: { zh: '教育经历', en: 'Education' },
    workflow: { zh: '工作方式', en: 'Workflow' },
    period: { zh: '就读时间', en: 'Period' },
    award: { zh: '奖学金', en: 'Scholarship' },
  },
} as const

export const education = {
  school: {
    zh: '北京城市学院',
    en: 'Beijing City University',
  },
  degree: {
    zh: '软件工程 · 硕士研究生',
    en: 'Master’s Program in Software Engineering',
  },
  period: '2025.09—2028.07',
  award: {
    zh: '研究生学业奖学金一等奖',
    en: 'First Prize, Graduate Academic Scholarship',
  },
} as const

export const contact = {
  body: {
    zh: '如果你对我的项目或游戏客户端开发实践感兴趣，欢迎通过邮件或 GitHub 与我联系。',
    en: 'If you are interested in my projects or game client development work, feel free to reach out by email or GitHub.',
  },
  status: {
    zh: '期待交流游戏客户端与引擎工程',
    en: 'Open to conversations about game client and engine engineering',
  },
} as const

export const contactLinks: ContactLink[] = [
  {
    kind: 'email',
    label: { zh: '发送邮件', en: 'Email Me' },
    value: 'penguinsama8@gmail.com',
    href: 'mailto:penguinsama8@gmail.com',
    external: false,
  },
  {
    kind: 'github',
    label: { zh: '访问 GitHub', en: 'View GitHub' },
    value: 'github.com/Penguin-SAMA',
    href: 'https://github.com/Penguin-SAMA',
    external: true,
  },
]

export const portfolioContent = {
  site: siteCopy,
  projects,
  skillGroups,
  about,
  education,
  contact,
  contactLinks,
} as const
