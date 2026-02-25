import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const seedData = [
  // SEO
  { name: "Surfer SEO", description: "AI-powered SEO tool that analyzes top-ranking pages and provides real-time content optimization guidance.", category: "SEO", sourceUrl: "https://surferseo.com", usageScore: 92, reviewSentiment: "positive" },
  { name: "Semrush AI", description: "Comprehensive AI-enhanced SEO platform covering keyword research, competitive analysis, and site audits.", category: "SEO", sourceUrl: "https://semrush.com", usageScore: 95, reviewSentiment: "positive" },
  { name: "Ahrefs AI", description: "Leading SEO toolset with AI-powered insights for backlink analysis, keyword research, and rank tracking.", category: "SEO", sourceUrl: "https://ahrefs.com", usageScore: 94, reviewSentiment: "positive" },
  { name: "Clearscope", description: "AI content optimization platform that helps writers create content that ranks by analyzing top search results.", category: "SEO", sourceUrl: "https://clearscope.io", usageScore: 78, reviewSentiment: "positive" },
  { name: "MarketMuse", description: "AI-driven content strategy platform that automates content research, planning, and optimization at scale.", category: "SEO", sourceUrl: "https://marketmuse.com", usageScore: 72, reviewSentiment: "positive" },
  { name: "Frase", description: "AI tool for researching, writing, and optimizing SEO content using SERP data and NLP analysis.", category: "SEO", sourceUrl: "https://frase.io", usageScore: 69, reviewSentiment: "neutral" },
  // Content
  { name: "Jasper", description: "Enterprise AI writing platform for creating marketing copy, blog posts, and brand-consistent content at scale.", category: "Content", sourceUrl: "https://jasper.ai", usageScore: 88, reviewSentiment: "positive" },
  { name: "Copy.ai", description: "AI copywriting tool that generates high-converting marketing copy, email sequences, and sales content.", category: "Content", sourceUrl: "https://copy.ai", usageScore: 82, reviewSentiment: "positive" },
  { name: "Writesonic", description: "AI-powered writing assistant for creating SEO-optimized articles, ads, product descriptions, and more.", category: "Content", sourceUrl: "https://writesonic.com", usageScore: 75, reviewSentiment: "positive" },
  { name: "Rytr", description: "Affordable AI writing assistant that creates content in 40+ use cases across 30+ languages.", category: "Content", sourceUrl: "https://rytr.me", usageScore: 65, reviewSentiment: "neutral" },
  { name: "Notion AI", description: "AI writing assistant integrated into Notion for brainstorming, summarizing, and drafting content.", category: "Content", sourceUrl: "https://notion.so/product/ai", usageScore: 80, reviewSentiment: "positive" },
  { name: "Writer.com", description: "Enterprise AI writing platform with custom style guides, brand voice consistency, and compliance controls.", category: "Content", sourceUrl: "https://writer.com", usageScore: 77, reviewSentiment: "positive" },
  // Social
  { name: "Hootsuite AI", description: "AI-enhanced social media management platform for scheduling, analytics, and content recommendations.", category: "Social", sourceUrl: "https://hootsuite.com", usageScore: 85, reviewSentiment: "positive" },
  { name: "Buffer AI", description: "Social media scheduling tool with AI-powered content suggestions and optimal posting time recommendations.", category: "Social", sourceUrl: "https://buffer.com", usageScore: 79, reviewSentiment: "positive" },
  { name: "Predis.ai", description: "AI social media content generator that creates posts, carousels, and videos from simple text prompts.", category: "Social", sourceUrl: "https://predis.ai", usageScore: 68, reviewSentiment: "positive" },
  { name: "Ocoya", description: "All-in-one AI marketing platform for creating, scheduling, and analyzing social media content.", category: "Social", sourceUrl: "https://ocoya.com", usageScore: 62, reviewSentiment: "neutral" },
  { name: "Taplio", description: "AI-powered LinkedIn growth tool for creating viral posts, building audience, and tracking engagement.", category: "Social", sourceUrl: "https://taplio.com", usageScore: 71, reviewSentiment: "positive" },
  { name: "Lately", description: "AI social media automation platform that repurposes long-form content into dozens of social posts.", category: "Social", sourceUrl: "https://lately.ai", usageScore: 58, reviewSentiment: "neutral" },
  // Analytics
  { name: "Albert.ai", description: "Autonomous AI digital marketing platform that manages and optimizes campaigns across search, social, and display.", category: "Analytics", sourceUrl: "https://albert.ai", usageScore: 74, reviewSentiment: "positive" },
  { name: "Adverity", description: "AI-powered marketing analytics platform that unifies data from all marketing channels into actionable insights.", category: "Analytics", sourceUrl: "https://adverity.com", usageScore: 76, reviewSentiment: "positive" },
  { name: "Pecan AI", description: "Predictive analytics platform that helps marketers forecast customer behavior and optimize marketing spend.", category: "Analytics", sourceUrl: "https://pecan.ai", usageScore: 67, reviewSentiment: "positive" },
  { name: "Triple Whale", description: "AI-powered ecommerce analytics platform for attributing revenue and optimizing marketing across channels.", category: "Analytics", sourceUrl: "https://triplewhale.com", usageScore: 81, reviewSentiment: "positive" },
  { name: "Northbeam", description: "Multi-touch attribution platform using ML to track the true impact of every marketing channel.", category: "Analytics", sourceUrl: "https://northbeam.io", usageScore: 70, reviewSentiment: "neutral" },
  // Email
  { name: "Seventh Sense", description: "AI email delivery optimization tool that sends emails at the exact time each subscriber is most likely to engage.", category: "Email", sourceUrl: "https://theseventhsense.com", usageScore: 72, reviewSentiment: "positive" },
  { name: "Phrasee", description: "AI-powered brand language optimization platform that generates and tests subject lines, push notifications, and ads.", category: "Email", sourceUrl: "https://phrasee.co", usageScore: 68, reviewSentiment: "positive" },
  { name: "Klaviyo AI", description: "Email and SMS marketing platform with AI features for predictive analytics, segmentation, and content generation.", category: "Email", sourceUrl: "https://klaviyo.com", usageScore: 89, reviewSentiment: "positive" },
  { name: "ActiveCampaign AI", description: "AI-enhanced email marketing automation platform with predictive sending, content generation, and lead scoring.", category: "Email", sourceUrl: "https://activecampaign.com", usageScore: 83, reviewSentiment: "positive" },
  // Ads
  { name: "Adcreative.ai", description: "AI platform that generates high-performing ad creatives for social media and display advertising campaigns.", category: "Ads", sourceUrl: "https://adcreative.ai", usageScore: 78, reviewSentiment: "positive" },
  { name: "Smartly.io", description: "AI-powered social advertising platform for automating and optimizing campaigns across Meta, Google, and TikTok.", category: "Ads", sourceUrl: "https://smartly.io", usageScore: 82, reviewSentiment: "positive" },
  { name: "Persado", description: "AI platform that generates emotionally resonant marketing language to maximize conversions across channels.", category: "Ads", sourceUrl: "https://persado.com", usageScore: 74, reviewSentiment: "positive" },
  { name: "Madgicx", description: "All-in-one AI advertising platform for Meta ads with autonomous optimization and creative intelligence.", category: "Ads", sourceUrl: "https://madgicx.com", usageScore: 69, reviewSentiment: "neutral" },
  // Video
  { name: "Synthesia", description: "AI video generation platform for creating professional videos with AI avatars from text scripts.", category: "Video", sourceUrl: "https://synthesia.io", usageScore: 87, reviewSentiment: "positive" },
  { name: "HeyGen", description: "AI video platform for creating personalized videos with talking avatars for marketing and sales.", category: "Video", sourceUrl: "https://heygen.com", usageScore: 84, reviewSentiment: "positive" },
  { name: "Runway ML", description: "AI-powered creative platform for video generation, editing, and visual effects using generative AI.", category: "Video", sourceUrl: "https://runwayml.com", usageScore: 86, reviewSentiment: "positive" },
  { name: "Pictory", description: "AI video creation tool that automatically transforms long-form content into short, shareable video clips.", category: "Video", sourceUrl: "https://pictory.ai", usageScore: 71, reviewSentiment: "positive" },
  { name: "Invideo AI", description: "AI-powered video maker that creates professional marketing videos from text prompts in minutes.", category: "Video", sourceUrl: "https://invideo.io", usageScore: 73, reviewSentiment: "neutral" },
  // Design
  { name: "Canva AI", description: "AI design platform with Magic Design, text-to-image generation, and AI-powered editing for marketing materials.", category: "Design", sourceUrl: "https://canva.com", usageScore: 93, reviewSentiment: "positive" },
  { name: "Adobe Firefly", description: "Adobe's generative AI toolset for creating images, text effects, and design assets for marketing campaigns.", category: "Design", sourceUrl: "https://firefly.adobe.com", usageScore: 88, reviewSentiment: "positive" },
  { name: "Looka", description: "AI-powered logo and brand identity designer that creates professional branding packages instantly.", category: "Design", sourceUrl: "https://looka.com", usageScore: 66, reviewSentiment: "neutral" },
  { name: "Designs.ai", description: "AI creative platform for making logos, videos, mockups, and marketing copy from a single dashboard.", category: "Design", sourceUrl: "https://designs.ai", usageScore: 62, reviewSentiment: "neutral" },
];

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  let added = 0;
  let updated = 0;

  for (const tool of seedData) {
    const existing = await prisma.marketingTool.findUnique({ where: { name: tool.name } });
    if (existing) {
      await prisma.marketingTool.update({ where: { name: tool.name }, data: tool });
      updated++;
    } else {
      await prisma.marketingTool.create({ data: tool });
      added++;
    }
  }

  return NextResponse.json({ success: true, added, updated, total: added + updated });
}
