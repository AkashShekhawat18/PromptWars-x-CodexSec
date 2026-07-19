// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TodaysTasks } from "./TodaysTasks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tasksAPI } from "@/lib/api";

// Mock the API calls
vi.mock("@/lib/api", () => ({
  tasksAPI: {
    getTasks: vi.fn(),
  },
}));

// Mock the fetch call for AI Plan
global.fetch = vi.fn();

const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe("TodaysTasks Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    const queryClient = createTestQueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <TodaysTasks />
      </QueryClientProvider>
    );
  };

  it("should display a loading state initially", () => {
    vi.mocked(tasksAPI.getTasks).mockImplementation(() => new Promise(() => {})); // never resolves
    renderComponent();
    expect(screen.getByText("Today's Focus")).toBeInTheDocument();
    // Assuming loading state renders pulsing divs
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("should display tasks from API", async () => {
    vi.mocked(tasksAPI.getTasks).mockResolvedValue([
      { id: "1", title: "API Task 1", status: "TODO", priority: "HIGH" }
    ]);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("API Task 1")).toBeInTheDocument();
    });
  });

  it("should allow adding a new task locally", async () => {
    vi.mocked(tasksAPI.getTasks).mockResolvedValue([]);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Create your first task or let AI generate today's plan.")).toBeInTheDocument();
    });

    const addBtns = screen.getAllByText(/Add Task/i);
    fireEvent.click(addBtns[0]);

    const input = screen.getByPlaceholderText("Task title...");
    fireEvent.change(input, { target: { value: "New Local Task" } });
    
    const confirmAddBtn = screen.getByRole("button", { name: "Add" });
    fireEvent.click(confirmAddBtn);

    expect(screen.getByText("New Local Task")).toBeInTheDocument();
  });

  it("should trigger AI plan and append tasks", async () => {
    vi.mocked(tasksAPI.getTasks).mockResolvedValue([]);
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        tasks: [
          { title: "AI Generated Task", priority: "HIGH", description: "10:00 AM" }
        ]
      })
    });

    renderComponent();

    await waitFor(() => expect(screen.getByText(/AI Plan/)).toBeInTheDocument());

    const planBtn = screen.getByText(/AI Plan/);
    fireEvent.click(planBtn);

    expect(planBtn).toHaveTextContent("Planning your schedule...");

    await waitFor(() => {
      expect(screen.getByText("AI Generated Task")).toBeInTheDocument();
    });
  });
});
