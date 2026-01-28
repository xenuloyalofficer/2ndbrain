import { mutation } from "./_generated/server";

export const seedAll = mutation({
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("projects").first();
    if (existing) {
      console.log("Already seeded, skipping...");
      return;
    }

    // PROJECT 1: Jocril E-commerce
    const jocrilId = await ctx.db.insert("projects", {
      name: "Jocril E-commerce",
      slug: "jocril-ecommerce",
      description: "E-commerce store for Jocril. ~80% complete, closest to launch.",
      status: "active",
      priority: "high",
      order: 0,
      localPath: "C:\\Users\\maria\\Desktop\\pessoal\\jocril\\SITES\\loja-jocril",
      githubPath: "projects/jocril-ecommerce",
    });

    const jocrilTasks = [
      { title: "Import products and pricing data", aiPrompt: "In jocril-ecommerce, analyze product data and import to Convex. Check for CSV/JSON files first." },
      { title: "Finalize product catalog structure" },
      { title: "Test template-variant system" },
      { title: "Review storefront UI" },
      { title: "Complete checkout flow", aiPrompt: "Implement full checkout: cart → shipping → payment → confirmation." },
      { title: "Test payment integration" },
      { title: "Set up email notifications (Resend)", aiPrompt: "Integrate Resend for order confirmation, shipping updates, welcome email." },
      { title: "Admin panel polish" },
      { title: "Deploy to production" },
      { title: "LAUNCH" },
    ];

    for (let i = 0; i < jocrilTasks.length; i++) {
      await ctx.db.insert("tasks", {
        projectId: jocrilId,
        title: jocrilTasks[i].title,
        status: "todo",
        order: i,
        aiPrompt: jocrilTasks[i].aiPrompt,
      });
    }

    // PROJECT 2: Take It Down
    const takeItDownId = await ctx.db.insert("projects", {
      name: "Take It Down",
      slug: "take-it-down",
      description: "Privacy complaint tool for YouTube harassment. 8-week roadmap to beta.",
      status: "active",
      priority: "high",
      order: 1,
      localPath: "C:\\Users\\maria\\Desktop\\pessoal\\take-it-down\\privacy-complaint-tool",
      githubPath: "projects/take-it-down",
    });

    const tidTasks = [
      {
        title: "Verify YouTube Format Compliance",
        subtasks: [
          "Screenshot YouTube privacy complaint form",
          "Screenshot YouTube defamation complaint form",
          "Document character limits for each field",
          "Test current output - copy-paste to YouTube",
          "Update templates to match YouTube exactly",
        ],
      },
      {
        title: "Add Legal Disclaimers",
        subtasks: [
          "Draft disclaimer text",
          "Create DisclaimerBanner component",
          "Add to landing page, wizard, reports",
          "Update Terms of Service",
        ],
      },
      {
        title: "Write About Page",
        subtasks: [
          "Write Maria's story (decide: anonymous?)",
          "Explain why tool exists",
          "Explain pricing (API costs)",
          "Add resources section",
        ],
      },
      {
        title: "Calculate API Costs",
        subtasks: [
          "Run 3-5 test complaints",
          "Check OpenRouter usage",
          "Calculate cost per complaint",
          "Determine break-even point",
        ],
      },
      {
        title: "Define Pricing Model",
        subtasks: [
          "Research competitors",
          "Propose 3 tiers",
          "Get community feedback",
        ],
      },
      {
        title: "Stripe Integration",
        subtasks: [
          "Create Stripe account + products",
          "Build checkout flow",
          "Webhook handling",
          "Update user credits in Convex",
        ],
      },
      { title: "Add Image Timestamp Manual Entry" },
      { title: "Landing Page Design" },
      { title: "Content Marketing (3 blog posts)" },
      { title: "Beta Launch" },
    ];

    for (let i = 0; i < tidTasks.length; i++) {
      const taskId = await ctx.db.insert("tasks", {
        projectId: takeItDownId,
        title: tidTasks[i].title,
        status: "todo",
        order: i,
      });

      if (tidTasks[i].subtasks) {
        for (let j = 0; j < tidTasks[i].subtasks!.length; j++) {
          await ctx.db.insert("subtasks", {
            taskId,
            title: tidTasks[i].subtasks![j],
            done: false,
            order: j,
          });
        }
      }
    }

    // PROJECT 3: Flow Stach
    const flowStachId = await ctx.db.insert("projects", {
      name: "Flow Bridge",
      slug: "flow-stach",
      description: "HTML/CodePen → Webflow marketplace. 12-week roadmap.",
      status: "active",
      priority: "high",
      order: 2,
      localPath: "C:\\Users\\maria\\Desktop\\pessoal\\FLOW_PARTY\\flow-stach",
      githubPath: "projects/flow-stach",
    });

    const flowTasks: Array<{ title: string; subtasks?: string[]; status?: "todo" | "in_progress" | "done" | "blocked"; blockedReason?: string }> = [
      {
        title: "Fix Core Conversion (90%+ success)",
        subtasks: [
          "List all files in temp/tests/",
          "Test each file in Webflow",
          "Compare working vs broken HTML",
          "Build webflow-preflight-validator.ts",
          "Add integration tests",
        ],
      },
      { title: "Rename Project (FlowStach → Flow Bridge?)" },
      {
        title: "Competitor Research",
        subtasks: [
          "Analyze Timothee Ricks pricing",
          "Analyze Willum pricing",
          "Analyze Osmo pricing",
        ],
      },
      {
        title: "Define Pricing Model",
        subtasks: [
          "Propose 3 tiers (Free, Pro, Team)",
          "Per-item vs subscription",
          "Choose payment provider",
        ],
      },
      { title: "CodePen Integration Stabilization" },
      {
        title: "Build Marketplace UI",
        subtasks: [
          "Browse page (/explore)",
          "Asset detail pages",
          "My Projects dashboard",
        ],
      },
      { title: "Payment Integration" },
      { title: "Redesign Application", status: "blocked", blockedReason: "Waiting on designers" },
      { title: "Connect Flow-Goodies Extension to Convex" },
      { title: "Content Curation (30-50 assets)" },
      { title: "Launch Prep (legal, SEO, analytics)" },
    ];

    for (let i = 0; i < flowTasks.length; i++) {
      const taskId = await ctx.db.insert("tasks", {
        projectId: flowStachId,
        title: flowTasks[i].title,
        status: flowTasks[i].status || "todo",
        blockedReason: flowTasks[i].blockedReason,
        order: i,
      });

      if (flowTasks[i].subtasks) {
        for (let j = 0; j < flowTasks[i].subtasks!.length; j++) {
          await ctx.db.insert("subtasks", {
            taskId,
            title: flowTasks[i].subtasks![j],
            done: false,
            order: j,
          });
        }
      }
    }

    // PROJECT 4: DARVO Transcripts
    const darvoId = await ctx.db.insert("projects", {
      name: "DARVO Transcripts",
      slug: "darvo-transcripts",
      description: "Video analysis tool for harassment patterns. 6-8 week roadmap.",
      status: "active",
      priority: "medium",
      order: 3,
      localPath: "C:\\Users\\maria\\Desktop\\pessoal\\DARVO-Transcripts",
      githubPath: "projects/darvo-transcripts",
    });

    const darvoTasks: Array<{ title: string; subtasks?: string[]; aiPrompt?: string }> = [
      { title: "Remove File Indexing UI", aiPrompt: "Comment out Search & Filter tab in main.py (lines 80-91). Keep database. Test app runs." },
      {
        title: "Add URL Input Tab",
        subtasks: [
          "New Gradio tab: Analyze Videos",
          "Input: YouTube URLs (one per line)",
          "Input: Names to track",
          "Button: Start Analysis",
        ],
      },
      { title: "Check Existing Transcripts Before Transcribing" },
      {
        title: "Build Interactive Flagging UI",
        subtasks: [
          "Gradio Dataframe with checkboxes",
          "Columns: Timestamp, Quote, Person, Technique",
          "Filter by Person/Technique",
          "Batch actions (Select All)",
        ],
      },
      {
        title: "Improve Clip Extraction",
        subtasks: [
          "User-selected buffer (15s, 30s, 60s)",
          "Smart boundaries",
          "Batch clip generation",
        ],
      },
      {
        title: "Build Research Website Generator",
        subtasks: [
          "Choose framework (Next.js)",
          "Homepage with stats",
          "Evidence pages per technique",
          "Data visualizations",
        ],
      },
    ];

    for (let i = 0; i < darvoTasks.length; i++) {
      const taskId = await ctx.db.insert("tasks", {
        projectId: darvoId,
        title: darvoTasks[i].title,
        status: "todo",
        order: i,
        aiPrompt: darvoTasks[i].aiPrompt,
      });

      if (darvoTasks[i].subtasks) {
        for (let j = 0; j < darvoTasks[i].subtasks!.length; j++) {
          await ctx.db.insert("subtasks", {
            taskId,
            title: darvoTasks[i].subtasks![j],
            done: false,
            order: j,
          });
        }
      }
    }

    // PROJECT 5: Scientology Archive
    const scnId = await ctx.db.insert("projects", {
      name: "Scientology Archive",
      slug: "scientology-archive",
      description: "Document processing for scnfiles.com. BLOCKED: Awaiting folder access.",
      status: "blocked",
      priority: "low",
      order: 4,
      githubPath: "projects/scientology-archive",
    });

    const scnTasks: Array<{ title: string; status?: "todo" | "in_progress" | "done" | "blocked" }> = [
      { title: "Provide folder access to Claude", status: "blocked" },
      { title: "Audit scnfiles.com codebase" },
      { title: "Test OCR engines (Adobe, Tesseract, Google)" },
      { title: "Build format preservation layer" },
      { title: "Design microsite template" },
      { title: "Create collaboration workflow" },
    ];

    for (let i = 0; i < scnTasks.length; i++) {
      await ctx.db.insert("tasks", {
        projectId: scnId,
        title: scnTasks[i].title,
        status: scnTasks[i].status || "todo",
        order: i,
      });
    }

    // PROJECT 6: Imacx Management
    const imacxId = await ctx.db.insert("projects", {
      name: "Imacx Management",
      slug: "imacx-management",
      description: "Day job task tracking. Maria will populate tasks.",
      status: "active",
      priority: "high",
      order: 5,
      localPath: "C:\\Users\\maria\\Desktop\\Imacx\\IMACX_PROD\\NOVO\\imacx\\NEW-APP\\imacx-clean",
      githubPath: "projects/imacx-management",
    });

    console.log("Seeded 6 projects with tasks!");
  },
});
