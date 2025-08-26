import { auth } from "@clerk/nextjs/server"
import HomePage from "./home-page"

export default async function Page() {
  const { userId } = auth()

  return <HomePage userId={userId} />
}
