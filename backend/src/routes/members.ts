import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { db } from "../db";
import { boardMembers, boards, users, activities } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const memberRoutes = new Elysia({ prefix: "/members" })
  .use(authMiddleware)

  // GET BOARD MEMBERS
  .get(
    "/board/:boardId",
    async ({ user, params, set }) => {
      // Check board access
      const board = await db.query.boards.findFirst({
        where: eq(boards.id, params.boardId),
        with: {
          members: true,
        },
      });

      if (!board) {
        set.status = 404;
        return { error: "Board not found" };
      }

      const isMember = board.members.some((m) => m.userId === user.id);
      const isOwner = board.ownerId === user.id;

      if (!board.isPublic && !isMember && !isOwner) {
        set.status = 403;
        return { error: "Access denied" };
      }

      const members = await db.query.boardMembers.findMany({
        where: eq(boardMembers.boardId, params.boardId),
        with: {
          user: {
            columns: {
              id: true,
              email: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      });

      return { members };
    },
    {
      params: t.Object({
        boardId: t.String({
          format: "uuid",
          default: "123e4567-e89b-12d3-a456-426614174000",
        }),
      }),
      detail: {
        tags: ["Members"],
        summary: "Get board members",
        description: "Get all members of a board",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // ADD MEMBER: to board
  .post(
    "/",
    async ({ user, body, set }) => {
      const { boardId, email, role } = body;

      // Check if user is board owner
      const board = await db.query.boards.findFirst({
        where: eq(boards.id, boardId),
      });

      if (!board) {
        set.status = 404;
        return { error: "Board not found" };
      }

      if (board.ownerId !== user.id) {
        set.status = 403;
        return { error: "Only board owner can add members" };
      }

      // Find user by email
      const targetUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!targetUser) {
        set.status = 404;
        return { error: "User not found with this email" };
      }

      // Check if already member
      const existingMember = await db.query.boardMembers.findFirst({
        where: and(
          eq(boardMembers.boardId, boardId),
          eq(boardMembers.userId, targetUser.id)
        ),
      });

      if (existingMember) {
        set.status = 400;
        return { error: "User is already a board member" };
      }

      const [newMember] = await db
        .insert(boardMembers)
        .values({
          boardId,
          userId: targetUser.id,
          role: role || "viewer",
        })
        .returning();

      // Get member with user info
      const memberWithUser = await db.query.boardMembers.findFirst({
        where: eq(boardMembers.id, newMember.id),
        with: {
          user: {
            columns: {
              id: true,
              email: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Log activity
      await db.insert(activities).values({
        boardId,
        userId: user.id,
        action: "created",
        entityType: "board",
        entityId: boardId,
        metadata: {
          action: "member_added",
          newMemberId: targetUser.id,
          newMemberEmail: email,
          role,
        },
      });

      set.status = 201;
      return { member: memberWithUser };
    },
    {
      body: t.Object({
        boardId: t.String({
          format: "uuid",
          default: "123e4567-e89b-12d3-a456-426614174000",
          description: "Board ID",
        }),
        email: t.String({
          format: "email",
          default: "member@example.com",
          description: "Email of user to add",
        }),
        role: t.Optional(
          t.Union(
            [t.Literal("owner"), t.Literal("editor"), t.Literal("viewer")],
            {
              default: "viewer",
              description: "Member role",
            }
          )
        ),
      }),
      detail: {
        tags: ["Members"],
        summary: "Add member to board",
        description: "Invite a user to join the board (owner only)",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // UPDATE MEMBER ROLE
  .patch(
    "/:id",
    async ({ user, params, body, set }) => {
      const member = await db.query.boardMembers.findFirst({
        where: eq(boardMembers.id, params.id),
        with: {
          board: true,
        },
      });

      if (!member) {
        set.status = 404;
        return { error: "Member not found" };
      }

      if (member.board.ownerId !== user.id) {
        set.status = 403;
        return { error: "Only board owner can update member roles" };
      }

      // Cannot change owner's role
      if (member.userId === member.board.ownerId) {
        set.status = 400;
        return { error: "Cannot change board owner role" };
      }

      const [updatedMember] = await db
        .update(boardMembers)
        .set({ role: body.role })
        .where(eq(boardMembers.id, params.id))
        .returning();

      // Get member with user info
      const memberWithUser = await db.query.boardMembers.findFirst({
        where: eq(boardMembers.id, updatedMember.id),
        with: {
          user: {
            columns: {
              id: true,
              email: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      });
      // Log activity
      await db.insert(activities).values({
        boardId: member.boardId,
        userId: user.id,
        action: "updated",
        entityType: "board",
        entityId: member.boardId,
        metadata: {
          action: "member_role_changed",
          memberId: member.userId,
          newRole: body.role,
        },
      });

      return { member: memberWithUser };
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        role: t.Union(
          [t.Literal("owner"), t.Literal("editor"), t.Literal("viewer")],
          {
            default: "editor",
          }
        ),
      }),
      detail: {
        tags: ["Members"],
        summary: "Update member role",
        description: "Change member role (owner only)",
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // REMOVE MEMBER: from board
  .delete(
    "/:id",
    async ({ user, params, set }) => {
      const member = await db.query.boardMembers.findFirst({
        where: eq(boardMembers.id, params.id),
        with: {
          board: true,
        },
      });
      if (!member) {
        set.status = 404;
        return { error: "Member not found" };
      }

      // Only board owner or member themselves can remove
      const isBoardOwner = member.board.ownerId === user.id;
      const isSelf = member.userId === user.id;

      if (!isBoardOwner && !isSelf) {
        set.status = 403;
        return { error: "Access denied" };
      }

      // Cannot remove board owner
      if (member.userId === member.board.ownerId) {
        set.status = 400;
        return { error: "Cannot remove board owner" };
      }

      await db.delete(boardMembers).where(eq(boardMembers.id, params.id));

      // Log activity
      await db.insert(activities).values({
        boardId: member.boardId,
        userId: user.id,
        action: "deleted",
        entityType: "board",
        entityId: member.boardId,
        metadata: {
          action: "member_removed",
          removedMemberId: member.userId,
        },
      });

      return { message: "Member removed successfully" };
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        tags: ["Members"],
        summary: "Remove member",
        description:
          "Remove member from board (owner only, or member can leave)",
        security: [{ bearerAuth: [] }],
      },
    }
  );
