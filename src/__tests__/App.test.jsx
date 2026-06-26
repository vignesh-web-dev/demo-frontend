import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";

const mockUsers = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("App", () => {
  test("shows loading state initially", () => {
    global.fetch.mockImplementation(() => new Promise(() => {}));

    render(<App />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders users table after successful fetch", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(<App />);

    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
  });

  test("renders all table headers", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(<App />);

    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  test("renders correct number of rows", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(<App />);

    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());

    const rows = screen.getAllByRole("row");
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3);
  });

  test("shows error message when fetch returns non-ok response", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<App />);

    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
    );

    expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
    expect(screen.getByText(/Error 500/i)).toBeInTheDocument();
  });

  test("shows error message when fetch throws a network error", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));

    render(<App />);

    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument(),
    );

    expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
    expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
  });

  test("calls the correct API endpoint", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(<App />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/users"),
    );
  });
});
