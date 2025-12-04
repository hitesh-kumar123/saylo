// PDF parsing service using PDF.js for client-side resume parsing
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParsedResumeData {
  skills: string[];
  experience: Experience[];
  education: Education[];
  summary?: string;
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  rawText: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export class PDFParserService {
  private static instance: PDFParserService;

  private constructor() {}

  static getInstance(): PDFParserService {
    if (!PDFParserService.instance) {
      PDFParserService.instance = new PDFParserService();
    }
    return PDFParserService.instance;
  }

  // Parse PDF file and extract resume data
  async parseResume(file: File): Promise<ParsedResumeData> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";

      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        fullText += pageText + "\n";
      }

      // Parse the extracted text
      return this.parseResumeText(fullText);
    } catch (error) {
      console.error("Error parsing PDF:", error);
      throw new Error("Failed to parse PDF file");
    }
  }

  // Parse resume text and extract structured data
  private parseResumeText(text: string): ParsedResumeData {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return {
      skills: this.extractSkills(text),
      experience: this.extractExperience(text),
      education: this.extractEducation(text),
      summary: this.extractSummary(text),
      personalInfo: this.extractPersonalInfo(text),
      rawText: text,
    };
  }

  // Extract skills from resume text
  private extractSkills(text: string): string[] {
    const skillKeywords = [
      // Programming Languages
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C++",
      "C#",
      "PHP",
      "Ruby",
      "Go",
      "Rust",
      "Swift",
      "Kotlin",
      "Scala",
      "R",
      "MATLAB",
      "Perl",
      "Haskell",
      "Clojure",
      "Erlang",

      // Web Technologies
      "HTML",
      "CSS",
      "React",
      "Vue",
      "Angular",
      "Node.js",
      "Express",
      "Django",
      "Flask",
      "Spring",
      "Laravel",
      "ASP.NET",
      "jQuery",
      "Bootstrap",
      "Tailwind",
      "SASS",
      "LESS",

      // Databases
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "SQLite",
      "Oracle",
      "SQL Server",
      "DynamoDB",
      "Cassandra",
      "Elasticsearch",
      "Neo4j",
      "CouchDB",

      // Cloud & DevOps
      "AWS",
      "Azure",
      "GCP",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "GitLab CI",
      "GitHub Actions",
      "Terraform",
      "Ansible",
      "Chef",
      "Puppet",
      "Vagrant",

      // Mobile Development
      "React Native",
      "Flutter",
      "Xamarin",
      "Ionic",
      "Cordova",
      "PhoneGap",

      // Data Science & AI
      "TensorFlow",
      "PyTorch",
      "Keras",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "Jupyter",
      "Tableau",
      "Power BI",
      "Apache Spark",
      "Hadoop",

      // Other Technologies
      "Git",
      "SVN",
      "Mercurial",
      "Linux",
      "Unix",
      "Windows",
      "macOS",
      "REST API",
      "GraphQL",
      "Microservices",
      "Agile",
      "Scrum",
      "Kanban",
      "JIRA",
      "Confluence",
      "Slack",
      "Trello",
    ];

    const foundSkills: string[] = [];
    const textLower = text.toLowerCase();

    skillKeywords.forEach((skill) => {
      if (textLower.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });

    // Remove duplicates and return
    return [...new Set(foundSkills)];
  }

  // Extract work experience
  private extractExperience(text: string): Experience[] {
    const experiences: Experience[] = [];
    const lines = text.split("\n");

    // Common patterns for experience sections
    const experiencePatterns = [
      /experience/i,
      /work history/i,
      /employment/i,
      /professional experience/i,
      /career history/i,
    ];

    let inExperienceSection = false;
    let currentExperience: Partial<Experience> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check if we're entering experience section
      if (experiencePatterns.some((pattern) => pattern.test(line))) {
        inExperienceSection = true;
        continue;
      }

      // Check if we're leaving experience section (education, skills, etc.)
      if (
        inExperienceSection &&
        /(education|skills|projects|certifications|achievements)/i.test(line)
      ) {
        if (currentExperience.company && currentExperience.position) {
          experiences.push(currentExperience as Experience);
        }
        inExperienceSection = false;
        currentExperience = {};
        continue;
      }

      if (inExperienceSection) {
        // Try to extract company and position
        const companyMatch = line.match(/^(.+?)\s*[-–—]\s*(.+?)$/);
        if (companyMatch) {
          if (currentExperience.company && currentExperience.position) {
            experiences.push(currentExperience as Experience);
          }
          currentExperience = {
            company: companyMatch[1].trim(),
            position: companyMatch[2].trim(),
            startDate: "",
            endDate: "",
            description: "",
          };
        } else if (currentExperience.company && line.trim()) {
          // Add to description
          if (currentExperience.description) {
            currentExperience.description += " " + line.trim();
          } else {
            currentExperience.description = line.trim();
          }
        }
      }
    }

    // Add the last experience if exists
    if (currentExperience.company && currentExperience.position) {
      experiences.push(currentExperience as Experience);
    }

    return experiences;
  }

  // Extract education information
  private extractEducation(text: string): Education[] {
    const education: Education[] = [];
    const lines = text.split("\n");

    const educationPatterns = [
      /education/i,
      /academic/i,
      /qualifications/i,
      /degrees/i,
    ];

    let inEducationSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (educationPatterns.some((pattern) => pattern.test(line))) {
        inEducationSection = true;
        continue;
      }

      if (
        inEducationSection &&
        /(experience|skills|projects|certifications)/i.test(line)
      ) {
        inEducationSection = false;
        continue;
      }

      if (inEducationSection) {
        // Look for degree patterns
        const degreeMatch = line.match(
          /(bachelor|master|phd|doctorate|associate|diploma|certificate)/i
        );
        if (degreeMatch) {
          const parts = line.split(/[-–—]/);
          if (parts.length >= 2) {
            education.push({
              institution: parts[0].trim(),
              degree: parts[1].trim(),
              field: parts[2] ? parts[2].trim() : "",
              graduationDate: "",
            });
          }
        }
      }
    }

    return education;
  }

  // Extract summary/objective
  private extractSummary(text: string): string | undefined {
    const summaryPatterns = [
      /summary/i,
      /objective/i,
      /profile/i,
      /about/i,
      /overview/i,
    ];

    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (summaryPatterns.some((pattern) => pattern.test(line))) {
        // Get the next few lines as summary
        let summary = "";
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          if (
            lines[j].trim() &&
            !/(experience|education|skills|projects)/i.test(lines[j])
          ) {
            summary += lines[j].trim() + " ";
          } else {
            break;
          }
        }
        return summary.trim() || undefined;
      }
    }

    return undefined;
  }

  // Extract personal information
  private extractPersonalInfo(text: string): ParsedResumeData["personalInfo"] {
    const personalInfo: ParsedResumeData["personalInfo"] = {};

    // Extract email
    const emailMatch = text.match(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
    );
    if (emailMatch) {
      personalInfo.email = emailMatch[0];
    }

    // Extract phone
    const phoneMatch = text.match(
      /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/
    );
    if (phoneMatch) {
      personalInfo.phone = phoneMatch[0];
    }

    // Extract name (usually at the top)
    const lines = text.split("\n");
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (
        firstLine.length > 0 &&
        !firstLine.includes("@") &&
        !firstLine.match(/\d/)
      ) {
        personalInfo.name = firstLine;
      }
    }

    // Extract location (look for city, state patterns)
    const locationMatch = text.match(
      /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}\b/
    );
    if (locationMatch) {
      personalInfo.location = locationMatch[0];
    }

    return personalInfo;
  }

  // Validate if file is a PDF
  static isPDF(file: File): boolean {
    return (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    );
  }

  // Get file size in MB
  static getFileSizeMB(file: File): number {
    return file.size / (1024 * 1024);
  }

  // Validate file size (max 10MB)
  static validateFileSize(file: File): boolean {
    return PDFParserService.getFileSizeMB(file) <= 10;
  }
}

// Export singleton instance
export const pdfParserService = PDFParserService.getInstance();
