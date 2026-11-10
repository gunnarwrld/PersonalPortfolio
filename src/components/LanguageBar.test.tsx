import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageBar } from "./LanguageBar";
import { formatShare, summarizeLanguages } from "@/lib/languageShare";

describe("summarizeLanguages", () => {
  it("keeps up to four languages as they are, largest first", () => {
    const parts = summarizeLanguages([
      { name: "Python", percentage: 5.6 },
      { name: "Kotlin", percentage: 86.3 },
      { name: "Dockerfile", percentage: 1.1 },
      { name: "PLpgSQL", percentage: 7 },
    ]);
    expect(parts.map((part) => part.name)).toEqual(["Kotlin", "PLpgSQL", "Python", "Dockerfile"]);
  });

  it("folds everything after the third language into Other", () => {
    const parts = summarizeLanguages([
      { name: "JavaScript", percentage: 57.7 },
      { name: "CSS", percentage: 18.1 },
      { name: "Shell", percentage: 9.6 },
      { name: "Batchfile", percentage: 7.8 },
      { name: "HTML", percentage: 6.8 },
    ]);
    expect(parts).toEqual([
      { name: "JavaScript", percentage: 57.7 },
      { name: "CSS", percentage: 18.1 },
      { name: "Shell", percentage: 9.6 },
      { name: "Other", percentage: 14.6 },
    ]);
  });

  it("drops languages with no share", () => {
    expect(summarizeLanguages([{ name: "Kotlin", percentage: 100 }, { name: "Mako", percentage: 0 }])).toEqual([
      { name: "Kotlin", percentage: 100 },
    ]);
  });
});

describe("formatShare", () => {
  it("prints whole numbers without a decimal and others with one", () => {
    expect(formatShare(100)).toBe("100%");
    expect(formatShare(95.5)).toBe("95.5%");
  });
});

describe("<LanguageBar />", () => {
  it("prints every part's name and share as text beside the bar", () => {
    render(
      <LanguageBar
        languages={[
          { name: "TypeScript", percentage: 95.5 },
          { name: "JavaScript", percentage: 4.5 },
        ]}
      />,
    );
    const rows = within(screen.getByRole("list", { name: "Languages" })).getAllByRole("listitem");
    expect(rows.map((row) => row.textContent)).toEqual(["TypeScript95.5%", "JavaScript4.5%"]);
  });

  it("renders nothing when a repo has no detected languages", () => {
    const { container } = render(<LanguageBar languages={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
