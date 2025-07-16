import prisma from '../src/prisma'; // adjust path as needed

async function main() {
  const course = await prisma.courses.create({
    data: {
      courseId: "ILM-001",
      author: "Ustaz Ahmed",
      category: "Aqeedah",
      courseIds: "ILM-001,ILM-002",
      noOfRecord: 10,
      pdfId: "pdf123",
      title: "Intro to Aqeedah",
      ustaz: "Ustaz Ahmed",
      image: "https://example.com/course.jpg",
      totalDuration: 3600,
      audioSizes: "10MB, 15MB",
      isCompleted: 0,
      dateTime: new Date(),
      isDeleted: false,
      isBeginner: true
    }
  });

  console.log("Test course created:", course);
}

main()
  .catch((e) => {
    console.error("Error creating course:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
