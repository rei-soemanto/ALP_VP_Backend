-- DropForeignKey
ALTER TABLE "public"."users_interests" DROP CONSTRAINT "users_interests_interest_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users_interests" DROP CONSTRAINT "users_interests_user_id_fkey";

-- AddForeignKey
ALTER TABLE "users_interests" ADD CONSTRAINT "users_interests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_interests" ADD CONSTRAINT "users_interests_interest_id_fkey" FOREIGN KEY ("interest_id") REFERENCES "interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
