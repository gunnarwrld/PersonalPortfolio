import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/data/githubSyncData", () => ({
  githubSync: {
    generatedAt: "2026-01-02T00:00:00.000Z",
    owner: "gunnarwrld",
    repos: {
      "gunnarwrld/smart-home-gitops": {
        name: "smart-home-gitops",
        fullName: "gunnarwrld/smart-home-gitops",
        description: "from github, not the card",
        topics: [],
        primaryLanguage: "Kotlin",
        languages: [{ name: "Kotlin", percentage: 100 }],
        homepage: null,
        defaultBranch: "main",
        pushedAt: "2026-01-02T03:04:05Z",
        archived: true,
        stars: 0,
        fork: false,
        htmlUrl: "https://github.com/gunnarwrld/smart-home-gitops",
        onSite: true,
      },
    },
  },
}));

import Projects from "./Projects";

describe("project cards use synced GitHub facts", () => {
  it("shows languages, last push, and archived, and keeps the hand-written blurb", async () => {
    render(<Projects />);

    const card = screen.getByRole("article", { name: /Smart Home GitOps/ });
    expect(within(card).getByText("Archived")).toBeInTheDocument();
    expect(within(card).getByText("Kotlin")).toBeInTheDocument();
    expect(within(card).getByText(/Jan 2, 2026/)).toBeInTheDocument();
    expect(within(card).getByText("Coursework")).toBeInTheDocument();
    expect(within(card).getByText(/polls a GitOps repository/)).toBeInTheDocument();
    expect(within(card).queryByText("from github, not the card")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View details for HKIF Website" })).toBeInTheDocument();

    fireEvent.click(within(card).getByRole("button", { name: "View details for Smart Home GitOps" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Kotlin 100.0%")).toBeInTheDocument();
    expect(within(dialog).getByText("Jetpack Compose")).toBeInTheDocument();
    expect(within(dialog).getByText(/Updated Jan 2, 2026/)).toBeInTheDocument();
    expect(within(dialog).getByText(/disposable test repository/)).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "View Code" })).toHaveAttribute(
      "href",
      "https://github.com/gunnarwrld/smart-home-gitops",
    );
  });

  it("gives the code and live links of each card their own names, and keeps them out of the dialog trigger", () => {
    render(<Projects />);

    const card = screen.getByRole("article", { name: /PostHub/ });
    expect(within(card).getByRole("link", { name: "View source code for PostHub" })).toHaveAttribute(
      "href",
      "https://github.com/gunnarwrld/PostHub-DynamicWebsite",
    );
    expect(within(card).getByRole("link", { name: "View live demo for PostHub" })).toBeInTheDocument();

    fireEvent.click(within(card).getByRole("link", { name: "View source code for PostHub" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("numbers the cards in the order of the data file", () => {
    render(<Projects />);

    const first = screen.getByRole("article", { name: /HKIF Website/ });
    expect(within(first).getByText("No. 1")).toBeInTheDocument();
  });
});
