import { UsersType } from "@/types/apps/userTypes";
import RoleList from "../../views/apps/roles/page";

const RolesApp = async () => {
  // Vars
  const data: UsersType[] = [
    {
      id: 1,
      fullName: "Galen Slixby",
      company: "Yotz PVT LTD",
      role: "editor",
      username: "gslixby0",
      country: "El Salvador",
      contact: "(479) 232-9151",
      email: "gslixby0@abc.net.au",
      currentPlan: "enterprise",
      status: "inactive",
      avatar: "",
      avatarColor: "primary",
      billing: "Auto Debit",
      sectionName: "Marketing",
      sectionSlug: "marketing",
      templateSlug: "template-slug",
      templateDescription: "Marketing Template",
      name: "Galen Slixby",
      slug: "galen-slixby",
      jsonContent: "{}",
      createdAt: new Date().toISOString(),
      sectionId: "123",
    },
    {
      id: 2,
      fullName: "John Doe",
      company: "Tech Solutions",
      role: "admin",
      username: "jdoe",
      country: "United States",
      contact: "(555) 123-4567",
      email: "jdoe@tech.com",
      currentPlan: "pro",
      status: "active",
      avatar: "",
      avatarColor: "secondary",
      billing: "Credit Card",
      sectionName: "IT",
      sectionSlug: "it",
      templateSlug: "it-template",
      templateDescription: "IT Infrastructure Template",
      name: "John Doe",
      slug: "john-doe",
      jsonContent: "{}",
      createdAt: new Date().toISOString(),
      sectionId: "124",
    },
    {
      id: 3,
      fullName: "Sarah Connor",
      company: "Skynet Systems",
      role: "manager",
      username: "sconnor",
      country: "Canada",
      contact: "(780) 456-7890",
      email: "sconnor@skynet.ca",
      currentPlan: "enterprise",
      status: "inactive",
      avatar: "",
      avatarColor: "info",
      billing: "Auto Debit",
      sectionName: "Operations",
      sectionSlug: "operations",
      templateSlug: "ops-template",
      templateDescription: "Operations Template",
      name: "Sarah Connor",
      slug: "sarah-connor",
      jsonContent: "{}",
      createdAt: new Date().toISOString(),
      sectionId: "125",
    },
    {
      id: 4,
      fullName: "Bruce Wayne",
      company: "Wayne Enterprises",
      role: "owner",
      username: "bwayne",
      country: "United Kingdom",
      contact: "(888) 456-3210",
      email: "bwayne@wayneenterprises.uk",
      currentPlan: "premium",
      status: "active",
      avatar: "",
      avatarColor: "success",
      billing: "Wire Transfer",
      sectionName: "Finance",
      sectionSlug: "finance",
      templateSlug: "finance-template",
      templateDescription: "Finance Template",
      name: "Bruce Wayne",
      slug: "bruce-wayne",
      jsonContent: "{}",
      createdAt: new Date().toISOString(),
      sectionId: "126",
    },
    {
      id: 5,
      fullName: "Diana Prince",
      company: "Themyscira Tech",
      role: "cto",
      username: "dprince",
      country: "Greece",
      contact: "(789) 456-1234",
      email: "dprince@themyscira.com",
      currentPlan: "pro",
      status: "active",
      avatar: "",
      avatarColor: "warning",
      billing: "PayPal",
      sectionName: "R&D",
      sectionSlug: "rnd",
      templateSlug: "rnd-template",
      templateDescription: "Research and Development Template",
      name: "Diana Prince",
      slug: "diana-prince",
      jsonContent: "{}",
      createdAt: new Date().toISOString(),
      sectionId: "127",
    },
    {
      id: 6,
      fullName: "Clark Kent",
      company: "Daily Planet",
      role: "reporter",
      username: "ckent",
      country: "United States",
      contact: "(456) 123-7890",
      email: "ckent@dailyplanet.com",
      currentPlan: "basic",
      status: "inactive",
      avatar: "",
      avatarColor: "warning",
      billing: "Credit Card",
      sectionName: "Media",
      sectionSlug: "media",
      templateSlug: "media-template",
      templateDescription: "Media Template",
      name: "Clark Kent",
      slug: "clark-kent",
      jsonContent: "{}",
      createdAt: new Date().toISOString(),
      sectionId: "128",
    },
    {
      id: 7,
      fullName: "Peter Parker",
      company: "Parker Industries",
      role: "developer",
      username: "pparker",
      country: "United States",
      contact: "(654) 321-9876",
      email: "pparker@parker.com",
      currentPlan: "enterprise",
      status: "active",
      avatar: "",
      avatarColor: "primary",
      billing: "Auto Debit",
      sectionName: "Development",
      sectionSlug: "development",
      templateSlug: "dev-template",
      templateDescription: "Development Template",
      name: "Peter Parker",
      slug: "peter-parker",
      jsonContent: "{}",
      createdAt: new Date().toISOString(),
      sectionId: "129",
    },
    {
      id: 8,
      fullName: "Tony Stark",
      company: "Stark Industries",
      role: "ceo",
      username: "tstark",
      country: "United States",
      contact: "(987) 654-3210",
      email: "tstark@stark.com",
      currentPlan: "enterprise",
      status: "active",
      avatar: "",
      avatarColor: "info",
      billing: "Wire Transfer",
      sectionName: "Innovation",
      sectionSlug: "innovation",
      templateSlug: "innovation-template",
      templateDescription: "Innovation Template",
      name: "Tony Stark",
      slug: "tony-stark",
      jsonContent: "{}",
      createdAt: new Date().toISOString(),
      sectionId: "130",
    },
    {
      id: 9,
      fullName: "Natasha Romanoff",
      company: "Shield",
      role: "agent",
      username: "nromanoff",
      country: "Russia",
      contact: "(444) 654-7890",
      email: "nromanoff@shield.org",
      currentPlan: "pro",
      status: "inactive",
      avatar: "",
      avatarColor: "warning",
      billing: "Credit Card",
      sectionName: "Security",
      sectionSlug: "security",
      templateSlug: "security-template",
      templateDescription: "Security Template",
      name: "Natasha Romanoff",
      slug: "natasha-romanoff",
      jsonContent: "{}",
      createdAt: new Date().toISOString(),
      sectionId: "131",
    },
    {
      id: 10,
      fullName: "Steve Rogers",
      company: "Avengers",
      role: "captain",
      username: "srogers",
      country: "United States",
      contact: "(123) 456-7890",
      email: "srogers@avengers.com",
      currentPlan: "enterprise",
      status: "active",
      avatar: "",
      avatarColor: "primary",
      billing: "Auto Debit",
      sectionName: "Leadership",
      sectionSlug: "leadership",
      templateSlug: "leadership-template",
      templateDescription: "Leadership Template",
      name: "Steve Rogers",
      slug: "steve-rogers",
      jsonContent: "{}",
      createdAt: new Date().toISOString(),
      sectionId: "132",
    },
  ];

  return <RoleList userData={data} />;
};

export default RolesApp;
