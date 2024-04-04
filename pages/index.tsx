import { getApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import {
  AuthAction,
  User,
  useUser,
  withUser,
  withUserTokenSSR,
} from "next-firebase-auth";

const Home = ({ thing }: { thing: User }) => {
  console.log(thing);
  const user = useUser();

  const signout = async () => {
    await signOut(getAuth(getApp()));
  };

  return (
    <div>
      <p>Your email is {user.email ? user.email : "unknown"}.</p>
      <button
        onClick={() => {
          signout();
        }}
      >
        로그아웃
      </button>
    </div>
  );
};

export const getServerSideProps = withUserTokenSSR()(async ({ user }) => {
  const token = await user?.getIdToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`, {
    method: "GET",
    headers: {
      authorization: token,
    } as any,
  });
  const data = await response.json();
  return {
    props: {
      thing: data.user || { null: null },
    },
  };
});

export default withUser<{ thing: User }>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
