import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import * as authStore from "../store/authStore";
import { Navbar } from "./Navbar";

vi.mock("../components/NotificationsPanel", () => ({
	NotificationsPanel: () => null,
}));
vi.mock("../components/SearchPanel", () => ({
	SearchPanel: () => null,
}));
vi.mock("../components/ActivitySidebar", () => ({
	ActivitySidebar: () => null,
}));

vi.mock("../store/authStore", () => ({
	useUser: vi.fn(),
	useAuthStore: vi.fn(),
}));

describe("<Navbar /> Logic", () => {
	// Test user is null
	test("không hiển thị menu người dùng khi chưa đăng nhập", () => {
		vi.mocked(authStore.useUser).mockReturnValue(null);

		render(
			<MemoryRouter>
				<Navbar />
			</MemoryRouter>,
		);

		// Tìm nút logout - nó không nên tồn tại
		const logoutBtn = screen.queryByTitle(/Logout/i);
		expect(logoutBtn).toBeNull();
	});

	// Test user login
	test("hiển thị thông tin user khi đã đăng nhập", () => {
		vi.mocked(authStore.useUser).mockReturnValue({
			id: "1",
			email: "dev@flowsync.com",
			fullName: "John Doe",
			avatarUrl: null,
			createdAt: "2024-01-01",
		});

		render(
			<MemoryRouter>
				<Navbar />
			</MemoryRouter>,
		);

		expect(screen.getByText("John Doe")).toBeDefined();
		expect(screen.getByText("dev@flowsync.com")).toBeDefined();
	});

	// Test Logout
	test("gọi hàm logout khi nhấn nút thoát", () => {
		const mockLogout = vi.fn();
		vi.mocked(authStore.useUser).mockReturnValue({
			id: "2",
			email: "test@test.com",
			fullName: null,
			avatarUrl: null,
			createdAt: "2024-01-01",
		});
		vi.mocked(authStore.useAuthStore).mockReturnValue(mockLogout);

		render(
			<MemoryRouter>
				<Navbar />
			</MemoryRouter>,
		);

		const logoutBtn = screen.getByTitle(/Logout/i);
		fireEvent.click(logoutBtn);

		expect(mockLogout).toHaveBeenCalledTimes(1);
	});
});
