import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { NowBuilding } from "@/lib/githubSync";
import { NowBuildingBubble } from "./NowBuilding";

const forge: NowBuilding = {
  fullName: "gunnarwrld/forge-wallet-android",
  name: "forge-wallet-android",
  label: "Forge Wallet",
  htmlUrl: "https://github.com/gunnarwrld/forge-wallet-android",
  primaryLanguage: "Kotlin",
  pushedAt: "2026-11-10T11:09:16Z",
};

describe("<NowBuildingBubble />", () => {
  it("names the project and links to its repository", () => {
    render(<NowBuildingBubble now={forge} today={new Date("2026-11-12T08:00:00Z")} shownOnSite={new Set()} />);
    const link = screen.getByRole("link", { name: /now building\s*forge wallet/i });
    expect(link).toHaveAttribute("href", forge.htmlUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAccessibleName(/repository on GitHub/);
  });

  it("stays hidden once the project has a card on the page", () => {
    const { container } = render(
      <NowBuildingBubble
        now={forge}
        today={new Date("2026-11-12T08:00:00Z")}
        shownOnSite={new Set(["gunnarwrld/forge-wallet-android"])}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("stays hidden when the repo has gone quiet or there is no pick", () => {
    const { container, rerender } = render(
      <NowBuildingBubble now={forge} today={new Date("2027-01-20T00:00:00Z")} shownOnSite={new Set()} />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(<NowBuildingBubble now={null} today={new Date("2026-11-12T08:00:00Z")} shownOnSite={new Set()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
