import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../lib/generated/prisma/client";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding VMK Tennis Academy database...");

  await prisma.attendanceRecord.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.progressNote.deleteMany();
  await prisma.studentDocument.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.guardian.deleteMany();
  await prisma.student.deleteMany();
  await prisma.trialAppointment.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.leadNote.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.feePlan.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.program.deleteMany();
  await prisma.coach.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword =
    process.env.ADMIN_PASSWORD ?? "ChangeMeImmediately1!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@vmkta.com",
      passwordHash,
      name: "VMK Admin",
      role: "ADMIN",
      phone: "+919876543210",
    },
  });

  const coachUser = await prisma.user.create({
    data: {
      email: "coach@vmkta.com",
      passwordHash: await bcrypt.hash("CoachPass1!", 12),
      name: "Rahul Sharma",
      role: "COACH",
      phone: "+919876543211",
    },
  });

  await prisma.user.create({
    data: {
      email: "frontdesk@vmkta.com",
      passwordHash: await bcrypt.hash("FrontDesk1!", 12),
      name: "Priya Nair",
      role: "FRONT_DESK",
      phone: "+919876543212",
    },
  });

  const programs = await Promise.all(
    [
      {
        name: "Beginner",
        slug: "beginner",
        ageGroup: "5–10 years",
        focusAreas: "Fundamentals, coordination, fun drills",
        sessionsPerWeek: 2,
        description:
          "Introduction to tennis for first-timers — grip, stance, and rally basics.",
        curriculum:
          "Week 1–4: Racquet familiarization & footwork\nWeek 5–8: Forehand & backhand basics\nWeek 9–12: Serve introduction & mini matches",
        sortOrder: 1,
      },
      {
        name: "Intermediate",
        slug: "intermediate",
        ageGroup: "8–14 years",
        focusAreas: "Stroke consistency, court positioning",
        sessionsPerWeek: 3,
        description:
          "Build consistent groundstrokes and develop match awareness.",
        curriculum:
          "Stroke refinement, directional control, basic tactics, fitness intro",
        sortOrder: 2,
      },
      {
        name: "Semi-Advanced",
        slug: "semi-advanced",
        ageGroup: "10–16 years",
        focusAreas: "Tactics, spin, competitive drills",
        sessionsPerWeek: 4,
        description:
          "Bridge to competitive play with structured match practice.",
        curriculum:
          "Advanced spin, point construction, video analysis sessions",
        sortOrder: 3,
      },
      {
        name: "Advanced Performance",
        slug: "advanced-performance",
        ageGroup: "12–18 years",
        focusAreas: "Tournament prep, mental game, peak fitness",
        sessionsPerWeek: 5,
        description:
          "High-performance pathway for tournament-bound juniors.",
        curriculum:
          "Periodized training, ranking goals, mental conditioning",
        sortOrder: 4,
      },
      {
        name: "Adult Program",
        slug: "adult-program",
        ageGroup: "18+ years",
        focusAreas: "Fitness, social play, technique refresh",
        sessionsPerWeek: 2,
        description:
          "Adults of all levels — learn, improve, and stay active.",
        curriculum:
          "Technique clinics, cardio tennis, friendly matches",
        sortOrder: 5,
      },
    ].map((p) => prisma.program.create({ data: p }))
  );

  const [beginner, intermediate, semiAdv, advanced, adult] = programs;

  for (const [program, monthly, quarterly] of [
    [beginner, 4000, 11000],
    [intermediate, 5000, 13500],
    [semiAdv, 6500, 18000],
    [advanced, 8000, 22000],
    [adult, 4500, 12000],
  ] as const) {
    await prisma.feePlan.createMany({
      data: [
        {
          programId: program.id,
          name: "Monthly",
          interval: "MONTHLY",
          amountInr: monthly,
          inclusions: "Coaching sessions, court access, progress check-ins",
          isPopular: false,
          sortOrder: 1,
        },
        {
          programId: program.id,
          name: "Quarterly",
          interval: "QUARTERLY",
          amountInr: quarterly,
          inclusions:
            "All monthly benefits + priority batch placement + 1 video analysis",
          isPopular: true,
          sortOrder: 2,
        },
      ],
    });
  }

  const coachRahul = await prisma.coach.create({
    data: {
      userId: coachUser.id,
      name: "Rahul Sharma",
      slug: "rahul-sharma",
      photoUrl: "/images/coaches/placeholder.jpg",
      certifications: "ITF Level 1, AITA Certified",
      playingBackground: "State-level junior competitor, 12+ years coaching",
      specialization: "Junior development & fundamentals",
      bio: "Rahul has coached hundreds of juniors from first racquet to tournament play.",
      isPublished: true,
      sortOrder: 1,
    },
  });

  const coachAnanya = await prisma.coach.create({
    data: {
      name: "Ananya Reddy",
      slug: "ananya-reddy",
      photoUrl: "/images/coaches/placeholder.jpg",
      certifications: "ITF Level 2, PTR Professional",
      playingBackground: "National-level player, former university captain",
      specialization: "Advanced performance & mental conditioning",
      bio: "Ananya specializes in tournament preparation and the mental side of tennis.",
      isPublished: true,
      sortOrder: 2,
    },
  });

  await prisma.coach.create({
    data: {
      name: "Vikram Patel",
      slug: "vikram-patel",
      photoUrl: "/images/coaches/placeholder.jpg",
      certifications: "AITA Certified, Fitness Specialist",
      playingBackground: "Club champion, adult coaching specialist",
      specialization: "Adult programs & fitness tennis",
      bio: "Vikram makes adult tennis fun, social, and results-driven.",
      isPublished: true,
      sortOrder: 3,
    },
  });

  await prisma.batch.createMany({
    data: [
      {
        name: "Beginner Morning A",
        programId: beginner.id,
        coachId: coachRahul.id,
        daysOfWeek: JSON.stringify(["MON", "WED", "FRI"]),
        timeSlot: "MORNING",
        startTime: "06:30",
        endTime: "07:30",
        court: "Court 1",
        capacity: 8,
      },
      {
        name: "Intermediate Evening A",
        programId: intermediate.id,
        coachId: coachRahul.id,
        daysOfWeek: JSON.stringify(["TUE", "THU", "SAT"]),
        timeSlot: "EVENING",
        startTime: "16:00",
        endTime: "17:30",
        court: "Court 2",
        capacity: 8,
      },
      {
        name: "Semi-Advanced Evening",
        programId: semiAdv.id,
        coachId: coachAnanya.id,
        daysOfWeek: JSON.stringify(["MON", "WED", "FRI"]),
        timeSlot: "EVENING",
        startTime: "17:30",
        endTime: "19:00",
        court: "Court 1",
        capacity: 6,
      },
      {
        name: "Advanced Performance AM",
        programId: advanced.id,
        coachId: coachAnanya.id,
        daysOfWeek: JSON.stringify(["MON", "TUE", "WED", "THU", "FRI"]),
        timeSlot: "MORNING",
        startTime: "06:00",
        endTime: "08:00",
        court: "Court 1 & 2",
        capacity: 6,
      },
      {
        name: "Adult Evening Social",
        programId: adult.id,
        coachId: coachRahul.id,
        daysOfWeek: JSON.stringify(["TUE", "THU"]),
        timeSlot: "EVENING",
        startTime: "18:00",
        endTime: "19:00",
        court: "Court 2",
        capacity: 10,
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        studentName: "Aarav Mehta",
        achievement: "U-12 District Champion 2025",
        quote:
          "VMKTA transformed Aarav's game and confidence. The coaches truly care.",
        parentName: "Sneha Mehta",
        isPublished: true,
        sortOrder: 1,
      },
      {
        studentName: "Diya Krishnan",
        achievement: "State ranking top 20 U-14",
        quote:
          "Structured curriculum and video analysis made a huge difference.",
        parentName: "Ravi Krishnan",
        isPublished: true,
        sortOrder: 2,
      },
      {
        studentName: "Kabir Singh",
        achievement: "First tournament win within 8 months",
        quote: "From nervous beginner to podium — forever grateful to the team.",
        parentName: "Neha Singh",
        isPublished: true,
        sortOrder: 3,
      },
    ],
  });

  await prisma.faq.createMany({
    data: [
      {
        question: "At what age can my child start?",
        answer:
          "We welcome kids from age 5. Our Beginner program is designed for first-timers with age-appropriate drills.",
        sortOrder: 1,
      },
      {
        question: "What should we bring to the first class?",
        answer:
          "Comfortable sportswear, non-marking tennis shoes, a water bottle, and a towel. A racquet is helpful but not required for beginners.",
        sortOrder: 2,
      },
      {
        question: "Do you provide racquets?",
        answer:
          "Yes — demo racquets are available for trial classes and beginners. We can also advise on buying the right racquet later.",
        sortOrder: 3,
      },
      {
        question: "How does the free trial work?",
        answer:
          "Book a free trial online or via WhatsApp. We'll place your child in an age-appropriate batch for one session so you can experience our coaching.",
        sortOrder: 4,
      },
      {
        question: "How are fees structured?",
        answer:
          "Each program offers monthly and quarterly plans. Quarterly plans include savings and priority benefits. A free trial is available before enrolment.",
        sortOrder: 5,
      },
      {
        question: "Can we change batches later?",
        answer:
          "Yes, subject to capacity. Speak with front desk and we'll try to accommodate preferred slots and coaches.",
        sortOrder: 6,
      },
      {
        question: "What is your rain / weather policy?",
        answer:
          "Outdoor sessions cancelled due to rain are rescheduled or converted to indoor fitness/technique sessions when possible.",
        sortOrder: 7,
      },
      {
        question: "Do you support tournament participation?",
        answer:
          "Yes — especially Semi-Advanced and Advanced players. We help with tournament selection, prep, and on-court support where possible.",
        sortOrder: 8,
      },
      {
        question: "How do parents get progress updates?",
        answer:
          "Coaches share periodic feedback; parents can request check-ins. Advanced players get structured progress notes.",
        sortOrder: 9,
      },
      {
        question: "Is there a parent waiting area?",
        answer:
          "Yes — parents are welcome to watch from designated areas. Please avoid interrupting sessions on court.",
        sortOrder: 10,
      },
    ],
  });

  const settings: Record<string, unknown> = {
    academyName: "VMK Tennis Academy",
    tagline: "Build Champions On & Off the Court",
    address: "VMK Tennis Academy, [Your Address], City, State PIN",
    phone: "+919876543210",
    whatsapp: "+919876543210",
    email: "hello@vmkta.com",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.0!2d78.4!3d17.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI0JzAwLjAiTiA3OMKwMjQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1",
    googleReviewsUrl: "https://g.page/r/PLACEHOLDER",
    googleReviewCount: 128,
    googleRating: 4.9,
    social: {
      instagram: "https://instagram.com/vmkta",
      youtube: "https://youtube.com/@vmkta",
      facebook: "https://facebook.com/vmkta",
    },
    scheduleWindows: {
      morning: { label: "Morning", start: "06:00", end: "10:00" },
      evening: { label: "Evening", start: "16:00", end: "19:00" },
    },
    hero: {
      headline: "Build Champions On & Off the Court",
      subheading: "Professional Tennis Coaching for Kids, Juniors & Adults",
      videoUrl: "/videos/hero.mp4",
      posterUrl: "/images/hero-poster.jpg",
    },
    about: {
      story:
        "VMK Tennis Academy was founded to make professional coaching accessible — building champions on and off the court.",
      mission:
        "Develop skilled, confident, and sportsperson-like individuals through structured tennis training.",
      yearsOperating: 8,
      studentsTrained: 500,
      tournamentsWon: 45,
      courts: 2,
    },
    whyChoose: [
      {
        title: "Certified Coaches",
        description: "ITF/AITA-certified coaches with competitive backgrounds.",
        icon: "award",
      },
      {
        title: "Structured Curriculum",
        description: "Age- and level-based pathways from beginner to performance.",
        icon: "book",
      },
      {
        title: "Low Student-to-Coach Ratio",
        description: "Small batches so every player gets individual attention.",
        icon: "users",
      },
      {
        title: "Video Analysis",
        description: "Technique feedback using video review for faster improvement.",
        icon: "video",
      },
      {
        title: "Fitness & Mental Conditioning",
        description: "On-court fitness and mindset training built into programs.",
        icon: "brain",
      },
      {
        title: "Tournament Exposure",
        description: "Guidance and support for local and state-level events.",
        icon: "trophy",
      },
    ],
    notificationEmails: ["admin@vmkta.com"],
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.create({
      data: { key, value: JSON.stringify(value) },
    });
  }

  const stages = [
    "NEW",
    "NEW",
    "CONTACTED",
    "CONTACTED",
    "TRIAL_SCHEDULED",
    "TRIAL_COMPLETED",
    "ENROLLED",
    "ENROLLED",
    "LOST",
    "NEW",
  ] as const;

  const sources = [
    "TRIAL_BOOKING",
    "ENQUIRY",
    "WALK_IN",
    "REFERRAL",
    "SOCIAL",
    "TRIAL_BOOKING",
    "ENQUIRY",
    "REFERRAL",
    "WALK_IN",
    "OTHER",
  ] as const;

  const names = [
    ["Arjun", "Kapoor"],
    ["Meera", "Iyer"],
    ["Rohan", "Desai"],
    ["Sara", "Khan"],
    ["Vihaan", "Joshi"],
    ["Anaya", "Gupta"],
    ["Ishaan", "Malhotra"],
    ["Zara", "Ali"],
    ["Advait", "Rao"],
    ["Kiara", "Shah"],
  ];

  for (let i = 0; i < 10; i++) {
    const [first, last] = names[i];
    await prisma.lead.create({
      data: {
        playerName: `${first} ${last}`,
        parentName: `Parent of ${first}`,
        phone: `98765000${String(i).padStart(2, "0")}`,
        email: `${first.toLowerCase()}@example.com`,
        playerAge: 7 + (i % 8),
        programInterest: programs[i % 5].name,
        programId: programs[i % 5].id,
        preferredSlot: i % 2 === 0 ? "MORNING" : "EVENING",
        message: "Interested in joining after a trial.",
        source: sources[i],
        stage: stages[i],
        assignedToId: i % 3 === 0 ? admin.id : undefined,
        lostReason: stages[i] === "LOST" ? "Chose another academy" : undefined,
      },
    });
  }

  console.log("✅ Seed complete.");
  console.log("   Admin: admin@vmkta.com");
  console.log(`   Programs: ${programs.length}, Leads: 10`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
