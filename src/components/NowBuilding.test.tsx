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
const today = new Date("2026-11-12T08:00:00Z");

describe("<NowBuildingBubble />", () => {
  it("links a project without a card to its repository", () => {
    render(<NowBuildingBubble now={forge} today={today} cards={new Map()} />);
    const link = screen.getByRole("link", { name: /now building\s*forge wallet/i });
    expect(link).toHaveAttribute("href", forge.htmlUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAccessibleName(/repository on GitHub/);
  });

  it("links a project that has a card to that card on the page", () => {
    render(
      <NowBuildingBubble now={forge} today={today} cards={new Map([["gunnarwrld/forge-wallet-android", "forge-wallet"]])} />,
    );
    const link = screen.getByRole("link", { name: /now building\s*forge wallet/i });
    expect(link).toHaveAttribute("href", "#project-forge-wallet");
    expect(link).not.toHaveAttribute("target");
    expect(link).toHaveAccessibleName(/project card on this page/);
  });

  it("stays hidden when the repo has gone quiet or there is no pick", () => {
    const { container, rerender } = render(
      <NowBuildingBubble now={forge} today={new Date("2027-01-20T00:00:00Z")} cards={new Map()} />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(<NowBuildingBubble now={null} today={today} cards={new Map()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
