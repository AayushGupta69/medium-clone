import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string;
		JWT_SECRET: string;
	},
  Variables: {
    userId: string;
  }
}>();

// Middleware to verify if the user is authenticated
blogRouter.use('/*', async (c, next) => {
	const authHeader = c.req.header("authorization") || "";
	try {
		const user = await verify(authHeader, c.env.JWT_SECRET);
		if(user){
			c.set("userId", user.id);
			await next();
		}
	} catch (error) {
		return c.json({
			message: "Unauthorized. Please login to access this resource."
		}, 403);
	}
})