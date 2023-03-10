import { signIn, signOut, useSession } from "next-auth/react";

import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { NextPage } from "next";
import { getServerAuthSession } from "../server/auth";

export const getServerSideProps = async ({
  req,
  res,
}: CreateNextContextOptions) => {
  const session = await getServerAuthSession({ req, res });
  if (session?.user) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};

const Login: NextPage = () => {
  return <AuthShowcase />;
};

export default Login;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
