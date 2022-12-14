import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import dayjs from "dayjs";
import { authOptions } from "../api/auth/[...nextauth]";
import apiFetch from "../../utils/apiFetch";
import style from "../../styles/UserProfile.module.css";
import Image from "next/image";

export async function getServerSideProps({ req, res, params }) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const response = await apiFetch(`/api/v1/user/${params.id}`, {
    headers: { Authorization: session.user.accessToken },
  });

  if (response.status === 404) {
    return {
      notFound: true,
    };
  }

  const profile = await response.json();

  return {
    props: {
      profile,
    },
  };
}

export default function UserProfile({ profile }) {
  return (
    <>
      <Head>
        <title>{`${profile.data.username} Profile Information - Binar Games`}</title>
      </Head>
      <div className={style.content}>
        <div className="row justify-content-center">
          <div className="col-lg-6 col-sm-7 px-sm-3 d-flex flex-column justify-content-center text-light">
            <div className={style.right}>
              <div className="container p-5">
                <h2 className="text-center">
                  {profile.data.username}&apos;s profile
                </h2>
                <br />
                <div>
                  <Image
                    width="100em"
                    height="100em"
                    src={profile.data.profile_pic ?? "/images/profile-pic.jpg"}
                    alt="cartoon"
                    className="img-fluid rounded-circle border border-dark"
                    priority
                  />
                  <h5>Username:</h5>
                  <p>{profile.data.username}</p>
                  <h5>Total Score:</h5>
                  <p>{profile.data.total_score}</p>
                  <h5>Bio:</h5>
                  <p>{profile.data.bio}</p>
                  <h5>Social Media:</h5>
                  <p>{profile.data.social_media_url}</p>
                  <h5>City:</h5>
                  <p>{profile.data.city}</p>
                  <h5>Joined At:</h5>
                  <p>{dayjs(profile.data.createdAt).format("MMM D, YYYY")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
