export type TemplateSectionId =
  | "summary"
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "certifications"
  | "achievements";

export type TemplateColumn = "FULL" | "LEFT" | "RIGHT";

export type TemplateSectionConfig = {
  id: TemplateSectionId;
  enabled: boolean;
  order: number;
  column: TemplateColumn;
  title?: string;
  spacing?: "SMALL" | "MEDIUM" | "LARGE";
};

export type TemplateHeaderConfig = {
  enabled: boolean;
  alignment: "LEFT" | "CENTER" | "RIGHT";

  showName: boolean;
  showTitle: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  showLinkedIn: boolean;
  showGithub: boolean;

  nameSize: "SMALL" | "MEDIUM" | "LARGE" | "EXTRA_LARGE";
};

export type TemplatePageConfig = {
  margin: "SMALL" | "MEDIUM" | "LARGE";
  contentSpacing: "SMALL" | "MEDIUM" | "LARGE";
};

export type TemplateTypographyConfig = {
  fontFamily: "SANS" | "SERIF" | "MONO";
  bodySize: "SMALL" | "MEDIUM" | "LARGE";
  headingSize: "SMALL" | "MEDIUM" | "LARGE";
  lineHeight: "COMPACT" | "NORMAL" | "RELAXED";
};

export type TemplateStyleConfig = {
  accentColor: string;
  sectionStyle: "SIMPLE" | "UNDERLINE" | "BOXED";
};

export type ResumeTemplateConfig = {
  header: TemplateHeaderConfig;

  layout: {
    type: "ONE_COLUMN" | "TWO_COLUMN";
    leftWidth: number;
    rightWidth: number;
    gap: number;
  };

  sections: TemplateSectionConfig[];

  page: TemplatePageConfig;

  typography: TemplateTypographyConfig;

  style: TemplateStyleConfig;
};

export const DEFAULT_TEMPLATE_CONFIG: ResumeTemplateConfig = {
  header: {
    enabled: true,
    alignment: "CENTER",

    showName: true,
    showTitle: true,
    showEmail: true,
    showPhone: true,
    showLocation: true,
    showLinkedIn: true,
    showGithub: true,

    nameSize: "LARGE",
  },

  layout: {
    type: "ONE_COLUMN",
    leftWidth: 1,
    rightWidth: 1,
    gap: 8,
  },

  sections: [
    {
      id: "summary",
      enabled: true,
      order: 1,
      column: "FULL",
      title: "Professional Summary",
      spacing: "MEDIUM",
    },
    {
      id: "experience",
      enabled: true,
      order: 2,
      column: "FULL",
      title: "Experience",
      spacing: "MEDIUM",
    },
    {
      id: "projects",
      enabled: true,
      order: 3,
      column: "FULL",
      title: "Projects",
      spacing: "MEDIUM",
    },
    {
      id: "education",
      enabled: true,
      order: 4,
      column: "FULL",
      title: "Education",
      spacing: "MEDIUM",
    },
    {
      id: "skills",
      enabled: true,
      order: 5,
      column: "FULL",
      title: "Skills",
      spacing: "MEDIUM",
    },
    {
      id: "certifications",
      enabled: true,
      order: 6,
      column: "FULL",
      title: "Certifications",
      spacing: "MEDIUM",
    },
    {
      id: "achievements",
      enabled: true,
      order: 7,
      column: "FULL",
      title: "Achievements",
      spacing: "MEDIUM",
    },
  ],

  page: {
    margin: "MEDIUM",
    contentSpacing: "MEDIUM",
  },

  typography: {
    fontFamily: "SANS",
    bodySize: "MEDIUM",
    headingSize: "MEDIUM",
    lineHeight: "NORMAL",
  },

  style: {
    accentColor: "BLACK",
    sectionStyle: "SIMPLE",
  },
};
