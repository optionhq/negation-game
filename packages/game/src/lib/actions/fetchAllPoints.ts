"use server";

import { DEFAULT_CHANNELID, ROOT_CAST_ID } from "@/config";
import { Node } from "@/types/Points";
import { sql } from "kysely";
import { queryFarcasterDb } from "../clients/neynarDb";

export const fetchAllPoints = async ({
	pageNumber,
	pageSize,
}: {
	pageNumber: number;
	pageSize: number;
}) => {
	return await queryFarcasterDb(async (client) => {
		const queryBuilder = client
			.selectFrom("casts as c")
			.leftJoin("reactions as r", (join) =>
				join
					.onRef("c.hash", "=", "r.target_hash")
					.onRef("c.fid", "=", "r.target_fid")
					.on("r.deleted_at", "is", null)
					.on("r.reaction_type", "=", 1)
					.on(
						"r.fid",
						"in",
						sql<string>`(${sql.raw(process.env.NEXT_PUBLIC_PLAYLIST ?? "")})`,
					),
			)
			.leftJoin("profile_with_addresses as p", (join) =>
				join.onRef("c.fid", "=", "p.fid"),
			)
			// .leftJoin(
			// 	(e) =>
			// 		e
			// 			.selectFrom("casts")
			// 			.select([
			// 				"parent_hash",
			// 				sql<number | null>`COUNT(hash)::int`.as("replies_count"),
			// 			])
			// 			.where("deleted_at", "is", null)
			// 			.groupBy("parent_hash")
			// 			.as("reply"),
			// 	(j) => j.onRef("c.hash", "=", "reply.parent_hash"),
			// )
			.select([
				// "replies_count",
				"p.fname",
				"c.created_at",
				"c.fid",
				"p.display_name",
				"p.avatar_url",
				"c.text",
				sql<`0x${string}`>`CONCAT('0x',encode(c.hash, 'hex'))`.as("id"),
				sql<
					`0x${string}` | null
				>`(CASE WHEN (c.parent_hash IS NULL) THEN NULL ELSE CONCAT('0x',encode(c.parent_hash, 'hex')) END)`.as(
					"parent_id",
				),
				sql<number[]>`array_remove(array_agg(r.fid::int), null)`.as("likers"),
			])
			.where((e) =>
				e.and([
					e(
						"c.fid",
						"in",
						sql<string>`(${sql.raw(process.env.NEXT_PUBLIC_PLAYLIST ?? "")})`,
					),
					e("c.deleted_at", "is", null),
					e(
						"c.hash",
						"!=",
						sql<Buffer>`'\\x${sql.raw(`${ROOT_CAST_ID.slice(2)}`)}'::bytea`,
					),
					e.or([
						e("c.parent_url", "=", DEFAULT_CHANNELID),

						e(
							"c.parent_hash",
							"=",
							sql<Buffer>`'\\x${sql.raw(`${ROOT_CAST_ID.slice(2)}`)}'::bytea`,
						),
					]),
				]),
			)
			.$narrowType<{ fname: string }>()
			.groupBy([
				"c.hash",
				"c.parent_hash",
				"p.fname",
				"c.created_at",
				"c.fid",
				"p.fid",
				"p.display_name",
				"p.avatar_url",
				"c.text",
				// "replies_count",
			])
			.limit(pageSize)
			.offset(pageNumber * pageSize)
			.orderBy("c.created_at", "desc");

		return (await queryBuilder.execute()).map(
			(cast): Node => ({
				title: cast.text,
				id: cast.id,

				author: {
					username: cast.fname,
					display_name: cast.display_name!,
					fid: parseInt(cast.fid!),
					pfp_url: cast.avatar_url!,
				},
				type: "root",
				advocates: cast.likers.map((fid) => ({ fid })),
				points: cast.likers.length,
				// replyCount: cast.replies_count ?? 0,
			}),
		);
	});
};
