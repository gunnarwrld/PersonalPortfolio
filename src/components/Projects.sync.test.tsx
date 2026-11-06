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

    const card = screen.getByRole("button", { name: /Smart Home GitOps/ });
    expect(within(card).getByText("Archived")).toBeInTheDocument();
    expect(within(card).getByText("Kotlin")).toBeInTheDocument();
    expect(within(card).getByText("Jan 2, 2026")).toBeInTheDocument();
    expect(within(card).getByText("Coursework")).toBeInTheDocument();
    expect(within(card).getByText(/polls a GitOps repository/)).toBeInTheDocument();
    expect(within(card).queryByText("from github, not the card")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View details for HKIF Website" })).toBeInTheDocument();

    fireEvent.click(card);
    fireEvent.click(
      screen.getByRole("button", {
        name: "View details for Smart Home GitOps, archived, updated Jan 2, 2026",
      }),
    );

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
});
