import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import About from "./About";
import { projects } from "@/data/projects";

describe("About", () => {
  it("counts the projects on the page and does not claim live users or edge latency", () => {
    render(<About />);

    expect(screen.getByText("Projects built")).toBeInTheDocument();
    expect(screen.getByText(String(projects.length))).toBeInTheDocument();
    expect(screen.queryByText(/Projects Shipped/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/real users/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/five live projects/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sub-50ms|300\+/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Durable Object/i)).toBeInTheDocument();
  });
});
