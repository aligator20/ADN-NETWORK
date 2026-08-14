/**
 * VERSION ANGLAISE DES DISCIPLINES
 *
 * Les identifiants, les couleurs et la nature (`delivery` / `pathway`) sont
 * repris du français : ce sont des données de structure, pas du texte. Seuls
 * `name`, `statement` et `capabilities` se traduisent.
 *
 * La distinction delivery / pathway est maintenue en anglais avec la même
 * franchise : Network et Cybersecurity ANNONCENT de l'orientation. Traduire
 * « orientation » par un vague « consulting » rétablirait exactement
 * l'ambiguïté que le français avait supprimée.
 */
import { services as servicesFr, type Service, type ServiceId } from "@/content/services";

type Traduction = Pick<Service, "name" | "statement" | "capabilities">;

const EN: Record<ServiceId, Traduction> = {
  digital: {
    name: "Digital",
    statement: "Platforms and products built to carry the load, and the years.",
    capabilities: ["Web platforms", "Product engineering", "Design systems", "Performance"],
  },
  ai: {
    name: "AI",
    statement: "Applied intelligence, wired into your actual data.",
    capabilities: ["LLM integration", "RAG", "Computer vision", "Agents"],
  },
  automation: {
    name: "Automation",
    statement: "The processes that cost you hours start running on their own.",
    capabilities: ["Orchestration", "Data pipelines", "Integrations", "RPA"],
  },
  network: {
    name: "Network",
    statement:
      "The sector is hiring, and almost nobody opens the door. We train, and we point people towards infrastructure work.",
    capabilities: [
      "Career guidance",
      "Networking fundamentals",
      "Certification prep",
      "Introductions",
    ],
  },
  cybersecurity: {
    name: "Cybersecurity",
    statement:
      "A field that recruits faster than it trains. We back the people who want to get in, not the ones who want to talk about it.",
    capabilities: [
      "Career guidance",
      "Defensive fundamentals",
      "Certification prep",
      "Pathway support",
    ],
  },
  creative: {
    name: "Creative",
    statement: "An identity that makes the technology desirable.",
    capabilities: ["Brand identity", "Art direction", "Motion", "Graphic design"],
  },
  agritech: {
    name: "Agritech",
    statement: "The sensor, the water and the data — from the field to the dashboard.",
    capabilities: ["IoT sensors", "Irrigation control", "Yield analysis", "Traceability"],
  },
  farming: {
    name: "Farming & Livestock",
    statement:
      "Farms designed to grow on their own revenue, not on one funding round after another.",
    capabilities: [
      "Plot planning",
      "Staged mechanisation",
      "Integrated livestock",
      "Circular economy",
    ],
  },
  food: {
    name: "Food processing",
    statement: "Processing on site what used to leave raw: the value stays where it is produced.",
    capabilities: ["Product brand", "Processing unit", "Packaging", "Distribution"],
  },
};

export const servicesEn: readonly Service[] = servicesFr.map((s) => ({ ...s, ...EN[s.id] }));

export const metricsEn = [
  { value: 7, suffix: "", label: "Disciplines" },
  { value: 100, suffix: "%", label: "Bespoke" },
  { value: 24, suffix: "/7", label: "Oversight" },
  { value: 1, suffix: "", label: "Point of contact" },
];
