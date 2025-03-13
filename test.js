import prisma from "./src/lib/prisma.js";

async function main() {
  const personnel = await prisma.personnel.create({
    data: {
      person_name: "Nico G. Dumandan",
      job_title: "University Researcher II",
      email_address: "ngdumandan@up.edu.ph",
    },
  });

  console.log("New personnel added:", personnel);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
