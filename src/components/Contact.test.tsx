import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Contact from "./Contact";

// Stub framer-motion's useScroll/useTransform so jsdom doesn't choke on
// scroll observation. The component still mounts and renders all controls.
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 1,
  };
});

describe("<Contact />", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the three form fields and the submit button", () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your@email\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tell me about your project/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("renders external links to GitHub, LinkedIn, and email", () => {
    render(<Contact />);
    const links = screen.getAllByRole("link").map((a) => a.getAttribute("href") ?? "");
    expect(links.some((h) => h.includes("github.com/gunnarwrld"))).toBe(true);
    expect(links.some((h) => h.includes("linkedin.com"))).toBe(true);
    expect(links.some((h) => h.startsWith("mailto:"))).toBe(true);
  });

  it("shows validation errors when submitting an empty form", async () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/message is required/i)).toBeInTheDocument();
  });

  it("does not call /api/contact when validation fails", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<Contact />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    // Wait for at least one error to appear, then assert fetch was never called.
    await screen.findByText(/name is required/i);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("POSTs to /api/contact with the form values when validation passes", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);

    fireEvent.input(screen.getByPlaceholderText(/your name/i), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.input(screen.getByPlaceholderText(/your@email\.com/i), {
      target: { value: "ada@lovelace.dev" },
    });
    fireEvent.input(screen.getByPlaceholderText(/tell me about your project/i), {
      target: { value: "Hello — would love to chat about a frontend role." },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/contact");
    expect(init.method).toBe("POST");
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      name: "Ada Lovelace",
      email: "ada@lovelace.dev",
      message: "Hello — would love to chat about a frontend role.",
    });
  });
});
